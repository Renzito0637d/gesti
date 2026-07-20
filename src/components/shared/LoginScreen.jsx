import React, { useState, useEffect } from 'react';
import { LogOut, Mail, Lock, AlertCircle, User as UserIcon, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginScreen({ onLogin }) {
    const [isRegistering, setIsRegistering] = useState(false);

    // Estados del formulario
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Efecto para inicializar el usuario Admin por defecto
    useEffect(() => {
        const storedUsers = JSON.parse(localStorage.getItem('bitnova_users') || '[]');
        const adminExists = storedUsers.some(u => u.email === 'admin@bitnova.pe');

        if (!adminExists) {
            const defaultAdmin = {
                name: 'Administrador',
                lastName: 'BitNova',
                email: 'admin@bitnova.pe',
                password: 'admin', // Contraseña por defecto para pruebas
                role: 'admin',
                username: 'admin'
            };
            storedUsers.push(defaultAdmin);
            localStorage.setItem('bitnova_users', JSON.stringify(storedUsers));
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        const storedUsers = JSON.parse(localStorage.getItem('bitnova_users') || '[]');

        if (isRegistering) {
            // LÓGICA DE REGISTRO
            if (!name.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
                setError('Por favor, completa todos los campos.');
                return;
            }

            if (storedUsers.some(u => u.email === email)) {
                setError('Este correo ya está registrado.');
                return;
            }

            // Detección automática de rol
            let detectedRole = email.toLowerCase().endsWith('@bitnova.pe') ? 'admin' : 'client';
            let detectedUsername = email.split('@')[0];

            const newUser = {
                name: name.trim(),
                lastName: lastName.trim(),
                email: email.trim().toLowerCase(),
                password: password,
                role: detectedRole,
                username: detectedUsername
            };

            // Guardar nuevo usuario
            storedUsers.push(newUser);
            localStorage.setItem('bitnova_users', JSON.stringify(storedUsers));

            // Auto-login después de registrarse
            onLogin(detectedUsername, detectedRole);

        } else {
            // LÓGICA DE INICIO DE SESIÓN
            if (!email.trim() || !password.trim()) {
                setError('Por favor, ingresa tu correo y contraseña.');
                return;
            }

            // Buscar usuario que coincida
            const user = storedUsers.find(u => u.email === email.toLowerCase() && u.password === password);

            if (user) {
                onLogin(user.username, user.role);
            } else {
                setError('Correo o contraseña incorrectos.');
            }
        }
    };

    const toggleMode = () => {
        setIsRegistering(!isRegistering);
        setError('');
        setName('');
        setLastName('');
        setPassword('');
        // Mantenemos el email por si ya lo había empezado a escribir
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-slate-800/80 backdrop-blur p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700 relative overflow-hidden my-8"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-600 via-blue-500 to-cyan-400"></div>

                <div className="text-center mb-8 mt-2">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
                        className="w-16 h-16 bg-cyan-600 rounded-2xl mx-auto flex items-center justify-center text-white font-bold text-3xl mb-4 shadow-lg shadow-cyan-900/50"
                    >
                        B
                    </motion.div>
                    <h2 className="text-3xl font-bold text-white mb-2">BitNova</h2>
                    <p className="text-slate-400 text-sm">
                        {isRegistering ? 'Crea tu cuenta empresarial' : 'Portal de Gestión y Soporte'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg flex items-center gap-2 mb-4"
                            >
                                <AlertCircle size={16} className="flex-shrink-0" />
                                <span>{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* CAMPOS EXTRA PARA REGISTRO */}
                    <AnimatePresence>
                        {isRegistering && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-4 overflow-hidden"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-300 mb-1">Nombre</label>
                                        <div className="relative">
                                            <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={16} />
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full bg-slate-900/50 border border-slate-600 rounded-xl py-2.5 pl-9 pr-3 text-white focus:outline-none focus:border-cyan-500 transition-all text-sm"
                                                placeholder="Ej: Juan"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-300 mb-1">Apellido</label>
                                        <div className="relative">
                                            <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={16} />
                                            <input
                                                type="text"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                className="w-full bg-slate-900/50 border border-slate-600 rounded-xl py-2.5 pl-9 pr-3 text-white focus:outline-none focus:border-cyan-500 transition-all text-sm"
                                                placeholder="Ej: Pérez"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Correo Electrónico</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-900/50 border border-slate-600 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                                placeholder="usuario@empresa.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-900/50 border border-slate-600 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-xl transition-all hover:shadow-lg hover:shadow-cyan-900/50 flex items-center justify-center gap-2 mt-6"
                    >
                        {isRegistering ? (
                            <><UserPlus size={18} /> Completar Registro</>
                        ) : (
                            <>Iniciar Sesión <LogOut size={18} className="rotate-180" /></>
                        )}
                    </motion.button>
                </form>

                {/* BOTÓN PARA ALTERNAR ENTRE LOGIN Y REGISTRO */}
                <div className="mt-6 text-center border-t border-slate-700 pt-6">
                    <p className="text-slate-400 text-sm">
                        {isRegistering ? '¿Ya tienes una cuenta?' : '¿No tienes cuenta?'}
                        <button
                            onClick={toggleMode}
                            className="ml-2 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors focus:outline-none"
                        >
                            {isRegistering ? 'Inicia Sesión aquí' : 'Regístrate ahora'}
                        </button>
                    </p>
                </div>

            </motion.div>
        </div>
    );
}