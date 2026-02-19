'use server';
import { ejecutarSP } from '../lib/db';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers'; 

export async function loginAction(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  let userLogged = null;
  let hasError = false;

  try {
    const usuarios: any = await ejecutarSP('sp_login_usuario', [username, password]);
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

    // 💡 APLICADO: await cookies() antes de usar .set()
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
  // 💡 APLICADO: await cookies() antes de usar .get()
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('user_session');
  
  if (!sessionCookie) return null;

  try {
    const user = JSON.parse(sessionCookie.value);
    if (user.rol === 'Admin') {
      return { rol: 'Admin', nombre: user.nombre, asignaciones: 'ALL' };
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
  let guardadas = 0;
  let errores = 0;
  try {
    for (const nota of paqueteNotas) {
      if (nota.idEstudiante && nota.idMateria) {
        try {
          await ejecutarSP('SP_NOTAS_INS', [nota.idEstudiante, nota.idMateria, nota.u1 || '', nota.u2 || '', nota.u3 || '', nota.u4 || '']);
          guardadas++;
        } catch (err) {
          errores++;
        }
      }
    }
    return { success: true, guardadas, errores };
  } catch (error) {
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