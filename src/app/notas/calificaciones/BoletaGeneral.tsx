import React from "react";

// Mapeo de los bloques según tu base de datos
const BLOQUES_PRIMARIA = {
  1: { titulo: "Áreas Académicas", ids: [104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115] },
  2: { titulo: "Áreas Extracurriculares", ids: [116, 117] },
  3: { titulo: "Responsabilidades del estudiante con su comportamiento", ids: [118, 119, 120, 121, 122] },
  4: { titulo: "Hábitos Practicados en casa", ids: [123, 124, 125, 126, 127, 128, 129] },
  5: { titulo: "Responsabilidad del estudiante con su aprendizaje", ids: [130, 131, 132, 133] },
};

// Diccionario para traducir el ID numérico del grado al texto abreviado para el PDF
const NOMBRES_GRADOS: Record<string, string> = {
  "6": "1ro Primaria", 
  "7": "2do Primaria", 
  "2": "3ro Primaria", 
  "8": "4to Primaria", 
  "9": "5to Primaria", 
  "10": "6to Primaria",
  "14": "1ro Básico", 
  "15": "2do Básico", 
  "16": "3ro Básico",
  "17": "4to Bachillerato", 
  "18": "5to Bachillerato",
  "19": "4to Perito", 
  "20": "5to Perito", 
  "21": "6to Perito"
};

export const BoletaGeneral = React.forwardRef(({ alumno, seccion }: any, ref: any) => {
  if (!alumno) return null;

  // FORZAMOS A STRING PARA QUE EL DICCIONARIO SIEMPRE LO ENCUENTRE
  const idGradoString = String(alumno.id_grado);
  const textoGrado = NOMBRES_GRADOS[idGradoString] || "Grado no definido";
  
  const textoSeccion = seccion === "1" ? "A" : seccion === "2" ? "B" : seccion === "3" ? "C" : "Única";
  const nombreMaestro = alumno.maestro || "Docente no asignado";
  
  const anioActual = new Date().getFullYear();

  const getMaterias = (bloqueId: number) => alumno.bloques[bloqueId] || [];

  const calcularPromedio = (materias: any[], unidad: string) => {
    const notas = materias.map((m) => parseFloat(m[unidad])).filter((n) => !isNaN(n));
    if (notas.length === 0) return "";
    const suma = notas.reduce((a, b) => a + b, 0);
    return Math.round(suma / notas.length).toString();
  };

  const headerClass = "bg-[#17365D] text-white font-bold text-[10px] py-[2px] px-2 border border-[#17365D] uppercase text-center";
  const cellMateriaClass = "border border-[#17365D] font-bold text-[#17365D] text-[9.5px] py-[1.5px] px-2 text-left w-[44%]";
  
  // 💡 NUEVA FUNCIÓN: Dibuja la celda y evalúa si la nota debe ir en ROJO
  const renderNotaCell = (nota: string | number | undefined) => {
    const num = parseFloat(String(nota));
    const isReprobado = !isNaN(num) && num < 60;
    const textColor = isReprobado ? "text-red-600" : "text-slate-800";
    
    return (
      <td className={`border border-[#17365D] font-black ${textColor} text-[10px] py-[1.5px] text-center w-[11%]`}>
        {nota}
      </td>
    );
  };

  return (
    <div ref={ref} className="relative bg-white w-[210mm] h-[297mm] font-sans print:m-0 overflow-hidden">
      <img
        src="/boleta_primaria.jpg"
        className="absolute inset-0 w-full h-full object-fill z-0"
        alt="Fondo Boleta General"
      />

      <div className="absolute top-[40px] left-[70px] w-[100px] text-center text-[50px] font-black text-red-400/80 tracking-widest z-10">
        {anioActual}
      </div>

      <div className="absolute top-[200px] left-[250px] text-[12px] font-black text-[#17365D] uppercase tracking-wide z-10">
        {alumno.nombre}
      </div>
      
      <div className="absolute top-[223px] left-[157px] text-[12px] font-black text-[#17365D] uppercase tracking-wide z-10">
        {textoGrado}
      </div>
      
      <div className="absolute top-[223px] left-[360px] text-[12px] font-black text-[#17365D] uppercase tracking-wide z-10">
        {textoSeccion}
      </div>
      <div className="absolute top-[223px] left-[430px] text-[11px] font-bold text-[#17365D] uppercase z-10 flex items-center gap-1">
        <span className="text-gray-500 font-normal normal-case text-[10px]">Docente Titular:</span> {nombreMaestro}
      </div>

      <div className="absolute top-[245px] left-1/2 -translate-x-1/2 w-[170mm] z-10 flex flex-col gap-[6px]">
        
        {/* BLOQUE 1: Áreas Académicas */}
        <table className="w-full border-collapse shadow-sm">
          <thead>
            <tr>
              <th className={headerClass}>{BLOQUES_PRIMARIA[1].titulo}</th>
              <th className={headerClass}>I UNIDAD</th>
              <th className={headerClass}>II UNIDAD</th>
              <th className={headerClass}>III UNIDAD</th>
              <th className={headerClass}>IV UNIDAD</th>
              <th className={`${headerClass} leading-tight`}>NOTAS<br/>FINALES</th>
            </tr>
          </thead>
          <tbody>
            {getMaterias(1).map((m: any) => (
              <tr key={m.id_materia}>
                <td className={cellMateriaClass}>{m.materia}</td>
                {/* 💡 USAMOS LA NUEVA FUNCIÓN PARA CADA NOTA */}
                {renderNotaCell(m.u1)}
                {renderNotaCell(m.u2)}
                {renderNotaCell(m.u3)}
                {renderNotaCell(m.u4)}
                <td className="border border-[#17365D] font-black text-slate-800 text-[10px] py-[1.5px] text-center w-[11%]"></td> 
              </tr>
            ))}
            {/* FILA DE PROMEDIO */}
            <tr className="bg-[#17365D]/10">
              <td className={`${cellMateriaClass} text-center italic`}>Promedio por unidad</td>
              {renderNotaCell(calcularPromedio(getMaterias(1), "u1"))}
              {renderNotaCell(calcularPromedio(getMaterias(1), "u2"))}
              {renderNotaCell(calcularPromedio(getMaterias(1), "u3"))}
              {renderNotaCell(calcularPromedio(getMaterias(1), "u4"))}
              <td className="border border-[#17365D] font-black text-slate-800 text-[10px] py-[1.5px] text-center w-[11%]"></td>
            </tr>
          </tbody>
        </table>

        {/* BLOQUE 2: Áreas Extracurriculares */}
        {getMaterias(2).length > 0 && (
          <>
            <div className="text-center font-bold italic text-[12px] text-[#17365D] -mb-1 mt-1">
              Programas Educativos Extracurriculares:
            </div>
            <table className="w-full border-collapse shadow-sm">
              <thead>
                <tr>
                  <th className={headerClass}>{BLOQUES_PRIMARIA[2].titulo}</th>
                  <th className={headerClass}>I UNIDAD</th>
                  <th className={headerClass}>II UNIDAD</th>
                  <th className={headerClass}>III UNIDAD</th>
                  <th className={headerClass}>IV UNIDAD</th>
                </tr>
              </thead>
              <tbody>
                {getMaterias(2).map((m: any) => (
                  <tr key={m.id_materia}>
                    <td className={cellMateriaClass}>{m.materia}</td>
                    {renderNotaCell(m.u1)}
                    {renderNotaCell(m.u2)}
                    {renderNotaCell(m.u3)}
                    {renderNotaCell(m.u4)}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* BLOQUE 3: Responsabilidades del estudiante */}
        {getMaterias(3).length > 0 && (
          <>
            <div className="text-center font-bold italic text-[12px] text-[#17365D] -mb-1 mt-1">
              Resultado: Destaca, Avanza, Necesita Mejorar, Insatisfactorio:
            </div>
            <table className="w-full border-collapse shadow-sm">
              <thead>
                <tr>
                  <th className={`${headerClass} leading-tight py-1`}>{BLOQUES_PRIMARIA[3].titulo}</th>
                  <th className={headerClass}>I UNIDAD</th>
                  <th className={headerClass}>II UNIDAD</th>
                  <th className={headerClass}>III UNIDAD</th>
                  <th className={headerClass}>IV UNIDAD</th>
                </tr>
              </thead>
              <tbody>
                {getMaterias(3).map((m: any) => (
                  <tr key={m.id_materia}>
                    <td className={cellMateriaClass}>{m.materia}</td>
                    {renderNotaCell(m.u1)}
                    {renderNotaCell(m.u2)}
                    {renderNotaCell(m.u3)}
                    {renderNotaCell(m.u4)}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* BLOQUE 4: Hábitos */}
        {getMaterias(4).length > 0 && (
          <table className="w-full border-collapse shadow-sm">
            <thead>
              <tr>
                <th className={headerClass}>{BLOQUES_PRIMARIA[4].titulo}</th>
                <th className={headerClass}>I UNIDAD</th>
                <th className={headerClass}>II UNIDAD</th>
                <th className={headerClass}>III UNIDAD</th>
                <th className={headerClass}>IV UNIDAD</th>
              </tr>
            </thead>
            <tbody>
              {getMaterias(4).map((m: any) => (
                <tr key={m.id_materia}>
                  <td className={cellMateriaClass}>{m.materia}</td>
                  {renderNotaCell(m.u1)}
                  {renderNotaCell(m.u2)}
                  {renderNotaCell(m.u3)}
                  {renderNotaCell(m.u4)}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* BLOQUE 5: Responsabilidad con su aprendizaje */}
        {getMaterias(5).length > 0 && (
          <table className="w-full border-collapse shadow-sm">
            <thead>
              <tr>
                <th className={`${headerClass} leading-tight py-1`}>{BLOQUES_PRIMARIA[5].titulo}</th>
                <th className={headerClass}>I UNIDAD</th>
                <th className={headerClass}>II UNIDAD</th>
                <th className={headerClass}>III UNIDAD</th>
                <th className={headerClass}>IV UNIDAD</th>
              </tr>
            </thead>
            <tbody>
              {getMaterias(5).map((m: any) => (
                <tr key={m.id_materia}>
                  <td className={`${cellMateriaClass} leading-tight`}>{m.materia}</td>
                  {renderNotaCell(m.u1)}
                  {renderNotaCell(m.u2)}
                  {renderNotaCell(m.u3)}
                  {renderNotaCell(m.u4)}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style jsx>{`
        @media print {
          body { -webkit-print-color-adjust: exact; margin: 0; }
        }
      `}</style>
    </div>
  );
});

BoletaGeneral.displayName = "BoletaGeneral";