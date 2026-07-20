import React from 'react';
import { Headset, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminSoporte({ tickets, saveTickets }) {
    const markAsResolved = (id) => {
        saveTickets(tickets.map(t => t.id === id ? { ...t, status: 'Resuelto' } : t));
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="bg-slate-800 p-6 md:p-8 rounded-xl border border-slate-700 shadow-xl">
                <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3 mb-2">
                    <Headset className="text-cyan-400" size={28} /> Centro de Soporte (Mesa de Ayuda)
                </h2>
                <p className="text-slate-400 text-sm mb-8">Gestión centralizada de incidencias y tickets reportados por los clientes.</p>

                <div className="space-y-4">
                    {tickets.length === 0 && <p className="text-slate-500">No hay tickets activos en la bandeja.</p>}
                    <AnimatePresence>
                        {tickets.map((t, index) => (
                            <motion.div
                                key={t.id}
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                                className="bg-slate-900 p-6 rounded-xl border border-slate-700 hover:border-cyan-500/30 transition-colors shadow-md flex flex-col"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono text-cyan-400 text-sm font-bold bg-cyan-900/30 border border-cyan-800/50 px-3 py-1.5 rounded-md">{t.id}</span>
                                        <span className="text-sm font-medium text-slate-300 bg-slate-800 px-3 py-1.5 rounded-md border border-slate-700">Cliente: {t.client}</span>
                                    </div>
                                    <span className={`text-xs px-4 py-1.5 rounded-full border font-medium ${t.status === 'Abierto' ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' : 'border-green-500 text-green-500 bg-green-500/10'}`}>
                                        {t.status}
                                    </span>
                                </div>
                                <p className="text-slate-300 mb-6 leading-relaxed bg-slate-800/50 p-4 rounded-lg border border-slate-800">{t.issue}</p>
                                <div className="flex justify-between items-center border-t border-slate-800 pt-4 mt-auto">
                                    <span className="text-xs text-slate-500 font-medium">Reportado: {t.date}</span>
                                    {t.status === 'Abierto' && (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                            onClick={() => markAsResolved(t.id)}
                                            className="text-sm bg-green-600/20 hover:bg-green-600/40 border border-green-500/50 text-green-400 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
                                        >
                                            <CheckCircle size={16} /> Marcar como Resuelto
                                        </motion.button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}