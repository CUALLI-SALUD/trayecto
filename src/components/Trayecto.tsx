import { useState } from "react";

type Estudio = {
  id: number;
  nombre: string;
  tiempo: number;
  estado: "completado" | "espera" | "pendiente";
  progreso?: number;
  desc?: string;
};

export default function Trayecto() {
  const [estudios, setEstudios] = useState<Estudio[]>([
    { id: 1, nombre: "Check-in", tiempo: 0, estado: "completado", desc: "Registro finalizado a las 08:30 AM." },
    { id: 2, nombre: "Laboratorio", tiempo: 5, estado: "espera", progreso: 66, desc: "Tu turno se aproxima. Mantente cerca del área." },
    { id: 3, nombre: "Ultrasonido de Tiroides", tiempo: 15, estado: "pendiente", desc: "Iniciará después del laboratorio." },
    { id: 4, nombre: "Rayos X", tiempo: 20, estado: "pendiente", desc: "Se requiere vestimenta cómoda." },
    { id: 5, nombre: "Electrocardiograma", tiempo: 10, estado: "pendiente", desc: "Último paso de tu trayecto hoy." },
  ]);

  // Estado para saber si ya se optimizó y no dejar que se presione infinitas veces
  const [optimizado, setOptimizado] = useState(false);

  const optimizarRuta = () => {
    if (optimizado) return;

    const completados = estudios.filter((e) => e.estado === "completado");
    
    // Aquí es donde sucede la magia: Reordena y reduce el tiempo
    const resto = estudios
      .filter((e) => e.estado !== "completado")
      .sort((a, b) => a.tiempo - b.tiempo) // Ordena de menor a mayor tiempo
      .map((e) => ({
        ...e,
        // Reduce el tiempo de los pendientes un 30% para simular la optimización
        tiempo: Math.max(2, Math.floor(e.tiempo * 0.7)), 
      }));

    setEstudios([...completados, ...resto]);
    setOptimizado(true); // Marca como optimizado
  };

  // Calcula el tiempo sumando los valores actuales
  const total = estudios.reduce((acc, e) => acc + e.tiempo, 0);

  return (
    <div className="space-y-6">
      {/* CARD VERDE PRINCIPAL */}
      <div className="bg-gradient-to-br from-[#1B8B4C] to-[#0A6C35] text-white p-6 rounded-[24px] shadow-md relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
        
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider opacity-90 mb-3">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          ESTADO EN TIEMPO REAL
        </div>
        
        <h2 className="text-4xl font-bold mb-2">Total en clínica: {total} min</h2>
        <p className="text-sm font-medium text-green-100">
          Próximo estudio: {estudios[1]?.tiempo || 0} min <span className="font-bold text-white">(3 personas antes)</span>
        </p>
      </div>

      <h3 className="text-lg font-bold text-gray-800">Estado de tus servicios</h3>

      {/* TIMELINE */}
      <div className="relative pl-4 mt-2">
        {/* Línea punteada de fondo */}
        <div className="absolute left-8 top-4 bottom-8 w-[2px] border-l-2 border-dashed border-gray-200"></div>

        {estudios.map((e, i) => (
          <div key={e.id} className="mb-5 relative flex items-start gap-4">
            
            {/* ICONO DEL TIMELINE */}
            <div className={`w-9 h-9 rounded-full flex items-center justify-center z-10 shrink-0 mt-2 shadow-sm ${
                e.estado === "completado" ? "bg-green-100 text-green-600" :
                e.estado === "espera" ? "bg-orange-100 text-orange-600" :
                "bg-gray-100 text-gray-400"
              }`}
            >
              {e.estado === "completado" && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>}
              {e.estado === "espera" && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>}
              {e.estado === "pendiente" && <div className="w-3 h-3 bg-gray-300 rounded-full"></div>}
            </div>

            {/* TARJETA */}
            <div className={`flex-1 bg-white p-4 rounded-2xl shadow-sm border ${
              e.estado === "espera" ? "border-yellow-400" : "border-gray-100"
            }`}>
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-gray-800 text-[15px]">{e.nombre}</h3>
                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide ${
                    e.estado === "completado" ? "bg-green-50 text-green-700" :
                    e.estado === "espera" ? "bg-orange-50 text-orange-700" :
                    "bg-gray-100 text-gray-500"
                  }`}
                >
                  {e.estado}
                </span>
              </div>
              
              <p className="text-sm text-gray-500 mb-3">{e.desc}</p>

              {e.estado === "espera" && (
                <div className="mb-3">
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-orange-500 h-full rounded-full" style={{ width: `${e.progreso}%` }} />
                  </div>
                  <div className="flex justify-end mt-1 text-xs font-bold text-orange-600">{e.progreso}%</div>
                </div>
              )}

              <div className={`text-xs font-semibold flex items-center gap-1 ${e.estado === "completado" ? "text-green-600" : e.estado === "espera" ? "text-orange-600" : "text-gray-400"}`}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Espera aprox: {e.tiempo} min
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* BOTÓN INFERIOR */}
      <div className="pt-4">
        <button 
          onClick={optimizarRuta} 
          className="w-full bg-[#006B3F] hover:bg-[#005a34] text-white py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
          {optimizado ? "Ruta Optimizada ✅" : "Optimizar ruta ✨"}
        </button>
        <p className="text-center text-xs text-gray-400 mt-3 italic">
          Nuestra IA recalculará tu ruta para minimizar los tiempos de espera totales.
        </p>
      </div>
    </div>
  );
}