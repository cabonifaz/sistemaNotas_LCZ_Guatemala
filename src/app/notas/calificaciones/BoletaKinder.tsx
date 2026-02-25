import React from "react";

export const BoletaKinder = React.forwardRef(({ alumno, unidadActual = 3, seccion, anio }: any, ref: any) => {
  if (!alumno) return null;
  const anioImprimir = anio || new Date().getFullYear();
  const numerosRomanos = ["I", "II", "III", "IV"];
  const tituloUnidad = `${numerosRomanos[unidadActual - 1]} UNIDAD`;
  const propNota = `u${unidadActual}`;
  let subtituloUnidad = "CONSTRUYENDO NUESTRA CONVIVENCIA";

  const obtenerLetraSeccion = () => {
    const s = seccion || alumno.seccion || alumno.id_seccion || "";
    if (s == 1 || s === "1" || s === "A" || s === "a") return "A";
    if (s == 2 || s === "2" || s === "B" || s === "b") return "B";
    return s; 
  };

  return (
    <div ref={ref} className="relative bg-white w-[210mm] h-[297mm] text-slate-800 font-sans print:m-0 overflow-hidden">
      <img src="/fondo_boleta_kinder.jpg" className="absolute inset-0 w-full h-full object-fill z-0" alt="Fondo Kinder" />
      
      {/* 💡 AÑO DINÁMICO */}
      <div className="absolute top-[40px] left-[70px] w-[100px] text-center text-[50px] font-black text-red-400/80 tracking-widest z-10">
        {anioImprimir}
      </div>

      <div className="absolute top-[211px] left-[440px] text-[16px] font-bold text-blue-900 uppercase italic z-10 w-[320px]">
        <p className="mb-[13px]">{alumno.nombre}</p>
        <p className="mb-[10px]">KINDER {obtenerLetraSeccion()}</p>
        <p>{alumno.maestro || alumno.profesor || "Katherine Rocío Morales"}</p>
      </div>

      <div className="absolute top-[382px] left-[55px] w-[230px] text-center z-20">
        <div className="bg-transparent inline-block">
          <h2 className="text-[25px] font-black text-red-600 leading-none mb-1">{tituloUnidad}</h2>
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter leading-[1.1] max-w-[110px] mx-auto">
            {unidadActual === 3 ? (<>CONSTRUYENDO <br /> NUESTRA CONVIVENCIA</>) : (subtituloUnidad)}
          </p>
        </div>
      </div>

      <div className="absolute top-[527px] left-[60px] w-[290px] z-10">
        <table className="w-full border-collapse">
          <tbody>
            {(alumno.curriculares || []).map((m: any, idx: number) => (
              <tr key={`curr-${idx}`} style={{ height: "56px" }}>
                <td className="w-[400px]"></td>
                <td className="w-[350px] text-center text-[26px] font-black text-orange-500 italic align-middle pr-8">{m[propNota] || ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="absolute top-[465px] left-[450px] w-[320px] z-10 text-center">
        <h3 className="bg-blue-900 text-white text-[14px] font-black uppercase py-2 rounded-t-2xl tracking-wide border-b-4 border-blue-800 leading-none">Comportamiento del Estudiante</h3>
      </div>

      <div className="absolute top-[515px] left-[450px] w-[320px] z-10">
        <table className="w-full border-collapse">
          <tbody>
            {(alumno.aspectos || []).map((asp: any, idx: number) => (
              <tr key={`asp-${idx}`} style={{ height: "42px" }}>
                <td className="w-[250px] text-[12px] font-bold text-blue-900 italic leading-tight pr-4 align-middle">{asp.materia}</td>
                <td className="w-[70px] text-center text-[24px] font-black text-orange-500 italic align-middle pr-4">{asp[propNota] || ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style jsx>{`@media print { body { -webkit-print-color-adjust: exact; margin: 0; } img { max-width: none !important; } }`}</style>
    </div>
  );
});
BoletaKinder.displayName = "BoletaKinder";