import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Send, CheckCircle } from 'lucide-react';
import StarField from '../components/StarField';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Quote = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/quote`, formData);
      
      if (response.data.success) {
        toast.success('Заявка отправлена!', {
          description: 'Мы свяжемся с вами в ближайшее время.',
        });
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        toast.error('Ошибка', {
          description: response.data.message || 'Не удалось отправить заявку.',
        });
      }
    } catch (error) {
      console.error('Error submitting quote:', error);
      toast.error('Ошибка', {
        description: 'Не удалось отправить заявку. Попробуйте позже.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <StarField />

      <div className="relative z-10 pt-32 pb-24 px-6">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent">
              Оставить заявку
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Расскажите о вашем проекте, и мы свяжемся с вами в ближайшее время
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              {/* Contact Form */}
              <div className="lg:col-span-3 p-8 rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/50 border border-gray-700/50">
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent">
                  Форма заявки
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6" data-testid="quote-form">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Ваше имя *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      data-testid="quote-name-input"
                      className="w-full bg-gray-800/50 border-gray-600 text-white focus:border-cyan-400 focus:ring-cyan-400"
                      placeholder="Иван Петров"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      data-testid="quote-email-input"
                      className="w-full bg-gray-800/50 border-gray-600 text-white focus:border-cyan-400 focus:ring-cyan-400"
                      placeholder="ivan@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                      Телефон
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      data-testid="quote-phone-input"
                      className="w-full bg-gray-800/50 border-gray-600 text-white focus:border-cyan-400 focus:ring-cyan-400"
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Сообщение *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      data-testid="quote-message-input"
                      className="w-full bg-gray-800/50 border-gray-600 text-white focus:border-cyan-400 focus:ring-cyan-400 resize-none"
                      placeholder="Расскажите о вашем проекте..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    data-testid="quote-submit-btn"
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-6 text-lg rounded-full hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-spin mr-2">⏳</span> Отправка...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Send className="mr-2" size={20} /> Отправить заявку
                      </span>
                    )}
                  </Button>
                </form>
              </div>

              {/* Why Choose Us */}
              <div className="lg:col-span-2 space-y-6">
                <div className="p-8 rounded-3xl bg-gradient-to-br from-cyan-900/20 to-purple-900/20 border border-cyan-500/20">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Что дальше?
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-cyan-400 font-bold">1</span>
                      </div>
                      <div>
                        <p className="text-white font-semibold mb-1">Анализ проекта</p>
                        <p className="text-gray-400 text-sm">Изучим ваши требования</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-cyan-400 font-bold">2</span>
                      </div>
                      <div>
                        <p className="text-white font-semibold mb-1">Коммерческое предложение</p>
                        <p className="text-gray-400 text-sm">Подготовим план и смету</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-cyan-400 font-bold">3</span>
                      </div>
                      <div>
                        <p className="text-white font-semibold mb-1">Запуск проекта</p>
                        <p className="text-gray-400 text-sm">Начнем разработку</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/50 border border-gray-700/50">
                  <h4 className="text-lg font-bold text-white mb-3">
                    Гарантии
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">Бесплатная консультация</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">Ответ в течение 24 часов</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">Конфиденциальность</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quote;
