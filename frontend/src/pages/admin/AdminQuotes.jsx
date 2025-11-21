import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Trash2, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import StarField from '../../components/StarField';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const getAuthHeader = () => {
    const username = localStorage.getItem('adminUsername');
    const password = localStorage.getItem('adminPassword');
    return { 'Authorization': `Basic ${btoa(`${username}:${password}`)}` };
  };

  const fetchQuotes = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BACKEND_URL}/api/admin/quotes`, {
        headers: getAuthHeader()
      });
      setQuotes(response.data);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      toast.error('Ошибка загрузки заявок');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (quoteId) => {
    if (!window.confirm('Удалить эту заявку?')) return;

    try {
      await axios.delete(`${BACKEND_URL}/api/admin/quotes/${quoteId}`, {
        headers: getAuthHeader()
      });
      toast.success('Заявка удалена');
      fetchQuotes();
    } catch (error) {
      console.error('Error deleting quote:', error);
      toast.error('Ошибка удаления');
    }
  };

  const handleStatusChange = async (quoteId, newStatus) => {
    try {
      await axios.patch(`${BACKEND_URL}/api/admin/quotes/${quoteId}/status`, 
        { status: newStatus },
        { headers: getAuthHeader() }
      );
      toast.success('Статус обновлен');
      fetchQuotes();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Ошибка обновления статуса');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      new: 'bg-green-500/20 text-green-400 border-green-500/30',
      in_progress: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      completed: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    const labels = {
      new: 'Новая',
      in_progress: 'В работе',
      completed: 'Завершена'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="relative min-h-screen">
      <StarField />

      <div className="relative z-10 pt-24 pb-24 px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link to="/admin/dashboard">
                <Button variant="ghost" className="text-gray-400 hover:text-white">
                  <ArrowLeft className="mr-2" size={18} />
                  Назад
                </Button>
              </Link>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent">
                Заявки
              </h1>
            </div>
            <div className="text-gray-400">
              Всего: {quotes.length}
            </div>
          </div>

          {/* Quotes List */}
          {isLoading ? (
            <div className="text-center py-20">
              <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : quotes.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">Заявок пока нет</p>
            </div>
          ) : (
            <div className="space-y-6">
              {quotes.map((quote) => (
                <div
                  key={quote.id}
                  className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/50 border border-gray-700/50 hover:border-cyan-500/50 transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1 space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">{quote.name}</h3>
                          <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                            <span className="flex items-center">
                              <Mail className="w-4 h-4 mr-1" />
                              {quote.email}
                            </span>
                            {quote.phone && (
                              <span className="flex items-center">
                                <Phone className="w-4 h-4 mr-1" />
                                {quote.phone}
                              </span>
                            )}
                          </div>
                        </div>
                        {getStatusBadge(quote.status)}
                      </div>

                      {/* Message */}
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <p className="text-gray-300 whitespace-pre-wrap">{quote.message}</p>
                      </div>

                      {/* Meta Info */}
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {quote.country} ({quote.ip_address})
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(quote.created_at).toLocaleString('ru-RU')}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-2">
                      <select
                        value={quote.status}
                        onChange={(e) => handleStatusChange(quote.id, e.target.value)}
                        className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:border-cyan-400 focus:outline-none"
                      >
                        <option value="new">Новая</option>
                        <option value="in_progress">В работе</option>
                        <option value="completed">Завершена</option>
                      </select>
                      <Button
                        onClick={() => handleDelete(quote.id)}
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminQuotes;
