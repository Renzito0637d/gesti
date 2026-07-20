import React from 'react';
import { motion } from 'framer-motion';

export default function ClientDashboard({ projects, username }) {
    const myProjects = projects.filter(p => p.client === username);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <p className="text-slate-400 text-xs uppercase font-bold mb-2">Mis Proyectos Activos</p>
                <p className="text-4xl font-bold text-cyan-400">{myProjects.length}</p>
            </motion.div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 md:p-6">
                <h3 className="font-bold text-lg mb-6 text-white">Estado de mis proyectos</h3>
                <div className="space-y-4">
                    {myProjects.length === 0 && <p className="text-slate-400">Aún no tienes proyectos asignados.</p>}

                    {myProjects.map((p, index) => (
                        <motion.div
                            key={p.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between gap-4"
                        >
                            <div className="flex-1">
                                <p className="font-semibold text-white text-lg mb-2">{p.name}</p>
                                <div className="w-full bg-slate-700 rounded-full h-2 mt-4 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${p.progress}%` }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className="bg-cyan-500 h-full rounded-full"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col items-end justify-center gap-2 min-w-[120px]">
                                <span className={`text-xs px-3 py-1.5 rounded-full border font-medium ${p.status.includes('Rojo') ? 'bg-red-900/30 border-red-500 text-red-400' : 'bg-green-900/30 border-green-500 text-green-400'}`}>
                                    {p.status}
                                </span>
                                <span className="text-2xl font-bold text-white">{p.progress}%</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}