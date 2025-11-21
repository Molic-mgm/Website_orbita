import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { LayoutDashboard, FileText, FolderOpen, LogOut } from 'lucide-react';
import StarField from '../../components/StarField';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalQuotes: 0,
    newQuotes: 0,
    totalProjects: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const username = localStorage.getItem('adminUsername');
      const password = localStorage.getItem('adminPassword');
      const auth = btoa(`${username}:${password}`);

      const [quotesRes, projectsRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/admin/quotes`, {
          headers: { 'Authorization': `Basic ${auth}` }
        }),
        axios.get(`${BACKEND_URL}/api/admin/projects`, {
          headers: { 'Authorization': `Basic ${auth}` }
        })
      ]);

      const quotes = quotesRes.data;
      setStats({
        totalQuotes: quotes.length,
        newQuotes: quotes.filter(q => q.status === 'new').length,
        totalProjects: projectsRes.data.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminUsername');
    localStorage.removeItem('adminPassword');
    navigate('/admin/login');
  };

  const menuItems = [
    {
      title: 'Заявки',
      description: `Всего: ${stats.totalQuotes} | Новых: ${stats.newQuotes}`,
      icon: FileText,
      path: '/admin/quotes',
      gradient: 'from-cyan-900/30 to-blue-900/30',
      border: 'border-cyan-500/30 hover:border-cyan-400/50'
    },
    {
      title: 'Проекты',
      description: `Всего: ${stats.totalProjects}`,
      icon: FolderOpen,
      path: '/admin/projects',
      gradient: 'from-purple-900/30 to-pink-900/30',
      border: 'border-purple-500/30 hover:border-purple-400/50'
    }
  ];

  return (
    <div className="relative min-h-screen">
      <StarField />

      <div className="relative z-10 pt-24 pb-24 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent mb-2">
                Админ-панель
              </h1>
              <p className="text-gray-400">Управление заявками и проектами</p>
            </div>
            <Button
              onClick={handleLogout}
              data-testid="admin-logout-btn"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <LogOut className="mr-2" size={18} />
              Выйти
            </Button>
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`p-10 rounded-3xl bg-gradient-to-br ${item.gradient} border ${item.border} transition-all duration-300 group hover:shadow-2xl hover:scale-105`}
                >
                  <div className="flex items-start space-x-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-400">{item.description}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
