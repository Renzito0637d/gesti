import React, { useState } from 'react';
import { Plus, Trash2, Edit, X, Briefcase, Headset, FileSignature, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard({ projects, saveProjects, tickets = [], services = [], consultancies = [] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ id: null, name: '', progress: '', status: 'En Progreso - Verde', client: '' });

    const openModal = (project = null) => {
        if (project) {
            setFormData(project);
            setIsEditing(true);
        } else {
            setFormData({ id: null, name: '', progress: '', status: 'En Progreso - Verde', client: '' });
            setIsEditing(false);
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            saveProjects(projects.map(p => p.id === formData.id ? { ...p, ...formData, progress: Number(formData.progress) } : p));
        } else {
            saveProjects([...projects, { ...formData, id: Date.now(), progress: Number(formData.progress), client: formData.client || 'General' }]);
        }
        setIsModalOpen(false);
    };

    // --- CÁLCULOS PARA LOS GRÁFICOS Y KPIs ---
    const activeTickets = tickets.filter(t => t.status === 'Abierto').length;
    const pendingConsultancies = consultancies.filter(c => c.status === 'Pendiente').length;

    // Datos para el Gráfico Circular (Salud de Proyectos)
    const COLORS = ['#10b981', '#eab308', '#ef4444']; // Verde, Amarillo, Rojo
    const projectHealthData = [
        { name: 'Óptimo (Verde)', value: projects.filter(p => p.status.includes('Verde')).length },
        { name: 'Alerta (Amarillo)', value: projects.filter(p => p.status.includes('Amarillo')).length },
        { name: 'Pausado (Rojo)', value: projects.filter(p => p.status.includes('Rojo')).length },
    ].filter(d => d.value > 0); // Ocultar los que tienen 0

    // Datos para el Gráfico de Barras (Volumen General)
    const moduleData = [
        { name: 'Proyectos', Total: projects.length },
        { name: 'SLA Activos', Total: services.length },
        { name: 'Tickets', Total: tickets.length },
        { name: 'Consultorías', Total: consultancies.length },
    ];

    return (
        <div className="space-y-8 max-w-7xl mx-auto">

            {/* 1. TARJETAS DE INDICADORES (KPIs) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard title="Proyectos Activos" value={projects.length} icon={LayoutDashboard} color="text-cyan-400" />
                <KPICard title="Servicios SLA" value={services.length} icon={Briefcase} color="text-blue-400" />
                <KPICard title="Tickets Abiertos" value={activeTickets} icon={Headset} color={activeTickets > 0 ? "text-yellow-400" : "text-green-400"} />
                <KPICard title="Consultorías Pendientes" value={pendingConsultancies} icon={FileSignature} color={pendingConsultancies > 0 ? "text-yellow-400" : "text-slate-400"} />
            </div>

            {/* 2. ZONA DE GRÁFICOS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Gráfico de Barras */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
                    <h3 className="font-bold text-white mb-6 text-lg border-b border-slate-700 pb-2">Volumen por Módulo</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={moduleData}>
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: '#334155' }} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                                <Bar dataKey="Total" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Gráfico Circular (Donut) */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
                    <h3 className="font-bold text-white mb-6 text-lg border-b border-slate-700 pb-2">Salud de los Proyectos</h3>
                    <div className="h-64 w-full flex items-center justify-center relative">
                        {projectHealthData.length === 0 ? (
                            <p className="text-slate-500">No hay proyectos para analizar.</p>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={projectHealthData} innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">
                                        {projectHealthData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                        {/* Texto en el centro del Donut */}
                        {projectHealthData.length > 0 && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-3xl font-bold text-white">{projects.length}</span>
                                <span className="text-xs text-slate-400 uppercase">Totales</span>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* 3. GESTIÓN DE PROYECTOS (Tu lista original mejorada) */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-slate-700 pb-4 gap-4">
                    <h3 className="font-bold text-xl text-white">Gestión de Proyectos</h3>
                    <motion.button
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => openModal()}
                        className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 px-5 rounded-lg transition-colors shadow-lg shadow-cyan-900/50 w-full md:w-auto justify-center"
                    >
                        <Plus size={20} /> Nuevo Proyecto
                    </motion.button>
                </div>

                <div className="space-y-4">
                    {projects.length === 0 && <p className="text-slate-400 text-center py-8">No hay proyectos registrados.</p>}
                    <AnimatePresence>
                        {projects.map((p, index) => (
                            <motion.div key={p.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: index * 0.05 }} className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between gap-6 hover:border-cyan-900 transition-colors">
                                <div className="flex-1">
                                    <p className="font-bold text-white text-lg">{p.name}</p>
                                    <p className="text-sm text-slate-400 mb-3">Cliente: <span className="text-cyan-400">{p.client}</span></p>
                                    <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${p.progress}%` }} transition={{ duration: 1 }} className={`h-full rounded-full ${p.status.includes('Rojo') ? 'bg-red-500' : p.status.includes('Amarillo') ? 'bg-yellow-500' : 'bg-green-500'}`} />
                                    </div>
                                </div>
                                <div className="flex flex-col items-end justify-center gap-3 min-w-[140px]">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl font-bold text-white">{p.progress}%</span>
                                    </div>
                                    <span className={`text-xs px-3 py-1 rounded-full border font-medium ${p.status.includes('Rojo') ? 'bg-red-900/30 border-red-500 text-red-400' : p.status.includes('Amarillo') ? 'bg-yellow-900/30 border-yellow-500 text-yellow-400' : 'bg-green-900/30 border-green-500 text-green-400'}`}>
                                        {p.status}
                                    </span>
                                    <div className="flex gap-3 mt-1">
                                        <button onClick={() => openModal(p)} className="text-slate-400 hover:text-cyan-400 transition-colors"><Edit size={18} /></button>
                                        <button onClick={() => saveProjects(projects.filter(x => x.id !== p.id))} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* MODAL ANIMADO DE PROYECTOS */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-md overflow-hidden shadow-2xl">
                            <div className="flex justify-between items-center p-5 border-b border-slate-700 bg-slate-800/50">
                                <h3 className="font-bold text-lg text-white">{isEditing ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                <div>
                                    <label className="block text-sm text-slate-300 mb-1">Nombre del Proyecto</label>
                                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-300 mb-1">Usuario del Cliente</label>
                                    <input type="text" value={formData.client} onChange={(e) => setFormData({ ...formData, client: e.target.value })} required className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none transition-all" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-slate-300 mb-1">Progreso (%)</label>
                                        <input type="number" min="0" max="100" value={formData.progress} onChange={(e) => setFormData({ ...formData, progress: e.target.value })} required className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-300 mb-1">Estatus</label>
                                        <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none transition-all">
                                            <option>En Progreso - Verde</option>
                                            <option>En Progreso - Amarillo</option>
                                            <option>Pausado - Rojo</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg transition-colors">Cancelar</button>
                                    <button type="submit" className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-cyan-900/50">Guardar</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Componente pequeño para las tarjetas de arriba
function KPICard({ title, value, icon: Icon, color }) {
    return (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex items-center justify-between group hover:border-cyan-500/50 transition-colors">
            <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
                <p className={`text-3xl font-black ${color}`}>{value}</p>
            </div>
            <div className={`p-3 rounded-lg bg-slate-900 border border-slate-700 group-hover:bg-slate-700 transition-colors ${color}`}>
                <Icon size={24} />
            </div>
        </motion.div>
    );
}