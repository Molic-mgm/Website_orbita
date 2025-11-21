import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { LogIn } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import StarField from '../../components/StarField';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/admin/login`, credentials);
      
      if (response.data.success) {
        localStorage.setItem('adminAuth', 'true');
        localStorage.setItem('adminUsername', credentials.username);
        localStorage.setItem('adminPassword', credentials.password);
        toast.success('Успешный вход!');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Неверный логин или пароль');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <StarField />
      
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="p-8 rounded-3xl bg-gradient-to-br from-gray-900/90 to-gray-800/70 border border-gray-700/50 backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent">
              Админ-панель
            </h1>
            <p className="text-gray-400 mt-2">Войдите, чтобы продолжить</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" data-testid="admin-login-form">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Логин
              </label>
              <Input
                type="text"
                required
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                data-testid="admin-username-input"
                className="w-full bg-gray-800/50 border-gray-600 text-white focus:border-cyan-400 focus:ring-cyan-400"
                placeholder="admin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Пароль
              </label>
              <Input
                type="password"
                required
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                data-testid="admin-password-input"
                className="w-full bg-gray-800/50 border-gray-600 text-white focus:border-cyan-400 focus:ring-cyan-400"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              data-testid="admin-login-btn"
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-6 text-lg rounded-full hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/50"
            >
              {isLoading ? 'Вход...' : 'Войти'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
