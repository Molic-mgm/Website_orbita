import React from 'react';
import { Code, Smartphone, Cloud, Palette, Database, Rocket } from 'lucide-react';
import StarField from '../components/StarField';

const Services = () => {
  const services = [
    {
      icon: Code,
      title: 'Веб-разработка',
      description: 'Создание современных веб-приложений на React, Vue, Angular',
      features: ['SPA приложения', 'Progressive Web Apps', 'E-commerce платформы']
    },
    {
      icon: Smartphone,
      title: 'Мобильная разработка',
      description: 'Кроссплатформенные мобильные приложения',
      features: ['React Native', 'Flutter', 'iOS & Android']
    },
    {
      icon: Database,
      title: 'Backend разработка',
      description: 'Надежные серверные решения и API',
      features: ['Node.js', 'Python', 'REST API & GraphQL']
    },
    {
      icon: Cloud,
      title: 'Cloud Solutions',
      description: 'Облачные решения и DevOps',
      features: ['AWS', 'Google Cloud', 'Docker & Kubernetes']
    },
    {
      icon: Palette,
      title: 'UI/UX Design',
      description: 'Современный дизайн интерфейсов',
      features: ['Дизайн системы', 'Прототипирование', 'Брендинг']
    },
    {
      icon: Rocket,
      title: 'Консалтинг',
      description: 'Техническое консультирование и аудит',
      features: ['Код-ревью', 'Архитектура', 'Оптимизация']
    }
  ];

  return (
    <div className="relative min-h-screen">
      <StarField />

      <div className="relative z-10 pt-32 pb-24 px-6">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent">
              Наши услуги
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Полный спектр услуг для создания цифровых продуктов
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="p-8 rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/50 border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300 group hover:shadow-2xl hover:shadow-cyan-500/20"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 mb-6">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-300 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
