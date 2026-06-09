"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Phone, User } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

// 👇 IMPORTAMOS EL TÚNEL HACIA SUPABASE
import { supabase } from "@/lib/supabase";

type BookingInfo = {
  familyName: string;
  responsible: string;
  phone: string;
  address: string;
  createdAt: string;
};

export default function Pensiones1() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookings, setBookings] = useState<Record<string, BookingInfo>>({});
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Nuevo estado para evitar que le den doble clic al botón mientras se guarda
  const [isLoading, setIsLoading] = useState(false); 

  // Límites del calendario
  const today = new Date();
  const maxFutureDate = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate());

  // 👇 1. LEER LAS CITAS DESDE SUPABASE AL CARGAR LA PÁGINA
  useEffect(() => {
    setIsAdmin(localStorage.getItem("isAdmin") === "true");
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    // Traemos solo las reservas de Pensiones 1 (pension_type = '1')
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("pension_type", "1");

    if (error) {
      console.error("Error cargando citas:", error);
      return;
    }

    // Convertimos la lista de Supabase a nuestro formato de fechas del calendario
    const bookingsRecord: Record<string, BookingInfo> = {};
    if (data) {
      data.forEach((row) => {
        bookingsRecord[row.date] = {
          familyName: row.family_name,
          responsible: row.responsible,
          phone: row.phone,
          address: row.address,
          createdAt: row.created_at,
        };
      });
    }
    setBookings(bookingsRecord);
  };

  const dateKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  const existingBooking = bookings[dateKey];
  const bookedDates = Object.keys(bookings).map(dateStr => new Date(dateStr + "T12:00:00"));

  const handleDaySelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setIsModalOpen(true);
    }
  };

  // 👇 2. GUARDAR LA CITA EN SUPABASE
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const familyName = formData.get("familyName") as string;
    const responsible = formData.get("responsible") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;

    // Insertamos en la tabla
    const { error } = await supabase
      .from("bookings")
      .insert([
        {
          date: dateKey,
          pension_type: "1", // <- Identificador clave para Pensiones 1
          family_name: familyName,
          responsible: responsible,
          phone: phone,
          address: address,
        }
      ]);

    if (error) {
      alert("Hubo un error al guardar. Puede que alguien más ya haya reservado esta fecha.");
      console.error(error);
      setIsLoading(false);
      return;
    }

    // Si se guardó bien en la nube, actualizamos la pantalla
    const newBooking: BookingInfo = {
      familyName,
      responsible,
      phone,
      address,
      createdAt: new Date().toLocaleString("es-MX"),
    };
    
    setBookings({ ...bookings, [dateKey]: newBooking });
    setIsLoading(false);
    setIsModalOpen(false);
    setSelectedDate(undefined);
  };

  // 👇 3. CANCELAR LA CITA EN SUPABASE (MODO ADMIN)
  const handleDeleteBooking = async () => {
    if (!confirm("¿Segura que deseas liberar esta fecha?")) return;
    setIsLoading(true);

    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("date", dateKey)
      .eq("pension_type", "1");

    if (error) {
      alert("Hubo un error al borrar la cita.");
      console.error(error);
      setIsLoading(false);
      return;
    }

    // Si se borró de la nube, lo quitamos de la pantalla
    const newBookings = { ...bookings };
    delete newBookings[dateKey];
    setBookings(newBookings);
    setIsLoading(false);
    setIsModalOpen(false);
    setSelectedDate(undefined);
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center p-5 md:p-8 pt-24 z-0">
      
      {/* FONDO ELEGANTE */}
      <div className="absolute inset-0 -z-10 bg-[#f8fafc] overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-iglesia-blue/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-misional-gold/15 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md space-y-6 mt-4">
        
        {/* SECCIÓN 1: TÍTULO Y ALERTA (Minimalista) */}
        <motion.section 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 shadow-lg shadow-iglesia-blue/5 border border-white flex flex-col items-center text-center"
        >
          <h1 className="text-3xl font-extrabold text-iglesia-blue tracking-tight mb-1">Pensiones 1</h1>
          <h2 className="text-[#d4af37] font-bold text-sm mb-6">Hna. Magaña y Hna. Jones</h2>
          
          <div className="flex flex-col items-center gap-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.40em]">Restricciones</span>
            <span className="text-xs font-medium text-slate-500 italic">ninguna registrada.</span>
          </div>
        </motion.section>

        {/* SECCIÓN 2: CALENDARIO PREMIUM */}
        <motion.section 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 shadow-lg shadow-iglesia-blue/5 border border-white flex flex-col items-center"
        >
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] mb-6 text-center w-full">Selecciona una fecha</h2>
          
          <div className="
            w-full flex justify-center
            [&_.rdp]:m-0 
            [&_.rdp-table]:w-full [&_.rdp-table]:max-w-[320px] 
            [&_.rdp-caption_label]:text-[#002e5d] [&_.rdp-caption_label]:font-extrabold [&_.rdp-caption_label]:text-xl
            [&_.rdp-head_cell]:text-slate-400 [&_.rdp-head_cell]:font-bold [&_.rdp-head_cell]:text-[11px]
            [&_.rdp-day]:text-slate-700 [&_.rdp-day]:font-medium
          ">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={handleDaySelect}
              locale={es}
              
              /* BLINDAJE DE NAVEGACIÓN */
              disabled={[{ before: today }]} 
              fromDate={today}
              toDate={maxFutureDate}
              fromMonth={today}
              toMonth={maxFutureDate}
              startMonth={today}
              endMonth={maxFutureDate}

              modifiers={{ booked: bookedDates }}
              style={{
                '--rdp-accent-color': '#d4af37',
                '--rdp-background-color': 'rgba(212, 175, 55, 0.1)',
                '--rdp-outline': '2px solid #d4af37',
                '--rdp-outline-selected': '2px solid #d4af37',
              } as React.CSSProperties}
              styles={{
                nav_button_previous: { color: '#d4af37' },
                nav_button_next: { color: '#d4af37' },
                day_today: { color: '#d4af37', fontWeight: '900' }
              }}
              modifiersStyles={{
                selected: { 
                  backgroundColor: '#d4af37', color: 'white', fontWeight: 'bold', borderRadius: '100%', border: 'none'
                },
                booked: { 
                  backgroundColor: '#059669', color: 'white', fontWeight: 'bold', borderRadius: '100%', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)' 
                }
              }}
              className="bg-transparent"
            />
          </div>
          
          {/* LEYENDA DEL CALENDARIO */}
          <div className="flex gap-8 mt-6 pt-6 border-t border-slate-200/60 w-full justify-center">
            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
              <div className="w-3 h-3 rounded-full bg-emerald-600 shadow-sm"></div> Reservado
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <div className="w-3 h-3 rounded-full bg-slate-100 border border-slate-300"></div> Disponible
            </div>
          </div>
        </motion.section>

      </div>

      {/* MODAL / FORMULARIO */}
      <AnimatePresence mode="wait">
        {isModalOpen && selectedDate && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex justify-center items-center z-[100] p-4"
          >
            <motion.div 
              initial={{ y: 30, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-white/95 backdrop-blur-xl w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden relative border border-white"
            >
              
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedDate(undefined); 
                }} 
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-800 bg-slate-100 rounded-full p-2 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="p-8">
                <div className="mb-8">
                  <span className="text-[#d4af37] font-bold text-[10px] uppercase tracking-[0.2em]">Detalles de la Cita</span>
                  <h2 className="text-2xl font-bold text-slate-800 mt-1 capitalize tracking-tight">
                    {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
                  </h2>
                </div>

                {existingBooking ? (
                  <div className="space-y-6">
                    <div className="bg-emerald-600 text-white text-center py-3.5 rounded-2xl font-bold tracking-[0.15em] uppercase text-[10px] shadow-lg shadow-emerald-600/20">
                      Fecha ya Reservada
                    </div>
                    <div className="space-y-5 bg-slate-50 border border-slate-100 p-6 rounded-3xl">
                      <div className="flex items-center gap-4">
                        <div className="bg-white p-3 rounded-2xl shadow-sm text-[#d4af37]"><User size={20}/></div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Familia</p>
                          <p className="font-bold text-slate-700">{existingBooking.familyName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="bg-white p-3 rounded-2xl shadow-sm text-[#d4af37]"><Phone size={20}/></div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Contacto</p>
                          <p className="font-medium text-slate-600 text-sm">{existingBooking.responsible} • {existingBooking.phone}</p>
                        </div>
                      </div>
                      {existingBooking.address && (
                        <div className="flex items-center gap-4">
                          <div className="bg-white p-3 rounded-2xl shadow-sm text-[#d4af37]"><MapPin size={20}/></div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Ubicación</p>
                            <p className="font-medium text-slate-600 text-sm">{existingBooking.address}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* BOTÓN SECRETO DE CANCELACIÓN (SOLO ADMIN) */}
                    {isAdmin && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="pt-4 border-t border-slate-200 border-dashed"
                      >
                        <button 
                          onClick={handleDeleteBooking}
                          disabled={isLoading}
                          className="w-full flex justify-center items-center gap-2 bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white disabled:opacity-50 font-bold py-4 rounded-2xl transition-all active:scale-95 shadow-sm tracking-[0.15em] uppercase text-[10px]"
                        >
                          <X size={16} strokeWidth={3} />
                          {isLoading ? "Borrando..." : "Cancelar Cita"}
                        </button>
                      </motion.div>
                    )}

                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] ml-2">Nombre de la Familia</label>
                      <input required name="familyName" type="text" placeholder="Ej. Familia Martínez" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#d4af37] outline-none transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] ml-2">Responsable</label>
                      <input required name="responsible" type="text" placeholder="¿Quién recibe a las misioneras?" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#d4af37] outline-none transition-all" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] ml-2">WhatsApp</label>
                        <input 
                          required 
                          name="phone" 
                          type="tel" 
                          pattern="[0-9]{10}"
                          maxLength={10}
                          minLength={10}
                          title="Debe ingresar exactamente 10 números"
                          placeholder="10 dígitos" 
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#d4af37] outline-none transition-all" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] ml-2">Dirección</label>
                        <input name="address" type="text" placeholder="Opcional" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#d4af37] outline-none transition-all" />
                      </div>
                    </div>
                    <button disabled={isLoading} type="submit" className="w-full bg-iglesia-blue text-white font-bold py-4 rounded-2xl mt-2 disabled:bg-slate-400 hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-iglesia-blue/20 tracking-[0.15em] uppercase text-[10px]">
                      {isLoading ? "Guardando..." : "Confirmar Fecha"}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}