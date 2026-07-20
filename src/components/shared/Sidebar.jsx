import React from 'react';
import { LayoutDashboard, Briefcase, FileSignature, Headset, User as UserIcon, Settings, ClipboardList } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Agregamos 'userRole' a los props recibidos (asegúrate de pasarlo desde App.jsx)
export default function Sidebar({ activeView, setActiveView, isMobileOpen, userRole }) {

    // Definimos menús diferentes según el rol para evitar la confusión
    const menus = userRole === 'admin' ? [
        { id: 'dashboard', name: 'Panel de Control', icon: LayoutDashboard },
        { id: 'servicios', name: 'Gestión de Servicios', icon: Settings },
        { id: 'consultoria', name: 'Solicitudes de Consultoría', icon: ClipboardList },
        { id: 'soporte', name: 'Mesa de Ayuda (SLA)', icon: Headset },
        { id: 'perfil', name: 'Mi Perfil (Admin)', icon: UserIcon },
    ] : [
        { id: 'dashboard', name: 'Mi Dashboard', icon: LayoutDashboard },
        { id: 'servicios', name: 'Mis Servicios Activos', icon: Briefcase },
        { id: 'consultoria', name: 'Solicitar Consultoría', icon: FileSignature },
        { id: 'soporte', name: 'Soporte Técnico', icon: Headset },
        { id: 'perfil', name: 'Perfil de Empresa', icon: UserIcon },
    ];

    return (
        <>
            {/* Overlay oscuro animado para móviles */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
                        onClick={() => setActiveView(activeView)} // Idealmente aquí debería ser una función para cerrar el menú móvil
                    />
                )}
            </AnimatePresence>

            <div className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-slate-800 border-r border-slate-700 p-4 transform transition-transform duration-300 ease-in-out flex flex-col ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="flex items-center gap-2 mb-10 pl-2 mt-2 md:mt-0 relative">
                    <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20">B</div>
                    <span className="text-xl font-bold text-white tracking-wide">BitNova</span>
                </div>
                <nav className="flex-1">
                    <ul className="space-y-2 relative">
                        {menus.map((menu) => {
                            const Icon = menu.icon;
                            const isActive = activeView === menu.id;
                            return (
                                <li key={menu.id} className="relative">
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-slate-700/50 border border-slate-600/50 rounded-lg shadow-md"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <button
                                        onClick={() => setActiveView(menu.id)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left relative z-10 ${isActive ? 'text-cyan-400' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                        <span className="text-sm font-medium">{menu.name}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        </>
    );
}