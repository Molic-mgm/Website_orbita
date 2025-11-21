import React from 'react';
import { Send, Mail, MessageSquare } from 'lucide-react';
import StarField from '../components/StarField';

const Contact = () => {
  return (
    <div className="relative min-h-screen">
      <StarField />

      <div className="relative z-10 pt-32 pb-24 px-6">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent">
              Контакты
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Свяжитесь с нами удобным для вас способом
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Telegram */}
            <div className="p-10 rounded-3xl bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300 group hover:shadow-2xl hover:shadow-cyan-500/20">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                  <MessageSquare className="w-10 h-10 text-white" />
                </div>
                <div className="text-center md:text-left flex-1">
                  <h3 className="text-3xl font-bold text-white mb-3">
                    Telegram
                  </h3>
                  <p className="text-gray-400 mb-4 text-lg">
                    Наш официальный канал для связи. Пишите нам в любое время!
                  </p>
                  <a
                    href="https://t.me/orbita_dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors font-medium text-lg group"
                  >
                    @orbita_dev
                    <Send size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="p-10 rounded-3xl bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 group hover:shadow-2xl hover:shadow-purple-500/20">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                  <Mail className="w-10 h-10 text-white" />
                </div>
                <div className="text-center md:text-left flex-1">
                  <h3 className="text-3xl font-bold text-white mb-3">
                    Email
                  </h3>
                  <p className="text-gray-400 mb-4 text-lg">
                    Напишите нам на почту, и мы обязательно ответим
                  </p>
                  <a
                    href="mailto:contact@orbita.dev"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium text-lg"
                  >
                    contact@orbita.dev
                  </a>
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className="p-10 rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/50 border border-gray-700/50">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                Режим работы
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                <div>
                  <p className="text-gray-400 mb-2">Понедельник - Пятница</p>
                  <p className="text-cyan-400 font-semibold text-xl">10:00 - 19:00 МСК</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-2">Суббота - Воскресенье</p>
                  <p className="text-cyan-400 font-semibold text-xl">Выходной</p>
                </div>
              </div>
              <p className="text-gray-500 text-center mt-6 text-sm">
                * В Telegram отвечаем круглосуточно
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
