from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import List, Optional
import stripe
from datetime import datetime
import os

# Stripe setup
stripe.api_key = "your_stripe_secret_key"  # Replace with your Stripe secret key

# Database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./shop.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Models
class Product(Base):
    __tablename__ = "products"
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String)
    price = Column(Float, nullable=False)
    image = Column(String)
    category = Column(String)
    rating = Column(Float)
    reviews = Column(Integer)
    in_stock = Column(Boolean, default=True)

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(String, primary_key=True)
    user_id = Column(String, nullable=False)
    total = Column(Float, nullable=False)
    status = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    payment_intent_id = Column(String, unique=True)

# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic models
class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    image: str
    category: str
    rating: float
    reviews: int
    in_stock: bool

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: str
    
    class Config:
        orm_mode = True

class OrderCreate(BaseModel):
    items: List[dict]
    total: float

class PaymentIntentResponse(BaseModel):
    clientSecret: str

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API endpoints
@app.get("/api/products", response_model=List[ProductResponse])
def get_products(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Product)
    if category:
        query = query.filter(Product.category == category)
    return query.offset(skip).limit(limit).all()

@app.get("/api/products/{product_id}", response_model=ProductResponse)
def get_product(product_id: str, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.post("/api/products", response_model=ProductResponse)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    import uuid
    db_product = Product(id=str(uuid.uuid4()), **product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@app.post("/api/create-payment-intent", response_model=PaymentIntentResponse)
async def create_payment_intent(order: OrderCreate, db: Session = Depends(get_db)):
    try:
        # Create a PaymentIntent with the order amount and currency
        payment_intent = stripe.PaymentIntent.create(
            amount=int(order.total * 100),  # Convert to cents
            currency="usd",
            automatic_payment_methods={
                "enabled": True,
            },
        )
        
        # Create order in database
        import uuid
        new_order = Order(
            id=str(uuid.uuid4()),
            user_id="user_id",  # Replace with actual user ID from auth
            total=order.total,
            status="pending",
            payment_intent_id=payment_intent.id
        )
        db.add(new_order)
        db.commit()
        
        return {"clientSecret": payment_intent.client_secret}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, "your_webhook_secret"
        )
        
        if event.type == "payment_intent.succeeded":
            payment_intent = event.data.object
            # Update order status
            db = SessionLocal()
            order = db.query(Order).filter(Order.payment_intent_id == payment_intent.id).first()
            if order:
                order.status = "paid"
                db.commit()
            db.close()
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    return {"status": "success"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)