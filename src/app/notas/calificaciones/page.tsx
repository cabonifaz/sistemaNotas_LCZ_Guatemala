"use client";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { BoletaNursery } from "./BoletaNursery";
import { BoletaPreKinder } from "./BoletaPreKinder";
import { BoletaKinder } from "./BoletaKinder";
import { BoletaPreparatoria } from "./BoletaPreparatoria";

import {
  obtenerMatrizNotas,
  guardarCalificacionesMasivas,
  obtenerPermisosUsuario,
  obtenerMaestroTitular,
} from "../../actions";

export default function CalificacionesPage() {
  const [grado, setGrado] = useState("");
  const [seccion, setSeccion] = useState("");
  const [estudiantesAgrupados, setEstudiantesAgrupados] = useState<any[]>([]);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [expandidos, setExpandidos] = useState<number[]>([]);
  const [permisos, setPermisos] = useState<any>(null);

  const componentRef = useRef<HTMLDivElement>(null);
  const [alumnoParaImprimir, setAlumnoParaImprimir] = useState<any>(null);
  const [unidadAImprimir, setUnidadAImprimir] = useState(3);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Boleta_${alumnoParaImprimir?.nombre || "Estudiante"}`,
  });

  // 💡 EL DICCIONARIO MAESTRO COMPLETO (Igual que en estudiantes)
  const NIVELES = [
    {
      nivel: "Pre-Primaria",
      grados: [
        { id: '31', nombre: 'Nursery I', secciones: [{ id: '4', label: 'Única' }] },
        { id: '32', nombre: 'Nursery II', secciones: [{ id: '4', label: 'Única' }] },
        { id: '33', nombre: 'Nursery III', secciones: [{ id: '4', label: 'Única' }] },
        { id: '4', nombre: 'Pre-Kinder', secciones: [{ id: '1', label: 'A' }, { id: '2', label: 'B' }] },
        { id: '5', nombre: 'Kinder', secciones: [{ id: '1', label: 'A' }, { id: '2', label: 'B' }] },
        { id: '1', nombre: 'Preparatoria', secciones: [{ id: '1', label: 'A' }, { id: '2', label: 'B' }] },
      ]
    },
    {
      nivel: "Primaria",
      grados: [
        { id: '6', nombre: '1ro Primaria', secciones: [{ id: '1', label: 'A' }, { id: '2', label: 'B' }] },
        { id: '7', nombre: '2do Primaria', secciones: [{ id: '1', label: 'A' }, { id: '2', label: 'B' }] },
        { id: '2', nombre: '3ro Primaria', secciones: [{ id: '1', label: 'A' }, { id: '2', label: 'B' }] },
        { id: '8', nombre: '4to Primaria', secciones: [{ id: '1', label: 'A' }, { id: '2', label: 'B' }] },
        { id: '9', nombre: '5to Primaria', secciones: [{ id: '1', label: 'A' }, { id: '2', label: 'B' }] },
        { id: '10', nombre: '6to Primaria', secciones: [{ id: '1', label: 'A' }, { id: '2', label: 'B' }] },
      ]
    },
    {
      nivel: "Básico",
      grados: [
        { id: '14', nombre: 'Primero Básico', secciones: [{ id: '1', label: 'A' }, { id: '2', label: 'B' }] },
        { id: '15', nombre: 'Segundo Básico', secciones: [{ id: '1', label: 'A' }, { id: '2', label: 'B' }] },
        { id: '16', nombre: 'Tercero Básico', secciones: [{ id: '1', label: 'A' }, { id: '2', label: 'B' }, { id: '3', label: 'C' }] },
      ]
    },
    {
      nivel: "Diversificado",
      grados: [
        { id: '17', nombre: 'Cuarto Bachillerato', secciones: [{ id: '1', label: 'A' }, { id: '2', label: 'B' }] },
        { id: '18', nombre: 'Quinto Bachillerato', secciones: [{ id: '4', label: 'Única' }] },
        { id: '19', nombre: 'Cuarto Perito', secciones: [{ id: '4', label: 'Única' }] },
        { id: '20', nombre: 'Quinto Perito', secciones: [{ id: '4', label: 'Única' }] },
        { id: '21', nombre: 'Sexto Perito', secciones: [{ id: '4', label: 'Única' }] },
      ]
    }
  ];

  // Buscamos el grado seleccionado para renderizar sus secciones
  const gradoSeleccionadoObj = NIVELES.flatMap(n => n.grados).find(g => g.id === grado);

  useEffect(() => {
    async function cargarPermisos() {
      const p = await obtenerPermisosUsuario();
      setPermisos(p);
    }
    cargarPermisos();
  }, []);

  // --- PLANTILLAS MAESTRAS (Mantenidas intactas para no romper las boletas) ---
  const curricularesNurseryBase = [
    { id_materia: 6, materia: "Comunicación y Lenguaje", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 7, materia: "Destrezas de Aprendizaje", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 8, materia: "Conocimiento de su mundo", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 9, materia: "Educación Cristiana", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 10, materia: "Expresión Artística", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 11, materia: "Idioma Inglés", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 12, materia: "Motricidad", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
  ];
  const aspectosNurseryBase = [
    { id_materia: 13, materia: "Participa activamente en clase", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 14, materia: "Es responsable con sus deberes y obligaciones", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 15, materia: "Termina tareas a tiempo", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 16, materia: "Practica valores morales diariamente", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 17, materia: "Aplica hábitos higiénicos en sus actividades", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 18, materia: "Autonomía", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 19, materia: "Conducta", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 20, materia: "Puntualidad", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
  ];
  const curricularesPreKinderBase = [
    { id_materia: 1, materia: "Educación Para la Ciencia y la Ciudadanía", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 2, materia: "Destreza de Comunicación y Lenguaje", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 35, materia: "Destrezas de Aprendizaje Matemático", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 36, materia: "Educación Física", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 37, materia: "Educación Musical", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 38, materia: "Artes Visuales", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 39, materia: "Educación Cristiana", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
  ];
  const aspectosPreKinderBase = [
    { id_materia: 40, materia: "Participa activamente en clase", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 41, materia: "Es responsable con sus deberes y obligaciones", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 42, materia: "Termina tareas a tiempo", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 43, materia: "Practica valores morales diariamente", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 44, materia: "Aplica hábitos higiénicos en sus actividades", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 45, materia: "Autonomía", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 46, materia: "Conducta", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 47, materia: "Puntualidad", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
  ];
  const curricularesKinderBase = [
    { id_materia: 48, materia: "Educación Para la Ciencia y la Ciudadanía", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 49, materia: "Destreza de Comunicación y Lenguaje", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 50, materia: "Destrezas de Aprendizaje Matemático", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 51, materia: "Educación Física", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 52, materia: "Educación Musical", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 53, materia: "Artes Visuales", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 54, materia: "Idioma Inglés", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 55, materia: "Educación Cristiana", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
  ];
  const aspectosKinderBase = [
    { id_materia: 56, materia: "Participa activamente en clase", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 57, materia: "Es responsable con sus deberes y obligaciones", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 58, materia: "Termina tareas a tiempo", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 59, materia: "Practica valores morales diariamente", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 60, materia: "Aplica hábitos higiénicos en sus actividades", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 61, materia: "Autonomía", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 62, materia: "Conducta", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 63, materia: "Puntualidad", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
  ];
  const curricularesPreparatoriaBase = [
    { id_materia: 64, materia: "Educación Para la Ciencia y la Ciudadanía", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 65, materia: "Destreza de Comunicación y Lenguaje", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 66, materia: "Destrezas de Aprendizaje Matemático", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 67, materia: "Educación Física", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 68, materia: "Educación Musical", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 69, materia: "Artes Visuales", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 70, materia: "Idioma Inglés", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 71, materia: "Educación Cristiana", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
  ];
  const aspectosPreparatoriaBase = [
    { id_materia: 72, materia: "Participa activamente en clase", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 73, materia: "Es responsable con sus deberes y obligaciones", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 74, materia: "Termina tareas a tiempo", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 75, materia: "Practica valores morales diariamente", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 76, materia: "Aplica hábitos higiénicos en sus actividades", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 77, materia: "Autonomía", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 78, materia: "Conducta", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
    { id_materia: 79, materia: "Puntualidad", tipo: "Texto_Prepa", u1: "", u2: "", u3: "", u4: "" },
  ];
  const areasPrimaria = [
    {
      id: 1,
      titulo: "1. Áreas Académicas",
      keywords: ["idioma materno", "inglés", "matemáticas", "medio social", "medio natural", "expresión artística", "educación física", "formación ciudadana", "ortografía", "artes plásticas", "moral cristiana", "computación"],
    },
    {
      id: 2,
      titulo: "2. Programas Educativos Extracurriculares",
      keywords: ["comprensión de lectura", "lógica matemática"],
    },
    {
      id: 3,
      titulo: "3. Responsabilidades del estudiante con su comportamiento",
      keywords: ["respeta autoridad", "interactúa bien", "derechos y propiedades", "control de sí mismo", "acepta responsabilidad"],
    },
    {
      id: 4,
      titulo: "4. Hábitos Practicados en casa",
      keywords: ["llega a tiempo", "preparado para aprender", "termina tareas", "lee diariamente", "atiende junta", "práctica matemáticas diariamente", "práctica vocabulario"],
    },
    {
      id: 5,
      titulo: "5. Responsabilidad del estudiante con su aprendizaje",
      keywords: ["trabajo / asignatura", "regresa tareas", "actividades de aprendizaje", "valores morales diariamente"],
    },
  ];

  // --- FUNCIONES DE SEGURIDAD SIMPLIFICADAS ---
  const puedeVerGrado = (idG: string) => {
    if (!permisos) return false;
    if (permisos.rol === "Admin" || permisos.asignaciones === "ALL") return true;
    return permisos.asignaciones.some((a: any) => a.id_grado.toString() === idG);
  };

  const puedeVerSeccion = (idS: string) => {
    if (!permisos || !grado) return false;
    if (permisos.rol === "Admin" || permisos.asignaciones === "ALL") return true;
    return permisos.asignaciones.some((a: any) => a.id_grado.toString() === grado && a.seccion.toString() === idS);
  };

  const puedeEditarMateria = (idM: number) => {
    if (!permisos) return false;
    if (permisos.rol === "Admin" || permisos.asignaciones === "ALL") return true;

    const tieneAccesoTotal = permisos.asignaciones.some((a: any) => a.id_grado.toString() === grado && a.seccion.toString() === seccion && a.id_materia === null);
    if (tieneAccesoTotal) return true;

    return permisos.asignaciones.some((a: any) => a.id_grado.toString() === grado && a.seccion.toString() === seccion && a.id_materia === idM);
  };

  const calcularPromedioUnidad = (materias: any[], unidad: string) => {
    const numericas = materias.filter((m) => m.tipo === "Numerica");
    if (numericas.length === 0) return "-";
    const notasValidas = numericas.map((m) => parseFloat(m[unidad])).filter((n) => !isNaN(n));
    if (notasValidas.length === 0) return "0";
    const suma = notasValidas.reduce((a, b) => a + b, 0);
    return Math.round(suma / numericas.length);
  };

  const handleCargarAlumnos = async () => {
    if (!grado || !seccion) {
      alert("⚠️ Selecciona Grado y Sección.");
      return;
    }

    if (!puedeVerSeccion(seccion)) {
      alert("⛔ No tienes permiso para ver o editar los alumnos de esta sección.");
      return;
    }

    setCargando(true);
    let idGFinal = Number(grado);
    let idSFinal = Number(seccion);

    try {
      const datos = await obtenerMatrizNotas(idGFinal, idSFinal);
      const nombreMaestraBD = await obtenerMaestroTitular(idGFinal, idSFinal);

      if (datos && datos.length > 0) {
        const agrupados = datos.reduce((acc: any, curr: any) => {
          const nombre = curr.NOMBRE || `${curr.NOMBRES} ${curr.APELLIDOS}`;
          const idAlumno = curr.ID_ALUMNO || curr.id_estudiante;

          const esNursery = [31, 32, 33].includes(idGFinal);
          const esPreKinder = idGFinal === 4;
          const esKinder = idGFinal === 5;
          const esPreparatoria = idGFinal === 1;
          const esPrePrimaria = esNursery || esPreKinder || esKinder || esPreparatoria;

          if (!acc[nombre]) {
            let cur: any[] = [];
            let asp: any[] = [];

            if (esNursery) {
              cur = curricularesNurseryBase.map((m) => ({ ...m }));
              asp = aspectosNurseryBase.map((m) => ({ ...m }));
            } else if (esPreKinder) {
              cur = curricularesPreKinderBase.map((m) => ({ ...m }));
              asp = aspectosPreKinderBase.map((m) => ({ ...m }));
            } else if (esKinder) {
              cur = curricularesKinderBase.map((m) => ({ ...m }));
              asp = aspectosKinderBase.map((m) => ({ ...m }));
            } else if (esPreparatoria) {
              cur = curricularesPreparatoriaBase.map((m) => ({ ...m }));
              asp = aspectosPreparatoriaBase.map((m) => ({ ...m }));
            }

            acc[nombre] = {
              id_alumno: idAlumno,
              nombre,
              maestro: nombreMaestraBD,
              curriculares: cur,
              aspectos: asp,
              bloques: { 1: [], 2: [], 3: [], 4: [], 5: [] },
              id_grado: idGFinal,
            };
          }

          const idMateria = Number(curr.ID_MATERIA || curr.id_materia);
          const u1 = curr.U1 || "";
          const u2 = curr.U2 || "";
          const u3 = curr.U3 || "";
          const u4 = curr.U4 || "";

          if (esPrePrimaria) {
            const materiaNombreDB = (curr.MATERIA || curr.nombre_materia || "").trim().toLowerCase();
            const itemCurricular = acc[nombre].curriculares.find((m: any) => m.id_materia === idMateria || m.materia.trim().toLowerCase() === materiaNombreDB);
            if (itemCurricular) {
              itemCurricular.id_materia = idMateria;
              itemCurricular.u1 = u1; itemCurricular.u2 = u2; itemCurricular.u3 = u3; itemCurricular.u4 = u4;
            }
            const itemAspecto = acc[nombre].aspectos.find((m: any) => m.id_materia === idMateria || m.materia.trim().toLowerCase() === materiaNombreDB);
            if (itemAspecto) {
              itemAspecto.id_materia = idMateria;
              itemAspecto.u1 = u1; itemAspecto.u2 = u2; itemAspecto.u3 = u3; itemAspecto.u4 = u4;
            }
          } else {
            let areaId: number | null = null;
            const materiaNombre = (curr.MATERIA || curr.nombre_materia || "").trim();
            const mLower = materiaNombre.toLowerCase();
            areasPrimaria.forEach((a) => {
              if (a.keywords.some((k) => mLower.includes(k))) areaId = a.id;
            });

            if (areaId) {
              const itemExistente = acc[nombre].bloques[areaId].find((m: any) => m.materia.toLowerCase() === mLower);
              if (itemExistente) {
                if (u1) itemExistente.u1 = u1; if (u2) itemExistente.u2 = u2; if (u3) itemExistente.u3 = u3; if (u4) itemExistente.u4 = u4;
              } else {
                const itemPrimaria = {
                  id_materia: idMateria,
                  materia: materiaNombre,
                  tipo: areaId === 1 ? "Numerica" : "Texto_Primaria",
                  u1, u2, u3, u4,
                };
                acc[nombre].bloques[areaId].push(itemPrimaria);
                if (areaId === 1) acc[nombre].curriculares.push(itemPrimaria);
                else acc[nombre].aspectos.push(itemPrimaria);
              }
            }
          }
          return acc;
        }, {});
        setEstudiantesAgrupados(Object.values(agrupados));
      } else {
        setEstudiantesAgrupados([]);
        alert("ℹ️ No hay alumnos con notas registradas en este nivel.");
      }
    } finally {
      setCargando(false);
    }
  };

  const handleNotaChange = (idA: number, idM: number, u: string, v: string) => {
    setEstudiantesAgrupados((prev) =>
      prev.map((est) => {
        if (est.id_alumno === idA) {
          const up = (l: any[]) => l.map((m) => (m.id_materia === idM ? { ...m, [u]: v } : m));
          const newB = { ...est.bloques };
          Object.keys(newB).forEach((k) => (newB[k] = up(newB[k])));
          return { ...est, curriculares: up(est.curriculares), aspectos: up(est.aspectos), bloques: newB };
        }
        return est;
      }),
    );
  };

  const handleGuardarNotas = async () => {
    setGuardando(true);
    try {
      const datosAEnviar: any[] = [];
      estudiantesAgrupados.forEach((e) => {
        const mats = [...e.curriculares, ...e.aspectos];
        Object.values(e.bloques).forEach((b: any) => mats.push(...b));
        const unicos = Array.from(new Map(mats.map((m) => [m.id_materia, m])).values());
        const academicas = e.bloques[1] || [];
        const promedios = { u1: calcularPromedioUnidad(academicas, "u1"), u2: calcularPromedioUnidad(academicas, "u2"), u3: calcularPromedioUnidad(academicas, "u3"), u4: calcularPromedioUnidad(academicas, "u4") };

        unicos.forEach((m: any) => {
          datosAEnviar.push({ idEstudiante: e.id_alumno, idMateria: m.id_materia, u1: m.u1, u2: m.u2, u3: m.u3, u4: m.u4 });
        });
        datosAEnviar.push({ idEstudiante: e.id_alumno, idMateria: 500, u1: promedios.u1.toString(), u2: promedios.u2.toString(), u3: promedios.u3.toString(), u4: promedios.u4.toString() });
      });

      await guardarCalificacionesMasivas(datosAEnviar);
      alert("✅ Calificaciones guardadas con éxito.");
    } catch (error) {
      console.error(error);
      alert("❌ Error al guardar.");
    } finally {
      setGuardando(false);
    }
  };

  const renderFilaMateria = (m: any, idA: number) => {
    const editable = puedeEditarMateria(m.id_materia);
    return (
      <tr key={m.id_materia} className={`transition-colors border-b border-gray-50 ${editable ? "hover:bg-red-50/40" : "bg-gray-50/50"}`}>
        <td className="px-10 py-4 text-left font-black text-[11px] uppercase text-gray-700">
          {m.materia}
          {!editable && <span className="ml-2 text-[9px] text-red-500 bg-red-50 px-2 py-1 rounded-md tracking-wider">BLOQUEADO</span>}
        </td>
        {["u1", "u2", "u3", "u4"].map((u) => (
          <td key={u} className="px-3 py-4 text-center">
            {m.tipo === "Numerica" ? (
              <input type="number" value={m[u]} onChange={(e) => handleNotaChange(idA, m.id_materia, u, e.target.value)} disabled={!editable} className={`w-[70px] h-[45px] border-2 border-gray-100 rounded-xl text-center font-black outline-none focus:border-red-600 transition-all ${!editable ? "bg-gray-100/50 text-gray-400 cursor-not-allowed" : "bg-white"}`} />
            ) : (
              <select value={m[u]} onChange={(e) => handleNotaChange(idA, m.id_materia, u, e.target.value)} disabled={!editable} className={`w-full h-[45px] border-2 border-gray-100 rounded-xl text-[10px] font-black text-center outline-none focus:border-red-600 transition-all ${!editable ? "bg-gray-100/50 text-gray-400 cursor-not-allowed" : "bg-white"}`}>
                <option value="">-</option>
                {m.tipo === "Texto_Primaria" ? (
                  <><option value="DESTACA">Destaca</option><option value="AVANZA">Avanza</option><option value="NM">NM</option></>
                ) : (
                  <><option value="F">F</option><option value="A">A</option><option value="NM">NM</option></>
                )}
              </select>
            )}
          </td>
        ))}
      </tr>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <header className="bg-red-700 text-white shadow-lg p-6 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-xl font-black uppercase tracking-tight leading-none">
          Liceo Cristiano Zacapaneco
        </h1>
        <Link href="/notas" className="px-6 py-2 bg-white text-red-700 rounded-xl font-black text-xs uppercase shadow-md">
          Menú
        </Link>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 mb-10 flex flex-col md:flex-row items-end gap-6">
          
          {/* 💡 SELECTOR DE GRADO INTELIGENTE */}
          <div className="flex-1 w-full text-left">
            <label className="block text-gray-400 font-black mb-2 text-[10px] uppercase ml-1">
              Grado Académico
            </label>
            <select
              value={grado}
              onChange={(e) => {
                const nuevoGrado = e.target.value;
                setGrado(nuevoGrado);
                
                // Autoseleccionar la primera sección disponible
                const obj = NIVELES.flatMap(n => n.grados).find(g => g.id === nuevoGrado);
                if (obj && obj.secciones.length > 0) {
                  setSeccion(obj.secciones[0].id);
                } else {
                  setSeccion("");
                }
                setEstudiantesAgrupados([]);
              }}
              className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none font-black text-sm uppercase text-gray-700"
            >
              <option value="">Seleccionar...</option>
              {NIVELES.map((nivel) => (
                <optgroup key={nivel.nivel} label={nivel.nivel.toUpperCase()}>
                  {nivel.grados.map((g) => {
                    // Filtrado de seguridad: solo muestra los grados que el usuario tiene permitidos ver
                    if(puedeVerGrado(g.id)){
                       return <option key={g.id} value={g.id}>{g.nombre}</option>
                    }
                    return null;
                  })}
                </optgroup>
              ))}
            </select>
          </div>

          {/* 💡 SELECTOR DE SECCIÓN INTELIGENTE */}
          <div className="w-full md:w-48 text-left">
            <label className="block text-gray-400 font-black mb-2 text-[10px] uppercase ml-1">
              Sección
            </label>
            <select
              value={seccion}
              onChange={(e) => setSeccion(e.target.value)}
              disabled={!gradoSeleccionadoObj}
              className="w-full p-4 border-2 border-gray-100 rounded-2xl font-black text-sm bg-gray-50 disabled:opacity-50 outline-none text-gray-700"
            >
              {!gradoSeleccionadoObj && <option value="">-</option>}
              {gradoSeleccionadoObj?.secciones.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.label === 'Única' ? 'Única' : `Sección ${sec.label}`}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleCargarAlumnos}
            disabled={cargando}
            className="px-10 h-[58px] bg-red-600 text-white rounded-2xl font-black shadow-lg hover:bg-red-700 transition-all uppercase text-xs"
          >
            {cargando ? "Cargando..." : "Listar Alumnos"}
          </button>
        </div>

        {/* ... EL RESTO DEL CÓDIGO PERMANECE EXACTAMENTE IGUAL ... */}
        {estudiantesAgrupados.length > 0 && (
          <div className="sticky top-[85px] z-40 mb-8 px-2">
            <div className="bg-white/90 backdrop-blur-md border-2 border-red-600 shadow-[0_15px_30px_-10px_rgba(220,38,38,0.2)] rounded-3xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-4 ml-6">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                  <span className="text-red-600 text-lg">📝</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 font-black text-[9px] uppercase tracking-tighter">
                    Planilla Digital
                  </span>
                  <span className="text-slate-800 font-black text-sm uppercase">
                    {estudiantesAgrupados.length} Alumnos en lista
                  </span>
                </div>
              </div>
              <button
                onClick={handleGuardarNotas}
                disabled={guardando}
                className="mr-2 flex items-center gap-3 px-12 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                {guardando ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <span>Guardar Notas</span>
                )}
              </button>
            </div>
          </div>
        )}

        {estudiantesAgrupados.map((est, index) => {
          const estaAbierto = expandidos.includes(est.id_alumno);
          const esPreVisual = ["31", "32", "33", "4", "5", "1"].includes(est.id_grado.toString());
          return (
            <div key={index} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden mb-4">
              <div onClick={() => setExpandidos((prev) => prev.includes(est.id_alumno) ? prev.filter((i) => i !== est.id_alumno) : [...prev, est.id_alumno])} className="bg-red-50/30 p-6 flex justify-between items-center cursor-pointer transition-colors">
                <div className="flex items-center space-x-6">
                  <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black text-sm uppercase">
                    {est.nombre.substring(0, 2)}
                  </div>
                  <h4 className="font-black text-gray-800 text-lg uppercase tracking-tight">
                    {est.nombre}
                  </h4>
                </div>
                <span className={`transition-transform duration-300 font-black ${estaAbierto ? "rotate-180" : ""}`}>▼</span>
              </div>

              {estaAbierto && (
                <div className="p-4 overflow-x-auto bg-white border-t">
                  {permisos?.rol === "Admin" && (
                    <div className="flex justify-end gap-3 mb-4 flex-wrap">
                      {[1, 2, 3, 4].map((unidad) => {
                        const numerosRomanos = ["I", "II", "III", "IV"];
                        return (
                          <button key={unidad} onClick={() => { setUnidadAImprimir(unidad); setAlumnoParaImprimir(est); setTimeout(() => { handlePrint(); }, 300); }} className="bg-slate-800 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase hover:bg-red-600 transition-all shadow-sm">
                            🖨️ Imprimir {numerosRomanos[unidad - 1]} Unidad
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <table className="w-full">
                    <thead className="bg-gray-50/50 text-[9px] text-gray-400 uppercase font-black tracking-widest text-center border-b">
                      <tr>
                        <th className="px-10 py-4 text-left w-1/2">Áreas Curriculares / Aspectos</th>
                        <th>U I</th><th>U II</th><th>U III</th><th>U IV</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {esPreVisual ? (
                        <>
                          <tr className="bg-red-50/20 text-left"><td colSpan={5} className="px-10 py-4 font-black text-red-800 uppercase text-[10px]">Áreas Curriculares</td></tr>
                          {est.curriculares.map((m: any) => renderFilaMateria(m, est.id_alumno))}
                          <tr className="bg-yellow-50/20 text-left border-t-8 border-gray-50"><td colSpan={5} className="px-10 py-4 font-black text-yellow-600 uppercase text-[10px]">Aspectos de Evaluación</td></tr>
                          {est.aspectos.map((m: any) => renderFilaMateria(m, est.id_alumno))}
                        </>
                      ) : (
                        areasPrimaria.map((area) =>
                          est.bloques[area.id].length > 0 && (
                            <React.Fragment key={area.id}>
                              <tr><td colSpan={5} className="px-10 py-4 font-black text-slate-800 uppercase text-[10px] bg-slate-100 text-left border-t-4 border-white">{area.titulo}</td></tr>
                              {est.bloques[area.id].map((m: any) => renderFilaMateria(m, est.id_alumno))}
                              {area.id === 1 && (
                                <tr className="bg-red-50/50 font-black text-red-700 border-t-2 border-red-100">
                                  <td className="px-10 py-4 text-left text-[11px] uppercase italic">Promedio por Unidad</td>
                                  <td className="text-center py-4">{calcularPromedioUnidad(est.bloques[area.id], "u1")}</td>
                                  <td className="text-center py-4">{calcularPromedioUnidad(est.bloques[area.id], "u2")}</td>
                                  <td className="text-center py-4">{calcularPromedioUnidad(est.bloques[area.id], "u3")}</td>
                                  <td className="text-center py-4">{calcularPromedioUnidad(est.bloques[area.id], "u4")}</td>
                                </tr>
                              )}
                            </React.Fragment>
                          )
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </main>

      <div style={{ display: "none" }}>
        <div ref={componentRef}>
          {alumnoParaImprimir && (
            <>
              {grado === "1" && <BoletaPreparatoria alumno={alumnoParaImprimir} unidadActual={unidadAImprimir} seccion={seccion} />}
              {grado === "4" && <BoletaPreKinder alumno={alumnoParaImprimir} unidadActual={unidadAImprimir} seccion={seccion} />}
              {grado === "5" && <BoletaKinder alumno={alumnoParaImprimir} unidadActual={unidadAImprimir} seccion={seccion} />}
              {["31", "32", "33"].includes(grado) && <BoletaNursery alumno={alumnoParaImprimir} unidadActual={unidadAImprimir} seccion={seccion} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}