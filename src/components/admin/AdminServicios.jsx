import React, { useState } from 'react';
import { Briefcase, Plus, Trash2, X, Globe, Smartphone, Database, Server, Activity, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminServicios({ services, saveServices, clients = [] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Agregamos 'type' para clasificar el servicio según el documento de BitNova
    const [formData, setFormData] = useState({ name: '', type: 'sistema', details: '', client: '' });

    const handleAddService = (e) => {
        e.preventDefault();
        saveServices([{ ...formData, id: Date.now(), status: 'active', sla: '99.9%' }, ...services]);
        setFormData({ name: '', type: 'sistema', details: '', client: '' });
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de dar de baja este servicio?')) {
            saveServices(services.filter(s => s.id !== id));
        }
    };

    // Función para asignar el ícono correcto según el tipo de servicio
    const getIcon = (type) => {
        switch (type) {
            case 'web': return <Globe className="text-blue-400" size={24} />;
            case 'app': return <Smartphone className="text-green-400" size={24} />;
            case 'soporte': return <Server className="text-purple-400" size={24} />;
            default: return <Database className="text-cyan-400" size={24} />;
        }
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Cabecera y Botón */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-800 p-6 md:p-8 rounded-xl border border-slate-700 shadow-xl">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                        <Briefcase className="text-cyan-400" size={28} /> Gestión de Servicios y SLA
                    </h2>
                    <p className="text-slate-400 text-sm mt-2">Administra los módulos de software y Acuerdos de Nivel de Servicio (SLA) de tus clientes.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg shadow-cyan-900/50 w-full md:w-auto justify-center"
                >
                    <Plus size={20} /> Asignar Contrato
                </motion.button>
            </div>

            {/* Lista de Servicios Mejorada */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.length === 0 && (
                        <div className="col-span-full text-center py-10 border-2 border-dashed border-slate-700 rounded-xl">
                            <Briefcase className="mx-auto text-slate-600 mb-3" size={40} />
                            <p className="text-slate-400">No hay servicios o sistemas registrados.</p>
                        </div>
                    )}
                    <AnimatePresence>
                        {services.map((s, index) => (
                            <motion.div
                                key={s.id}
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: index * 0.05 }}
                                className="bg-slate-900/80 p-6 rounded-xl border border-slate-700 relative group flex flex-col justify-between hover:border-cyan-500/50 transition-all"
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                                            {getIcon(s.type)}
                                        </div>
                                        <span className="bg-green-500/10 text-green-400 text-xs px-2 py-1 rounded-md border border-green-500/20 font-medium flex items-center gap-1">
                                            <Activity size={12} /> Activo
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-white mb-2 text-lg pr-8">{s.name}</h3>
                                    <p className="text-sm text-slate-400 mb-4 line-clamp-3">{s.details}</p>
                                </div>
                                <div className="border-t border-slate-800 pt-4 mt-auto flex justify-between items-center">
                                    <div>
                                        <p className="text-[11px] text-slate-500 uppercase tracking-wider font-bold mb-1">Cliente Asignado</p>
                                        <p className="text-sm text-cyan-400 font-medium truncate">{s.client}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[11px] text-slate-500 uppercase tracking-wider font-bold mb-1">SLA</p>
                                        <p className="text-sm text-white font-medium">{s.sla || '99.9%'}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(s.id)}
                                    className="absolute top-4 right-4 text-slate-500 hover:text-red-500 transition-colors bg-slate-800/80 hover:bg-red-500/20 p-2 rounded-lg opacity-0 group-hover:opacity-100 backdrop-blur"
                                    title="Dar de baja servicio"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* MODAL PARA ASIGNAR SERVICIO */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-md overflow-hidden shadow-2xl">
                            <div className="flex justify-between items-center p-5 border-b border-slate-700 bg-slate-800/50">
                                <h3 className="font-bold text-lg text-white">Nuevo Contrato de Servicio</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors"><X size={24} /></button>
                            </div>
                            <form onSubmit={handleAddService} className="p-6 space-y-4">

                                {/* SELECTOR DE CLIENTE ESTILIZADO */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Empresa / Cliente</label>
                                    <div className="relative">
                                        <select
                                            value={formData.client}
                                            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                            required
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 pr-10 text-white focus:border-cyan-500 outline-none transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="" disabled className="text-slate-500">Seleccione un cliente registrado...</option>
                                            {clients.map(c => (
                                                <option key={c.id} value={c.username} className="bg-slate-900 text-white py-2">
                                                    {c.company} ({c.username})
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                    </div>
                                </div>

                                {/* SELECTOR DE TIPO ESTILIZADO */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Tipo de Solución BitNova</label>
                                    <div className="relative">
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 pr-10 text-white focus:border-cyan-500 outline-none transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="sistema" className="bg-slate-900 text-white py-2">Sistema de Gestión a Medida</option>
                                            <option value="web" className="bg-slate-900 text-white py-2">Plataforma Web / E-commerce</option>
                                            <option value="app" className="bg-slate-900 text-white py-2">Aplicación Móvil Android</option>
                                            <option value="soporte" className="bg-slate-900 text-white py-2">Soporte Técnico / Retainer</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Nombre del Proyecto</label>
                                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required placeholder="Ej: Sistema de Inventario v2.0" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none transition-all" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Alcance y Nivel de Servicio (SLA)</label>
                                    <textarea value={formData.details} onChange={(e) => setFormData({ ...formData, details: e.target.value })} required rows="3" placeholder="Ej: Módulo de ventas y facturación. Soporte 24/7 con respuesta en 2 horas." className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none transition-all resize-none"></textarea>
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-slate-700 mt-2">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl transition-colors">Cancelar</button>
                                    <button type="submit" className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-cyan-900/50">Activar Servicio</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}