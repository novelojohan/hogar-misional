"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, Calendar, Phone, LifeBuoy, BookUser, Lock, Unlock, Check, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  
  // Estados para el menú y el sistema de administración secreto
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPinInput, setShowPinInput] = useState(false);
  const [pin, setPin] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [pinError, setPinError] = useState(false);

  // Verificamos si ya inició sesión como admin al cargar la aplicación
  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(adminStatus);
  }, []);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === "2026") {
      localStorage.setItem("isAdmin", "true");
      setIsAdmin(true);
      setShowPinInput(false);
      setPin("");
      setPinError(false);
      setIsMenuOpen(false);
      window.location.reload(); 
    } else {
      setPinError(true);
      setPin("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    setIsAdmin(false);
    setIsMenuOpen(false);
    window.location.reload();
  };

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-40 bg-transparent pt-2">
        <div className="w-full max-w-6xl mx-auto flex justify-between items-center p-4 md:p-6">
          
          {/* LOGO CON ANIMACIÓN BLINDADA */}
          {isHome ? (
            <motion.button 
              initial={false} // <- MAGIA: Visible desde el servidor
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              onClick={() => window.location.reload()}
              className="text-xl md:text-2xl font-bold tracking-tight text-iglesia-blue drop-shadow-sm cursor-pointer border-none bg-transparent text-left"
            >
              Hogar<span className="text-misional-gold">Misional</span>
            </motion.button>
          ) : (
            <Link href="/">
              <motion.h1 
                key={pathname}
                initial={false} // <- MAGIA: Visible desde el servidor
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-xl md:text-2xl font-bold tracking-tight text-iglesia-blue drop-shadow-sm"
              >
                Hogar<span className="text-misional-gold">Misional</span>
              </motion.h1>
            </Link>
          )}

          {/* BOTÓN DE MENÚ (HAMBURGUESA) BLINDADO */}
          <motion.button 
            key={`btn-${pathname}`}
            initial={false} // <- MAGIA: Visible desde el servidor
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            onClick={() => setIsMenuOpen(true)}
            className="p-2.5 bg-white/60 backdrop-blur-md border border-white text-iglesia-blue rounded-full shadow-sm hover:shadow-md hover:bg-white active:scale-95 transition-colors transition-shadow duration-200"
          >
            <Menu size={20} strokeWidth={2.5} />
          </motion.button>

        </div>
      </header>

      {/* PANEL LATERAL DEL MENÚ */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end bg-slate-900/20 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-sm h-full bg-[#f8fafc] shadow-2xl flex flex-col overflow-y-auto border-l border-white relative"
            >
              {/* HEADER DEL MENÚ */}
              <div className="p-6 flex justify-between items-center border-b border-slate-200/60 bg-white">
                <span className="font-bold text-iglesia-blue tracking-widest uppercase text-[10px]">Menú Principal</span>
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    setShowPinInput(false);
                    setPinError(false);
                  }}
                  className="p-2 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100 hover:text-slate-700 transition-colors border border-slate-100"
                >
                  <X size={16} strokeWidth={2.5} />
                </button>
              </div>

              {/* CONTENIDO DEL MENÚ */}
              <div className="p-6 space-y-8 flex-1 flex flex-col justify-between">
                
                <div className="space-y-8">
                  {/* SECCIÓN 1: NAVEGACIÓN ENTRE PÁGINAS */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Navegación</span>
                    
                    <Link href="/" onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-3 p-4 rounded-2xl transition-all ${isHome ? 'bg-iglesia-blue text-white shadow-md shadow-iglesia-blue/20' : 'bg-white text-slate-600 border border-slate-100 hover:border-misional-gold/50 hover:shadow-sm'}`}>
                      <Home size={20} />
                      <span className="font-bold text-sm">Inicio</span>
                    </Link>

                    <Link href="/pensiones-1" onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-3 p-4 rounded-2xl transition-all ${pathname.includes('pensiones-1') ? 'bg-iglesia-blue text-white shadow-md shadow-iglesia-blue/20' : 'bg-white text-slate-600 border border-slate-100 hover:border-misional-gold/50 hover:shadow-sm'}`}>
                      <Calendar size={20} />
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">Pensiones 1</span>
                        <span className={`text-[10px] ${pathname.includes('pensiones-1') ? 'text-blue-200' : 'text-slate-400'}`}>Hna. Magaña y Hna. Jones</span>
                      </div>
                    </Link>

                    <Link href="/pensiones-2" onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-3 p-4 rounded-2xl transition-all ${pathname.includes('pensiones-2') ? 'bg-iglesia-blue text-white shadow-md shadow-iglesia-blue/20' : 'bg-white text-slate-600 border border-slate-100 hover:border-misional-gold/50 hover:shadow-sm'}`}>
                      <Calendar size={20} />
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">Pensiones 2</span>
                        <span className={`text-[10px] ${pathname.includes('pensiones-2') ? 'text-blue-200' : 'text-slate-400'}`}>Hna. Galván y Hna. Aquino</span>
                      </div>
                    </Link>
                  </div>

                  {/* SECCIÓN 2: DIRECTORIO DE AYUDA */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Directorio de Apoyo</span>
                    
                    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                      <div className="p-4 flex items-center justify-between border-b border-slate-50">
                        <div className="flex items-center gap-3">
                          <div className="bg-slate-50 p-2 rounded-xl text-misional-gold"><BookUser size={18}/></div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-700">Gloria Cereno</span>
                            <span className="text-[10px] text-slate-400">Registros o cancelaciones</span>
                          </div>
                        </div>
                        <a href="https://wa.me/529991223445" target="_blank" rel="noreferrer" className="p-2 text-emerald-600 bg-emerald-50 rounded-full hover:bg-emerald-100 transition-colors">
                          <Phone size={16} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECCIÓN NUEVA: MISIONERAS */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Misioneras</span>
                  
                  <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                    
                    <div className="p-4 flex items-center justify-between border-b border-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-50 p-2 rounded-xl text-misional-gold">
                          <Users size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-700">Hna. Magaña y Jones</span>
                          <span className="text-[10px] text-slate-400">Pensiones 1</span>
                        </div>
                      </div>
                      <a href="https://wa.me/529991274463" target="_blank" rel="noreferrer" className="p-2 text-emerald-600 bg-emerald-50 rounded-full hover:bg-emerald-100 transition-colors">
                        <Phone size={16} />
                      </a>
                    </div>

                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-50 p-2 rounded-xl text-misional-gold">
                          <Users size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-700">Hna. Galván y Aquino</span>
                          <span className="text-[10px] text-slate-400">Pensiones 2</span>
                        </div>
                      </div>
                      <a href="https://wa.me/529991274463" target="_blank" rel="noreferrer" className="p-2 text-emerald-600 bg-emerald-50 rounded-full hover:bg-emerald-100 transition-colors">
                        <Phone size={16} />
                      </a>
                    </div>

                  </div>
                </div>

                {/* SECCIÓN 3: ACCESO ADMINISTRADOR SECRETO */}
                <div className="pt-4 border-t border-slate-100 flex flex-col items-end gap-3 min-h-[60px]">
                  <AnimatePresence mode="wait">
                    {showPinInput ? (
                      <motion.form 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        onSubmit={handlePinSubmit}
                        className="w-full flex items-center gap-2 bg-white border border-slate-200 p-2 rounded-xl shadow-inner"
                      >
                        <input 
                          autoFocus
                          type="password" 
                          maxLength={4}
                          placeholder="PIN Secreto" 
                          value={pin}
                          onChange={(e) => setPin(e.target.value)}
                          className={`w-full bg-transparent px-2 py-1 text-xs outline-none text-slate-700 tracking-widest font-bold ${pinError ? 'placeholder-red-400' : 'placeholder-slate-400'}`}
                        />
                        <button type="submit" className="p-1.5 bg-iglesia-blue text-white rounded-lg hover:bg-slate-800 transition-colors">
                          <Check size={12} strokeWidth={3} />
                        </button>
                      </motion.form>
                    ) : isAdmin ? (
                      <motion.button 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-[10px] font-bold text-red-500 bg-red-50/50 px-3 py-1.5 rounded-xl border border-red-100/50 hover:bg-red-50 transition-all uppercase tracking-wider"
                      >
                        <Unlock size={12} /> Salir Admin
                      </motion.button>
                    ) : (
                      <button 
                        onClick={() => setShowPinInput(true)}
                        className="text-slate-300/60 hover:text-slate-400 p-2 transition-colors cursor-default border-none bg-transparent"
                        title=""
                      >
                        <Lock size={12} />
                      </button>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}