import React, { useState } from 'react';
import { Users, Plus, Building2, Mail, Phone, Trash2, X, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminClientes({ clients, saveClients }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // El 'username' es clave, ya que será el identificador para asignarle servicios
    const [formData, setFormData] = useState({
        company: '',
        username: '',
        email: '',
        phone: ''
    });

    const handleAddClient = (e) => {
        e.preventDefault();
        // Evitar usuarios duplicados
        if (clients.some(c => c.username === formData.username)) {
            alert("Este nombre de usuario ya existe. Elige otro.");
            return;
        }

        saveClients([{ ...formData, id: Date.now(), registerDate: new Date().toLocaleDateString() }, ...clients]);
        setFormData({ company: '', username: '', email: '', phone: '' });
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de eliminar este cliente? Se perderá su acceso.')) {
            saveClients(clients.filter(c => c.id !== id));
        }
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Cabecera y Botón */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-800 p-6 md:p-8 rounded-xl border border-slate-700 shadow-xl">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                        <Users className="text-cyan-400" size={28} /> Directorio de Clientes
                    </h2>
                    <p className="text-slate-400 text-sm mt-2">Registra y administra las cuentas de las empresas que trabajan con BitNova.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg shadow-cyan-900/50 w-full md:w-auto justify-center"
                >
                    <Plus size={20} /> Nuevo Cliente
                </motion.button>
            </div>

            {/* Lista de Clientes */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clients.length === 0 && (
                        <div className="col-span-full text-center py-10 border-2 border-dashed border-slate-700 rounded-xl">
                            <Users className="mx-auto text-slate-600 mb-3" size={40} />
                            <p className="text-slate-400">Aún no hay clientes registrados en el sistema.</p>
                        </div>
                    )}
                    <AnimatePresence>
                        {clients.map((c, index) => (
                            <motion.div
                                key={c.id}
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: index * 0.05 }}
                                className="bg-slate-900/80 p-6 rounded-xl border border-slate-700 relative group flex flex-col hover:border-cyan-500/50 transition-all"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center border border-slate-600">
                                        <Building2 className="text-cyan-400" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg leading-tight">{c.company}</h3>
                                        <p className="text-xs text-slate-400">Registrado: {c.registerDate}</p>
                                    </div>
                                </div>

                                <div className="space-y-2 mt-2 flex-grow">
                                    <div className="flex items-center gap-2 text-sm text-slate-300">
                                        <UserCircle size={16} className="text-slate-500" />
                                        <span>Usuario: <strong className="text-cyan-400">{c.username}</strong></span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-300">
                                        <Mail size={16} className="text-slate-500" />
                                        <span className="truncate">{c.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-300">
                                        <Phone size={16} className="text-slate-500" />
                                        <span>{c.phone}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleDelete(c.id)}
                                    className="absolute top-4 right-4 text-slate-500 hover:text-red-500 transition-colors bg-slate-800/80 hover:bg-red-500/20 p-2 rounded-lg opacity-0 group-hover:opacity-100 backdrop-blur"
                                    title="Eliminar cliente"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* MODAL PARA REGISTRAR CLIENTE */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-md overflow-hidden shadow-2xl">
                            <div className="flex justify-between items-center p-5 border-b border-slate-700 bg-slate-800/50">
                                <h3 className="font-bold text-lg text-white">Registro de Nueva Empresa</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors"><X size={24} /></button>
                            </div>
                            <form onSubmit={handleAddClient} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Razón Social / Nombre de la Empresa</label>
                                    <input type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} required placeholder="Ej: Logistics del Perú S.A.C." className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Usuario de Acceso (Para el Login)</label>
                                    <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase() })} required placeholder="Ej: logistica_peru" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none transition-all" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Correo Electrónico</label>
                                        <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required placeholder="contacto@empresa.com" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Teléfono</label>
                                        <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required placeholder="999 888 777" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none transition-all" />
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4 border-t border-slate-700 mt-2">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl transition-colors">Cancelar</button>
                                    <button type="submit" className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-cyan-900/50">Registrar</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}