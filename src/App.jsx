import React, { useState, useEffect } from 'react';
import { LogOut, Menu, X, User as UserIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Componentes Compartidos
import LoginScreen from './components/shared/LoginScreen';
import Sidebar from './components/shared/Sidebar';
import Perfil from './components/shared/Perfil';

// Componentes Administrador
import AdminDashboard from './components/admin/AdminDashboard';
import AdminServicios from './components/admin/AdminServicios';
import AdminConsultoria from './components/admin/AdminConsultoria';
import AdminSoporte from './components/admin/AdminSoporte';

// Componentes Cliente
import ClientDashboard from './components/client/ClientDashboard';
import ClientServicios from './components/client/ClientServicios';
import ClientConsultoria from './components/client/ClientConsultoria';
import ClientSoporte from './components/client/ClientSoporte';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- ESTADOS GLOBALES (Nuestra base de datos en memoria) ---
  const [projects, setProjects] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [services, setServices] = useState([]);
  const [consultancies, setConsultancies] = useState([]);

  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem('bitnova_clients');
    return saved ? JSON.parse(saved) : [];
  });

  // --- ¡AQUÍ ESTÁ LA CORRECCIÓN! ---
  // Extraemos la lista de usuarios del Login y filtramos solo los que son clientes
  // Esto hace que clientUsers exista antes de usarse en renderContent.
  const storedUsers = JSON.parse(localStorage.getItem('bitnova_users') || '[]');
  const clientUsers = storedUsers.filter(u => u.role === 'client');

  const saveClients = (newClients) => {
    setClients(newClients);
    localStorage.setItem('bitnova_clients', JSON.stringify(newClients));
  };

  // --- 1. CARGAR DATOS DEL LOCALSTORAGE AL INICIAR ---
  useEffect(() => {
    const savedUser = localStorage.getItem('bitnova_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const savedProjects = localStorage.getItem('bitnova_projects');
    if (savedProjects) setProjects(JSON.parse(savedProjects));

    const savedTickets = localStorage.getItem('bitnova_tickets');
    if (savedTickets) setTickets(JSON.parse(savedTickets));

    const savedServices = localStorage.getItem('bitnova_services');
    if (savedServices) setServices(JSON.parse(savedServices));

    const savedConsultancies = localStorage.getItem('bitnova_consultancies');
    if (savedConsultancies) setConsultancies(JSON.parse(savedConsultancies));
  }, []);

  // --- 2. FUNCIONES PARA ACTUALIZAR Y GUARDAR EN LOCALSTORAGE ---
  const saveProjects = (data) => {
    setProjects(data);
    localStorage.setItem('bitnova_projects', JSON.stringify(data));
  };
  const saveTickets = (data) => {
    setTickets(data);
    localStorage.setItem('bitnova_tickets', JSON.stringify(data));
  };
  const saveServices = (data) => {
    setServices(data);
    localStorage.setItem('bitnova_services', JSON.stringify(data));
  };
  const saveConsultancies = (data) => {
    setConsultancies(data);
    localStorage.setItem('bitnova_consultancies', JSON.stringify(data));
  };

  // --- 3. AUTENTICACIÓN ---
  const handleLogin = (username, role) => {
    const newUser = { username, role };
    setUser(newUser);
    localStorage.setItem('bitnova_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('bitnova_user');
    setActiveView('dashboard');
  };

  // Si no hay usuario, mostramos el Login
  if (!user) return <LoginScreen onLogin={handleLogin} />;

  // --- 4. ENRUTADOR (Decide qué mostrar según el ROL) ---
  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return user.role === 'admin'
          ? <AdminDashboard projects={projects} saveProjects={saveProjects} tickets={tickets} services={services} consultancies={consultancies} />
          : <ClientDashboard projects={projects} username={user.username} />;

      case 'servicios':
        return user.role === 'admin'
          ? <AdminServicios services={services} saveServices={saveServices} clients={clientUsers} />
          : <ClientServicios services={services} username={user.username} />;

      case 'consultoria':
        return user.role === 'admin'
          ? <AdminConsultoria consultancies={consultancies} saveConsultancies={saveConsultancies} />
          : <ClientConsultoria consultancies={consultancies} saveConsultancies={saveConsultancies} username={user.username} />;

      case 'soporte':
        return user.role === 'admin'
          ? <AdminSoporte tickets={tickets} saveTickets={saveTickets} />
          : <ClientSoporte tickets={tickets} saveTickets={saveTickets} username={user.username} />;

      case 'perfil':
        return <Perfil user={user} />;

      default:
        return <div className="text-white p-8">Vista no encontrada.</div>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 text-gray-100 font-sans overflow-hidden">
      {/* Botón menú móvil */}
      <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-lg text-white border border-slate-700">
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Menú Lateral (Ahora le pasamos el rol del usuario) */}
      <Sidebar
        activeView={activeView}
        setActiveView={(v) => { setActiveView(v); setIsMobileMenuOpen(false); }}
        isMobileOpen={isMobileMenuOpen}
        userRole={user.role}
      />

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="flex justify-between items-center p-4 md:p-8 border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm z-10 md:ml-0 ml-12">
          <h1 className="text-xl md:text-2xl font-bold text-white uppercase">{activeView.replace('_', ' ')}</h1>
          <div className="flex items-center gap-4">
            <span className="hidden md:flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full text-sm border border-slate-600">
              <UserIcon size={16} className="text-cyan-400" /> {user.username}
            </span>
            <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-medium">
              <span className="hidden md:inline">Cerrar Sesión</span> <LogOut size={18} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <AnimatePresence mode="wait">
            <motion.div key={activeView} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}