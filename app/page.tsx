import { Calendar, ArrowRight } from "lucide-react"; 
import Link from "next/link"; 
import Image from "next/image"; 

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-5 md:p-8 z-0">
      
      {/* FONDO (Se pinta instantáneamente) */}
      <div className="absolute inset-0 -z-10 bg-[#f8fafc] overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-iglesia-blue/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-misional-gold/15 rounded-full blur-[120px]" />
        <div className="absolute top-[30%] left-[20%] w-[400px] h-[400px] bg-white/60 rounded-full blur-[80px]" />
      </div>

      <div className="w-full max-w-3xl flex flex-col items-center gap-12 md:gap-16 pt-10">
        
        {/* CENTRO: IMAGEN Y FRASE */}
        <div className="flex flex-col items-center text-center gap-8 px-4">
          
          <div className="relative w-full max-w-md aspect-[4/5] flex justify-center items-center overflow-hidden transition-transform duration-500 hover:scale-[1.03]">
            <Image 
              src="/img/cristo.png"
              alt="El Salvador"
              width={500} 
              height={625} 
              priority 
              className="w-full h-full object-contain"
              style={{
                WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
                maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
              }}
            />
          </div>

          <div className="space-y-4 max-w-xl -mt-8 relative z-10">
            <p className="text-xl md:text-3xl italic text-slate-800 leading-relaxed font-light">
              "Cuando os halláis al servicio de vuestros semejantes, solo estáis al servicio de vuestro Dios."
            </p>
            <div className="flex items-center justify-center gap-4">
              <span className="h-px w-8 bg-misional-gold/50"></span>
              <span className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-iglesia-blue">
                Mosíah 2:17
              </span>
              <span className="h-px w-8 bg-misional-gold/50"></span>
            </div>
          </div>
        </div>

        {/* NAVEGACIÓN INFERIOR (Carga directa) */}
        <nav className="w-full max-w-lg flex flex-col sm:flex-row gap-5 z-10">
          
          <Link 
            href="/pensiones-1"
            className="group relative flex-1 flex flex-col items-center gap-4 p-6 rounded-2xl bg-white/80 backdrop-blur-md border border-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:bg-white"
          >
            <div className="w-full flex justify-between items-start">
              <div className="bg-slate-50 p-3 rounded-xl text-iglesia-blue group-hover:bg-iglesia-blue group-hover:text-white transition-colors duration-300">
                <Calendar strokeWidth={1.5} size={28} />
              </div>
              <ArrowRight size={20} className="text-slate-300 group-hover:text-iglesia-blue group-hover:translate-x-1 transition-all" />
            </div>

            <div className="w-full text-left mt-2">
              <span className="block font-bold text-slate-800 text-lg mb-1">Pensiones 1</span>
              <span className="text-[11px] font-bold uppercase tracking-widest text-misional-gold">
                Ver Disponibilidad
              </span>
            </div>
          </Link>
          
          <Link 
            href="/pensiones-2"
            className="group relative flex-1 flex flex-col items-center gap-4 p-6 rounded-2xl bg-white/80 backdrop-blur-md border border-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:bg-white"
          >
            <div className="w-full flex justify-between items-start">
              <div className="bg-slate-50 p-3 rounded-xl text-iglesia-blue group-hover:bg-iglesia-blue group-hover:text-white transition-colors duration-300">
                <Calendar strokeWidth={1.5} size={28} />
              </div>
              <ArrowRight size={20} className="text-slate-300 group-hover:text-iglesia-blue group-hover:translate-x-1 transition-all" />
            </div>

            <div className="w-full text-left mt-2">
              <span className="block font-bold text-slate-800 text-lg mb-1">Pensiones 2</span>
              <span className="text-[11px] font-bold uppercase tracking-widest text-misional-gold">
                Ver Disponibilidad
              </span>
            </div>
          </Link>

        </nav>
      </div>
    </main>
  );
}