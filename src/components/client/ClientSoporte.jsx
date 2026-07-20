import React, { useState } from 'react';
import { Headset, Send, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ClientSoporte({ tickets, saveTickets, username }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [issue, setIssue] = useState('');

    const myTickets = tickets.filter(t => t.client === username);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newTicket = { id: `#BN${Math.floor(Math.random() * 10000)}`, issue, status: 'Abierto', client: username, date: new Date().toLocaleDateString() };
        saveTickets([newTicket, ...tickets]);
        setIssue('');
        setIsModalOpen(false); // Cierra el modal al enviar
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Cabecera y Botón de Acción */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-800 p-6 md:p-8 rounded-xl border border-slate-700 shadow-xl">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                        <Headset className="text-cyan-400" size={28} /> Soporte Técnico
                    </h2>
                    <p className="text-slate-400 text-sm mt-2">Mesa de ayuda y asistencia técnica para tus sistemas en producción.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg shadow-cyan-900/50 w-full md:w-auto justify-center"
                >
                    <Plus size={20} /> Crear Ticket
                </motion.button>
            </div>

            {/* Bandeja de Tickets */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 md:p-8">
                <h3 className="font-bold text-lg mb-6 text-white border-b border-slate-700 pb-2">Mis Tickets Reportados</h3>
                <div className="space-y-4">
                    {myTickets.length === 0 && <p className="text-slate-500">No tienes tickets de soporte activos.</p>}
                    {myTickets.map((t, index) => (
                        <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-slate-900 p-6 rounded-xl border border-slate-700 hover:border-cyan-500/30 transition-colors shadow-md">
                            <div className="flex justify-between items-start mb-4">
                                <span className="font-mono text-cyan-400 text-sm font-bold bg-cyan-900/30 border border-cyan-800/50 px-3 py-1.5 rounded-md shadow-inner">{t.id}</span>
                                <span className={`text-xs px-4 py-1.5 rounded-full border font-medium ${t.status === 'Abierto' ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' : 'border-green-500 text-green-500 bg-green-500/10'}`}>
                                    {t.status}
                                </span>
                            </div>
                            <p className="text-slate-300 mb-4 leading-relaxed">{t.issue}</p>
                            <p className="text-xs text-slate-500 border-t border-slate-800 pt-3">Reportado el: <span className="font-medium text-slate-400">{t.date}</span></p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* MODAL DE TICKET */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-md overflow-hidden shadow-2xl">
                            <div className="flex justify-between items-center p-5 border-b border-slate-700 bg-slate-800/50">
                                <h3 className="font-bold text-lg text-white">Abrir Nuevo Ticket</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors"><X size={24} /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Describe el problema técnico o incidencia</label>
                                    <textarea value={issue} onChange={(e) => setIssue(e.target.value)} required rows="5" placeholder="Ej: El sistema de ventas no me permite registrar..." className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all resize-none shadow-inner"></textarea>
                                </div>
                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl transition-colors">Cancelar</button>
                                    <button type="submit" className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-cyan-900/50 flex items-center justify-center gap-2">
                                        <Send size={18} /> Enviar Ticket
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}