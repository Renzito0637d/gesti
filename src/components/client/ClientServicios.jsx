import React from 'react';
import { Briefcase, Globe, Smartphone, Database, Server, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ClientServicios({ services, username }) {
    const myServices = services.filter(s => s.client === username);

    // Reutilizamos la lógica visual para el cliente
    const getIcon = (type) => {
        switch (type) {
            case 'web': return <Globe className="text-blue-400" size={28} />;
            case 'app': return <Smartphone className="text-green-400" size={28} />;
            case 'soporte': return <Server className="text-purple-400" size={28} />;
            default: return <Database className="text-cyan-400" size={28} />;
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="bg-slate-800 p-6 md:p-8 rounded-xl border border-slate-700 shadow-xl">
                <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-3 text-white">
                    <Briefcase className="text-cyan-400" size={28} /> Mis Soluciones Tecnológicas
                </h2>
                <p className="text-slate-400 mb-8 border-b border-slate-700 pb-6">Aquí puedes visualizar el estado de tus sistemas desarrollados por BitNova y tus Acuerdos de Nivel de Servicio (SLA) activos.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {myServices.length === 0 && (
                        <div className="col-span-2 text-center py-8">
                            <p className="text-slate-500">No tienes servicios o sistemas activos en este momento.</p>
                        </div>
                    )}

                    {myServices.map((s, index) => (
                        <motion.div
                            key={s.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                            whileHover={{ y: -5 }}
                            className="bg-slate-900/80 p-6 rounded-xl border border-slate-700 hover:border-cyan-500/50 transition-all shadow-lg flex flex-col h-full relative overflow-hidden"
                        >
                            {/* Brillo decorativo */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

                            <div className="flex items-start gap-4 mb-4 relative z-10">
                                <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 shadow-inner">
                                    {getIcon(s.type)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg leading-tight">{s.name}</h3>
                                    <p className="text-cyan-400 text-xs font-semibold uppercase tracking-wider mt-1">
                                        {s.type === 'web' ? 'Plataforma Web' : s.type === 'app' ? 'App Móvil' : s.type === 'soporte' ? 'Soporte Continuo' : 'Sistema a Medida'}
                                    </p>
                                </div>
                            </div>

                            <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-grow relative z-10">{s.details}</p>

                            <div className="flex items-center justify-between border-t border-slate-800 pt-4 mt-auto relative z-10">
                                <div className="flex items-center gap-2 text-green-400 bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20">
                                    <ShieldCheck size={16} />
                                    <span className="text-xs font-bold tracking-wide">SLA CUBIERTO</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-500 uppercase font-bold">Uptime Garantizado</p>
                                    <p className="text-sm text-white font-bold">{s.sla || '99.9%'}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}