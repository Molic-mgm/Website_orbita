import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageSquare } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-[#0a0a0f] border-t border-gray-800 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full border-2 border-white/80"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent">
                Orbita
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Разработка современных веб-приложений и цифровых решений
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Навигация</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/projects" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  Проекты
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  Услуги
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  Контакты
                </Link>
              </li>
              <li>
                <Link to="/quote" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  Оставить заявку
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Связь</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <a href="https://t.me/orbita_dev" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  @orbita_dev
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-cyan-400" />
                <a href="mailto:contact@orbita.dev" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  contact@orbita.dev
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Orbita. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
