import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { ArrowLeft, Plus, Trash2, Edit2, X } from 'lucide-react';
import StarField from '../../components/StarField';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tech: '',
    image: '',
    link: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const getAuthHeader = () => {
    const username = localStorage.getItem('adminUsername');
    const password = localStorage.getItem('adminPassword');
    return { 'Authorization': `Basic ${btoa(`${username}:${password}`)}` };
  };

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BACKEND_URL}/api/admin/projects`, {
        headers: getAuthHeader()
      });
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Ошибка загрузки проектов');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        description: project.description,
        tech: project.tech.join(', '),
        image: project.image,
        link: project.link || ''
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        description: '',
        tech: '',
        image: '',
        link: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProject(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const projectData = {
      title: formData.title,
      description: formData.description,
      tech: formData.tech.split(',').map(t => t.trim()).filter(t => t),
      image: formData.image,
      link: formData.link || null
    };

    try {
      if (editingProject) {
        await axios.put(
          `${BACKEND_URL}/api/admin/projects/${editingProject.id}`,
          projectData,
          { headers: getAuthHeader() }
        );
        toast.success('Проект обновлен');
      } else {
        await axios.post(
          `${BACKEND_URL}/api/admin/projects`,
          projectData,
          { headers: getAuthHeader() }
        );
        toast.success('Проект создан');
      }
      handleCloseModal();
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Ошибка сохранения');
    }
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm('Удалить этот проект?')) return;

    try {
      await axios.delete(`${BACKEND_URL}/api/admin/projects/${projectId}`, {
        headers: getAuthHeader()
      });
      toast.success('Проект удален');
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Ошибка удаления');
    }
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
                Проекты
              </h1>
            </div>
            <Button
              onClick={() => handleOpenModal()}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
              data-testid="add-project-btn"
            >
              <Plus className="mr-2" size={18} />
              Добавить проект
            </Button>
          </div>

          {/* Projects Grid */}
          {isLoading ? (
            <div className="text-center py-20">
              <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg mb-4">Проектов пока нет</p>
              <Button
                onClick={() => handleOpenModal()}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white"
              >
                <Plus className="mr-2" size={18} />
                Создать первый проект
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-800/50 border border-gray-700/50 hover:border-cyan-500/50 transition-all group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/800x600?text=No+Image';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-xs rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleOpenModal(project)}
                        variant="ghost"
                        size="sm"
                        className="flex-1 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                      >
                        <Edit2 size={16} className="mr-1" />
                        Редактировать
                      </Button>
                      <Button
                        onClick={() => handleDelete(project.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 rounded-3xl bg-gradient-to-br from-gray-900/95 to-gray-800/95 border border-gray-700/50">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-white mb-6">
              {editingProject ? 'Редактировать проект' : 'Создать проект'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Название *
                </label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-gray-800/50 border-gray-600 text-white"
                  placeholder="E-Commerce Platform"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Описание *
                </label>
                <Textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  className="w-full bg-gray-800/50 border-gray-600 text-white resize-none"
                  placeholder="Опишите проект..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Технологии (через запятую) *
                </label>
                <Input
                  required
                  value={formData.tech}
                  onChange={(e) => setFormData({...formData, tech: e.target.value})}
                  className="w-full bg-gray-800/50 border-gray-600 text-white"
                  placeholder="React, Node.js, MongoDB"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  URL изображения *
                </label>
                <Input
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full bg-gray-800/50 border-gray-600 text-white"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ссылка на проект
                </label>
                <Input
                  value={formData.link}
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                  className="w-full bg-gray-800/50 border-gray-600 text-white"
                  placeholder="https://example.com"
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                >
                  {editingProject ? 'Сохранить' : 'Создать'}
                </Button>
                <Button
                  type="button"
                  onClick={handleCloseModal}
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                >
                  Отмена
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;
