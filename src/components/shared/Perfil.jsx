import React, { useState, useEffect } from 'react';
import { User as UserIcon, Save, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Perfil({ user }) {
    const [profileData, setProfileData] = useState({ company: '', email: '', phone: '' });
    const [saved, setSaved] = useState(false);

    // --- PROTECCIÓN CONTRA ERRORES ---
    // Si "user" todavía no ha cargado o es undefined, mostramos un mensaje temporal
    // en lugar de romper la aplicación.
    if (!user || !user.username) {
        return <div className="text-slate-400 p-8">Cargando datos del perfil...</div>;
    }

    useEffect(() => {
        // Ahora es 100% seguro leer user.username
        const savedProfile = localStorage.getItem(`bitnova_profile_${user.username}`);
        if (savedProfile) setProfileData(JSON.parse(savedProfile));
    }, [user.username]);

    const handleSave = (e) => {
        e.preventDefault();
        localStorage.setItem(`bitnova_profile_${user.username}`, JSON.stringify(profileData));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl bg-slate-800 p-6 md:p-8 rounded-xl border border-slate-700 shadow-xl"
        >
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-700">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-20 h-20 bg-cyan-900 rounded-full flex items-center justify-center border-4 border-slate-800 shadow-xl"
                >
                    <UserIcon size={40} className="text-cyan-400" />
                </motion.div>
                <div>
                    <h2 className="text-2xl font-bold capitalize text-white">{user.username}</h2>
                    <p className="text-cyan-400 uppercase text-sm font-bold tracking-wider">
                        {user.role === 'admin' ? 'Administrador Sistema' : 'Cliente Corporativo'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
                <div>
                    <label className="block text-sm text-slate-400 mb-1">Nombre de la Empresa / Razón Social</label>
                    <input type="text" value={profileData.company} onChange={e => setProfileData({ ...profileData, company: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none transition-all" placeholder="Ej: Corporación Gamma S.A.C." />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Correo de Contacto</label>
                        <input type="email" value={profileData.email} onChange={e => setProfileData({ ...profileData, email: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none transition-all" placeholder="correo@empresa.com" />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Teléfono Móvil</label>
                        <input type="tel" value={profileData.phone} onChange={e => setProfileData({ ...profileData, phone: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none transition-all" placeholder="+51 999 888 777" />
                    </div>
                </div>

                <div className="pt-4 flex items-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg shadow-cyan-900/50"
                    >
                        <Save size={18} /> Guardar Cambios
                    </motion.button>
                    {saved && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-green-400 text-sm flex items-center gap-1 font-medium"
                        >
                            <CheckCircle size={16} /> Datos actualizados
                        </motion.span>
                    )}
                </div>
            </form>
        </motion.div>
    );
}