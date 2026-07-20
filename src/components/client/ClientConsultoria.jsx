import React, { useState } from 'react';
import { FileSignature, Calendar, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ClientConsultoria({ consultancies, saveConsultancies, username }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [topic, setTopic] = useState('');

    const myConsultancies = consultancies.filter(c => c.client === username);

    const handleRequest = (e) => {
        e.preventDefault();
        const newRequest = { id: Date.now(), topic, status: 'Pendiente', client: username, date: new Date().toLocaleDateString() };
        saveConsultancies([newRequest, ...consultancies]);
        setTopic('');
        setIsModalOpen(false); // Cierra el modal al enviar
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Cabecera y Botón de Acción */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-800 p-6 md:p-8 rounded-xl border border-slate-700 shadow-xl">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                        <FileSignature className="text-cyan-400" size={28} /> Consultoría Tecnológica
                    </h2>
                    <p className="text-slate-400 text-sm mt-2">Solicita asesoría experta para analizar y digitalizar nuevos procesos.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg shadow-cyan-900/50 w-full md:w-auto justify-center"
                >
                    <Plus size={20} /> Agendar Reunión
                </motion.button>
            </div>

            {/* Historial */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 md:p-8">
                <h3 className="font-bold text-lg mb-6 text-white border-b border-slate-700 pb-2">Mi Historial de Solicitudes</h3>
                <div className="space-y-4">
                    {myConsultancies.length === 0 && <p className="text-slate-500">No has realizado ninguna solicitud aún.</p>}
                    {myConsultancies.map((c, index) => (
                        <motion.div key={c.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="bg-slate-900 p-5 rounded-xl border border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <p className="font-bold text-white text-lg">{c.topic}</p>
                                <span className="text-sm text-slate-400 flex items-center gap-1 mt-2"><Calendar size={14} /> {c.date}</span>
                            </div>
                            <span className={`text-xs px-4 py-1.5 rounded-full border font-medium ${c.status === 'Pendiente' ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' : 'border-green-500 text-green-500 bg-green-500/10'}`}>
                                {c.status}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* MODAL DE SOLICITUD */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-md overflow-hidden shadow-2xl">
                            <div className="flex justify-between items-center p-5 border-b border-slate-700 bg-slate-800/50">
                                <h3 className="font-bold text-lg text-white">Nueva Solicitud</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors"><X size={24} /></button>
                            </div>
                            <form onSubmit={handleRequest} className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">¿Sobre qué tema necesitas consultoría?</label>
                                    <textarea value={topic} onChange={(e) => setTopic(e.target.value)} required rows="4" placeholder="Ej: Necesitamos automatizar nuestro control de inventario..." className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all resize-none shadow-inner"></textarea>
                                </div>
                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl transition-colors">Cancelar</button>
                                    <button type="submit" className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-cyan-900/50">Enviar Solicitud</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}