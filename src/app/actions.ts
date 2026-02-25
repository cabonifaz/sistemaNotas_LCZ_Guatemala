'use server';
import { ejecutarSP } from '../lib/db';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers'; 
import crypto from 'crypto'; // 💡 IMPORTACIÓN NATIVA PARA ENCRIPTAR (No requiere instalación)

export async function loginAction(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  let userLogged = null;
  let hasError = false;

  try {
    // 💡 LA MAGIA: Encriptamos la contraseña a SHA-256 para que el texto original no viaje a la BD
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    // Enviamos el hash al SP, no la contraseña real
    const usuarios: any = await ejecutarSP('sp_login_usuario', [username, hashedPassword]);
    
    if (usuarios && usuarios.length > 0) {
      userLogged = usuarios[0];
    }
  } catch (error) {
    console.error("Error de login:", error);
    hasError = true;
  }

  if (hasError) redirect('/?error=servidor');

  if (userLogged) {
    const sessionData = {
      id: userLogged.id_usuario,
      nombre: userLogged.nombre_completo,
      rol: userLogged.rol
    };

    const cookieStore = await cookies();
    cookieStore.set('user_session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 8, 
      path: '/',
    });

    redirect('/notas');
  } else {
    redirect('/?error=credenciales'); 
  }
}

export async function obtenerPermisosUsuario() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('user_session');
  
  if (!sessionCookie) return null;

  try {
    const user = JSON.parse(sessionCookie.value);
    
    // 💡 CORRECCIÓN: Ahora respetamos tanto al Admin como al Super usuario
    if (user.rol === 'Admin' || user.rol === 'Super usuario') {
      return { rol: user.rol, nombre: user.nombre, asignaciones: 'ALL' };
    }
    
    const asignaciones: any = await ejecutarSP('sp_obtener_permisos', [user.id]);
    return { rol: 'Maestro', nombre: user.nombre, asignaciones: asignaciones || [] };
  } catch (error) {
    return null;
  }
}

export async function logoutAction() {
  // 💡 APLICADO: await cookies() antes de usar .delete()
  const cookieStore = await cookies();
  cookieStore.delete('user_session');
  redirect('/');
}

export async function obtenerMatrizNotas(grado: number, seccion: number) {
  try {
    const datos: any = await ejecutarSP('SP_ALUMNOS_LST', [grado, seccion]);
    return datos || [];
  } catch (error) {
    return [];
  }
}

export async function guardarCalificacion(idEstudiante: number, idMateria: number, u1: string, u2: string, u3: string, u4: string) {
  try {
    await ejecutarSP('SP_NOTAS_INS', [idEstudiante, idMateria, u1, u2, u3, u4]);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function guardarCalificacionesMasivas(paqueteNotas: any[]) {
  try {
    // 1. Filtramos para asegurarnos de que no vayan datos vacíos
    const notasValidas = paqueteNotas.filter(n => n.idEstudiante && n.idMateria);
    let guardadas = 0;

    // 2. Definimos de a cuántas notas vamos a enviar al mismo tiempo (50 es muy seguro y rápido)
    const chunkSize = 50;

    for (let i = 0; i < notasValidas.length; i += chunkSize) {
      const chunk = notasValidas.slice(i, i + chunkSize);

      // 3. LA MAGIA: Ejecutamos 50 guardados EN PARALELO al mismo tiempo
      const promesas = chunk.map(nota => 
        ejecutarSP('SP_NOTAS_INS', [
          nota.idEstudiante, 
          nota.idMateria, 
          nota.u1 || '', 
          nota.u2 || '', 
          nota.u3 || '', 
          nota.u4 || ''
        ])
      );

      // Esperamos que estas 50 terminen juntas antes de seguir con las otras 50
      await Promise.all(promesas);
      guardadas += chunk.length;
    }

    return { success: true, guardadas, errores: 0 };
  } catch (error) {
    console.error("Error masivo guardando notas:", error);
    return { success: false };
  }
}

export async function inscribirEstudiante(nombres: string, apellidos: string, grado: number, seccion: number) {
  try {
    const prefijos: Record<string, string> = {
      '3': 'NUR', '4': 'PKD', '5': 'KIN', '1': 'PRE',
      '6': '1RO', '7': '2DO', '2': '3RO', '8': '4TO', '9': '5TO', '10': '6TO'
    };
    const prefijo = prefijos[grado.toString()] || 'EST';
    const numeroAleatorio = Math.floor(Math.random() * 900) + 100;
    const codigoGenerado = `${prefijo}-${numeroAleatorio}`;
    await ejecutarSP('SP_ALUMNOS_INS', [codigoGenerado, nombres, apellidos, grado, seccion]);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function obtenerEstadisticasDashboard() {
  try {
    const datos: any = await ejecutarSP('sp_dashboard_stats', []); 
    const res = datos && datos.length > 0 ? datos[0] : null;
    return {
      docentes: Number(res?.total_docentes || 0),
      estudiantes: Number(res?.total_estudiantes || 0),
      materias: Number(res?.total_materias || 0)
    };
  } catch (error) {
    return { docentes: 0, estudiantes: 0, materias: 0 };
  }
}

export async function obtenerMaestroTitular(grado: number, seccion: number) {
  try {
    const maestro: any = await ejecutarSP('sp_obtener_maestro_titular', [grado, seccion]);
    // Si encuentra al maestro, devuelve su nombre. Si no, devuelve el texto por defecto.
    return maestro && maestro.length > 0 ? maestro[0].nombre_completo : "Docente no asignado";
  } catch (error) {
    console.error("Error obteniendo maestro:", error);
    return "Docente no asignado";
  }
}

// ==========================================
// NUEVAS FUNCIONES PARA GESTIÓN DE DOCENTES
// ==========================================

export async function obtenerDocentes() {
  try {
    const datos: any = await ejecutarSP('sp_docentes_lst', []);
    return datos || [];
  } catch (error) {
    return [];
  }
}

export async function crearNuevoDocente(nombre: string, correo: string, pass: string, rol: string) {
  try {
    const hashedPassword = crypto.createHash('sha256').update(pass).digest('hex');
    // 💡 AHORA ENVIAMOS EL ROL AL PROCEDIMIENTO ALMACENADO
    await ejecutarSP('sp_docentes_ins', [nombre, correo, hashedPassword, rol]);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function obtenerAsignacionesDocente(id_usuario: number) {
  try {
    const datos: any = await ejecutarSP('sp_asignaciones_docente_lst', [id_usuario]);
    return datos || [];
  } catch (error) {
    return [];
  }
}

export async function agregarAsignacion(id_usuario: number, id_grado: number, seccion: number, id_materia: number) {
  try {
    await ejecutarSP('sp_asignaciones_ins', [id_usuario, id_grado, seccion, id_materia]);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function eliminarAsignacion(id_asignacion: number) {
  try {
    await ejecutarSP('sp_asignaciones_del', [id_asignacion]);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function obtenerGradosList() {
  try {
    const datos: any = await ejecutarSP('sp_grados_lst', []);
    return datos || [];
  } catch (error) {
    return [];
  }
}

export async function obtenerMateriasList() {
  try {
    const datos: any = await ejecutarSP('sp_materias_lst', []);
    return datos || [];
  } catch (error) {
    return [];
  }
}

export async function eliminarDocente(id_usuario: number) {
  try {
    await ejecutarSP('sp_docentes_del', [id_usuario]);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function obtenerConfiguracionBimestres(anio: number) {
  try {
    // Como solo es un simple SELECT, lo ejecutaremos directo como consulta cruda a través de tu DB (asumiendo que ejecutarSP puede recibir queries planas si no, creamos otro SP)
    // Pero lo ideal es usar ejecutarSP. Vamos a crear un SP para esto en el código de arriba.
    const rows: any = await ejecutarSP('sp_obtener_configuracion', [anio]);
    
    if (rows && rows.length > 0) {
      const config = rows[0];
      const activas: number[] = [];
      if (config.u1 === 1 || config.u1 === true) activas.push(1);
      if (config.u2 === 1 || config.u2 === true) activas.push(2);
      if (config.u3 === 1 || config.u3 === true) activas.push(3);
      if (config.u4 === 1 || config.u4 === true) activas.push(4);
      return activas;
    }
    return [1]; 
  } catch (error) {
    console.error("Error obteniendo config:", error);
    return [1];
  }
}

export async function guardarConfiguracionBimestres(anio: number, unidades: number[]) {
  try {
    const u1 = unidades.includes(1) ? 1 : 0;
    const u2 = unidades.includes(2) ? 1 : 0;
    const u3 = unidades.includes(3) ? 1 : 0;
    const u4 = unidades.includes(4) ? 1 : 0;

    // 💡 AHORA SÍ: Usamos tu función ejecutarSP para que no marque error
    await ejecutarSP('sp_guardar_configuracion', [anio, u1, u2, u3, u4]);
    return true;
  } catch (error) {
    console.error("Error guardando config:", error);
    return false;
  }
}

export async function obtenerConfiguracionActiva() {
  try {
    const rows: any = await ejecutarSP('sp_obtener_configuracion_activa', []);
    
    if (rows && rows.length > 0) {
      const config = rows[0];
      const activas: number[] = [];
      if (config.u1 === 1 || config.u1 === true) activas.push(1);
      if (config.u2 === 1 || config.u2 === true) activas.push(2);
      if (config.u3 === 1 || config.u3 === true) activas.push(3);
      if (config.u4 === 1 || config.u4 === true) activas.push(4);
      // 💡 AHORA DEVOLVEMOS TAMBIÉN EL AÑO ACTIVO
      return { anio: config.anio, activas }; 
    }
    return { anio: new Date().getFullYear(), activas: [1] }; 
  } catch (error) {
    console.error("Error obteniendo config:", error);
    return { anio: new Date().getFullYear(), activas: [1] };
  }
}

export async function obtenerConfiguracionPorAnio(anio: number) {
  try {
    const rows: any = await ejecutarSP('sp_obtener_configuracion', [anio]);
    
    if (rows && rows.length > 0) {
      const config = rows[0];
      const activas: number[] = [];
      if (config.u1 === 1 || config.u1 === true) activas.push(1);
      if (config.u2 === 1 || config.u2 === true) activas.push(2);
      if (config.u3 === 1 || config.u3 === true) activas.push(3);
      if (config.u4 === 1 || config.u4 === true) activas.push(4);
      return activas;
    }
    return []; // 💡 Si el año es nuevo y no existe, devuelve todo bloqueado
  } catch (error) {
    console.error("Error obteniendo config por año:", error);
    return [];
  }
}