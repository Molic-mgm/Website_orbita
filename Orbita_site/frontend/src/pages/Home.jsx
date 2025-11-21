import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowRight, Code, Zap, Shield } from 'lucide-react';
import StarField from '../components/StarField';

const Home = () => {
  return (
    <div className="relative min-h-screen">
      <StarField />

      {/* Hero Section */}
      <div className="relative z-10 pt-32 pb-24 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-fade-in">
            Создаем будущее вместе
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Разработка современных веб-приложений и цифровых решений для вашего бизнеса
          </p>
          <Link to="/quote">
            <Button 
              data-testid="hero-quote-btn"
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold px-10 py-6 text-lg rounded-full hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/50">
              Оставить заявку <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 py-24 px-6">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent">
            Почему выбирают нас
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300 group hover:shadow-2xl hover:shadow-cyan-500/20">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Code className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Современные технологии</h3>
              <p className="text-gray-400">
                Используем последние технологии и лучшие практики разработки
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 group hover:shadow-2xl hover:shadow-purple-500/20">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Быстрая разработка</h3>
              <p className="text-gray-400">
                Эффективные процессы разработки для быстрого запуска проектов
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 group hover:shadow-2xl hover:shadow-blue-500/20">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Надежность</h3>
              <p className="text-gray-400">
                Гарантируем качество и надежность наших решений
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
