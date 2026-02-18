export const studentDashboardMock = {
  profile: {
    name: "Juan Perez",
    subtitle: "ID 20230104",
    initials: "JP"
  },
  profileDetails: {
    fullName: "Juan Sebastian Perez",
    studentId: "20230104",
    program: "Ingenieria de Sistemas",
    career: "Ingenieria de Sistemas",
    faculty: "Facultad de Ingenieria",
    semester: 6,
    advisor: "Dra. Lucia Herrera",
    email: "juan.perez@eduportal.edu",
    phone: "+57 315 000 1234"
  },
  stats: [
    { icon: "trending_up", label: "Promedio general", value: "8.4", change: "+0.2", changeTone: "positive" },
    { icon: "school", label: "Creditos aprobados", value: "142/180", change: "79%", changeTone: "neutral" },
    { icon: "menu_book", label: "Cursos en progreso", value: "4", change: "Activo", changeTone: "neutral" }
  ],
  assignments: [
    {
      id: "ING-402",
      title: "Calculo Multivariable",
      mode: "Sincronico",
      progress: 75,
      nextClass: "Manana 08:00"
    },
    {
      id: "CS-105",
      title: "Estructura de Datos",
      mode: "Virtual",
      progress: 42,
      nextClass: "Tarea pendiente hoy 23:59"
    },
    {
      id: "HUM-301",
      title: "Pensamiento Critico",
      mode: "Hibrido",
      progress: 61,
      nextClass: "Viernes 14:00"
    },
    {
      id: "ADM-205",
      title: "Gestion de Proyectos",
      mode: "Virtual",
      progress: 33,
      nextClass: "Domingo 10:00"
    }
  ],
  myCourses: {
    activeCourseCodes: ["CL-2026-001", "CL-2026-004"]
  },
  history: [
    { code: "MAT-101", subject: "Introduccion al Algebra", period: "2023-1", credits: 4, grade: 92, status: "Aprobado" },
    { code: "FIS-202", subject: "Fisica Mecanica", period: "2023-1", credits: 4, grade: 85, status: "Aprobado" },
    { code: "HUM-050", subject: "Etica y Sociedad", period: "2023-2", credits: 2, grade: 98, status: "Aprobado" },
    { code: "PROG-101", subject: "Logica de Programacion", period: "2023-2", credits: 3, grade: 88, status: "Aprobado" },
    { code: "MAT-220", subject: "Ecuaciones Diferenciales", period: "2024-1", credits: 4, grade: 84, status: "Aprobado" },
    { code: "EST-210", subject: "Estadistica Aplicada", period: "2024-1", credits: 3, grade: 90, status: "Aprobado" },
    { code: "ING-280", subject: "Ingles Tecnico", period: "2024-1", credits: 2, grade: 94, status: "Aprobado" },
    { code: "ARB-110", subject: "Analitica Basica", period: "2024-2", credits: 4, grade: 87, status: "Aprobado" },
    { code: "BD-201", subject: "Bases de Datos", period: "2024-2", credits: 3, grade: 91, status: "Aprobado" },
    { code: "SOF-310", subject: "Arquitectura de Software", period: "2025-1", credits: 4, grade: 89, status: "Aprobado" },
    { code: "RED-210", subject: "Redes II", period: "2025-1", credits: 3, grade: 86, status: "Aprobado" },
    { code: "IA-101", subject: "Fundamentos de IA", period: "2025-2", credits: 3, grade: 93, status: "Aprobado" }
  ],
  settings: [
    { key: "notificaciones", label: "Notificaciones de tareas", value: "Activo", description: "Recibir alertas por correo institucional." },
    { key: "boletin", label: "Resumen semanal", value: "Activo", description: "Enviar resumen de avances cada viernes." },
    { key: "privacidad", label: "Perfil publico", value: "Privado", description: "Solo docentes y coordinadores pueden ver tu perfil." },
    { key: "autenticacion", label: "Autenticacion de dos pasos", value: "Pendiente", description: "Aumenta la seguridad de tu cuenta." }
  ],
  alerts: [
    "Tienes una tarea pendiente en Estructura de Datos.",
    "Actualiza tu telefono de contacto antes del cierre de semestre.",
    "Recuerda solicitar monitoria antes del 30 de marzo."
  ]
};
