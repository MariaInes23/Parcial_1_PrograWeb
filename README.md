# HackUni — Sistema de gestión del Hackathon universitario

Aplicación web full-stack (backend + frontend en un mismo proyecto Next.js)
para administrar el **Evento de Innovación Tecnológica** de la universidad:
equipos participantes, mentores, desafíos, entregas de proyectos y
evaluaciones de los jueces.

> Este proyecto **no incluye el agente de IA** mencionado en el caso; esa
> parte queda fuera a propósito, tal como se solicitó.

---

## 1. Stack técnico

| Capa            | Tecnología                                                        |
|-----------------|---------------------------------------------------------------------|
| Framework       | [Next.js 16](https://nextjs.org) (App Router, TypeScript)          |
| Backend         | Server Actions de Next.js (mutaciones) + consultas SQL directas    |
| Base de datos   | SQLite embebida (`better-sqlite3`), archivo local, no requiere instalar un motor de BD aparte |
| Autenticación   | Cookie de sesión firmada con JWT (`jsonwebtoken`) + contraseñas con `bcryptjs` |
| Estilos         | Tailwind CSS v4, tema propio (sin dependencias externas de fuentes) |

Backend y frontend viven **en el mismo proyecto** y se levantan con un único
comando: `npm run dev`. No hay que correr un servidor de API por separado.

---

## 2. Requisitos previos

- Node.js 20 o superior
- npm (incluido con Node.js)

---

## 3. Instalación y ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. (Opcional) copiar el archivo de variables de entorno
cp .env.example .env.local
# Puedes cambiar SESSION_SECRET por cualquier cadena aleatoria propia

# 3. Levantar el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

Al iniciar por primera vez, la aplicación **crea automáticamente** el
archivo de base de datos en `data/hackathon.db` y lo llena con datos de
ejemplo (usuarios, equipos, desafíos), para que puedas probar el sistema
de inmediato sin configurar nada más.

Para generar una compilación de producción:

```bash
npm run build
npm start
```

---

## 4. Credenciales de prueba

| Rol      | Correo                              | Contraseña |
|----------|--------------------------------------|------------|
| Organizador (Admin) | admin@universidad.edu         | admin123   |
| Mentor   | ana.torres@universidad.edu          | mentor123  |
| Mentor   | luis.ramirez@universidad.edu        | mentor123  |
| Juez     | paola.sanchez@universidad.edu       | juez123    |
| Juez     | marco.diaz@universidad.edu          | juez123    |

También aparecen visibles en la propia pantalla de login.

Si quieres reiniciar los datos a su estado original, apaga el servidor,
borra la carpeta `data/` y vuelve a ejecutar `npm run dev`.

---

## 5. Roles y permisos

- **Organizador (ADMIN):** acceso total. Crea y administra equipos,
  mentores, jueces y desafíos; también puede registrar/editar entregas y
  ver todas las evaluaciones.
- **Mentor:** consulta equipos y desafíos, y puede registrar o editar
  entregas de los equipos que acompaña.
- **Juez:** ve las entregas, registra su propia evaluación por proyecto
  (innovación, calidad técnica, impacto y presentación, 1–10 cada una) y
  solo puede editar o eliminar sus propias evaluaciones.

Las rutas están protegidas por rol mediante un *proxy* (middleware) que
redirige a `/login` si no hay sesión, y a `/dashboard` si el rol no tiene
permiso sobre esa sección.

---

## 6. Funcionalidades incluidas

- **Equipos:** alta/edición/baja, asignación de mentor, gestión de
  integrantes (agregar/quitar), listado de entregas por equipo.
- **Mentores** y **Jueces:** alta/baja, especialidad/área de evaluación.
- **Desafíos:** alta/edición/baja, categoría y nivel de dificultad.
- **Entregas de proyectos:** registro por equipo y desafío, enlaces a
  repositorio y demo, estado (Enviada / En revisión / Evaluada /
  Descalificada).
- **Evaluaciones:** formulario de calificación por criterios para jueces,
  edición/eliminación de la propia evaluación, y panel de tabla de
  posiciones (*leaderboard*) con el puntaje promedio por proyecto.
- **Panel general:** contadores de cada entidad y top 5 del leaderboard.

---

## 7. Estructura del proyecto

```
src/
├── app/
│   ├── login/               → Página de inicio de sesión
│   ├── (app)/                → Rutas protegidas (requieren sesión)
│   │   ├── dashboard/
│   │   ├── equipos/          → Lista, alta, detalle (con integrantes)
│   │   ├── mentores/
│   │   ├── jueces/
│   │   ├── desafios/
│   │   ├── entregas/         → Lista, alta, detalle, edición
│   │   ├── evaluaciones/     → Lista, alta, edición
│   │   └── layout.tsx        → Verifica sesión + barra lateral
│   └── globals.css           → Tema visual (tokens de color/tipografía)
├── components/
│   └── Sidebar.tsx
├── lib/
│   ├── db.ts                 → Conexión SQLite + esquema + datos semilla
│   ├── auth.ts                → Sesión (JWT), hash de contraseñas
│   ├── queries.ts             → Consultas de lectura reutilizadas por las páginas
│   └── actions/                → Server Actions (backend): equipos, usuarios,
│                                  desafíos, entregas, evaluaciones, auth
└── proxy.ts                   → Middleware de autenticación/roles por ruta
```

---

## 8. Notas para extender el proyecto

- **Agente de IA:** el caso pide incorporar un agente de IA de apoyo para
  participantes y organizadores. Ese componente no está implementado aquí
  a propósito; puede añadirse como una ruta/API adicional (por ejemplo
  `src/app/api/asistente/route.ts`) que consuma un modelo de lenguaje,
  sin necesidad de tocar el resto del sistema.
- **Base de datos:** si en algún momento se prefiere migrar de SQLite a un
  motor cliente-servidor (PostgreSQL/MySQL), toda la lógica de acceso a
  datos está centralizada en `src/lib/db.ts` y `src/lib/queries.ts`, lo
  que facilita el cambio.
- **Participantes con inicio de sesión propio:** actualmente los
  integrantes de equipo son solo registros administrados por el
  organizador (nombre/correo/rol dentro del equipo), sin cuenta de acceso.
  Si se requiere que cada participante inicie sesión, se puede extender la
  tabla `users` con el rol `PARTICIPANTE` siguiendo el mismo patrón usado
  para mentores y jueces.
