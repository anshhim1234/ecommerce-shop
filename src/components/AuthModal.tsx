import React, { useState } from 'react';
import { X } from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose,
  defaultTab = 'login'
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(defaultTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  
  const { login, register, loading } = useAuth();
  
  if (!isOpen) return null;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (activeTab === 'login') {
        await login(email, password);
        onClose();
      } else {
        await register(name, email, password);
        onClose();
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md">
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button
              onClick={onClose}
              className="rounded-md bg-white text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                {activeTab === 'login' ? 'Sign in to your account' : 'Create your account'}
              </h2>
            </div>
            
            <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
              <div className="flex border-b border-gray-200">
                <button
                  className={`flex-1 py-2 text-center font-medium ${
                    activeTab === 'login'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('login')}
                >
                  Sign in
                </button>
                <button
                  className={`flex-1 py-2 text-center font-medium ${
                    activeTab === 'signup'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('signup')}
                >
                  Sign up
                </button>
              </div>
              
              <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                {activeTab === 'signup' && (
                  <Input
                    label="Name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    fullWidth
                  />
                )}
                
                <Input
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                />
                
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  fullWidth
                />
                
                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="text-sm text-red-700">{error}</div>
                    </div>
                  </div>
                )}
                
                <div>
                  <Button
                    type="submit"
                    fullWidth
                    isLoading={loading}
                  >
                    {activeTab === 'login' ? 'Sign in' : 'Sign up'}
                  </Button>
                </div>
              </form>
              
              {activeTab === 'login' && (
                <p className="mt-4 text-center text-sm text-gray-500">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                    Forgot your password?
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;