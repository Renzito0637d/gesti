import React from 'react';
import { FileSignature, Calendar, User as UserIcon, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminConsultoria({ consultancies, saveConsultancies }) {
    const updateStatus = (id, newStatus) => {
        saveConsultancies(consultancies.map(c => c.id === id ? { ...c, status: newStatus } : c));
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="bg-slate-800 p-6 md:p-8 rounded-xl border border-slate-700 shadow-xl">
                <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3 mb-2">
                    <FileSignature className="text-cyan-400" size={28} /> Bandeja de Consultorías
                </h2>
                <p className="text-slate-400 text-sm mb-8">Solicitudes de asesoría tecnológica enviadas por los clientes.</p>

                <div className="space-y-4">
                    {consultancies.length === 0 && <p className="text-slate-500">No hay solicitudes de consultoría registradas.</p>}
                    <AnimatePresence>
                        {consultancies.map((c, index) => (
                            <motion.div
                                key={c.id}
                                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
                                className="bg-slate-900 p-5 rounded-xl border border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-md hover:border-cyan-500/30 transition-colors"
                            >
                                <div className="flex-1">
                                    <p className="font-bold text-white text-lg">{c.topic}</p>
                                    <div className="text-sm text-slate-400 flex flex-wrap gap-4 mt-2">
                                        <span className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded-md"><Calendar size={14} className="text-cyan-500" /> {c.date}</span>
                                        <span className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded-md"><UserIcon size={14} className="text-cyan-500" /> Cliente: {c.client}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-3 min-w-[140px]">
                                    <span className={`text-xs px-4 py-1.5 rounded-full border font-medium ${c.status === 'Pendiente' ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' : 'border-green-500 text-green-500 bg-green-500/10'}`}>
                                        {c.status}
                                    </span>
                                    {c.status === 'Pendiente' && (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                            onClick={() => updateStatus(c.id, 'Contactado')}
                                            className="text-xs bg-slate-700 hover:bg-green-600 px-3 py-2 rounded-lg text-white flex items-center gap-2 transition-colors w-full justify-center"
                                        >
                                            <CheckCircle size={14} /> Marcar Contactado
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