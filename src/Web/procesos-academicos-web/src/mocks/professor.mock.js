export const professorDashboardMock = {
  profile: {
    name: "Prof. Alejandro R.",
    subtitle: "Ciencias Exactas",
    initials: "AR"
  },
  stats: [
    { icon: "check_circle", label: "Cursos activos", value: "4", change: "En curso", changeTone: "positive" },
    { icon: "pending_actions", label: "Notas pendientes", value: "12", change: "Alta", changeTone: "negative" },
    { icon: "person", label: "Estudiantes", value: "82", change: "Total", changeTone: "neutral" }
  ],
  classes: [
    {
      id: "A",
      status: "En curso",
      title: "Calculo Diferencial e Integral II",
      schedule: "Lun, Mie, Vie | 08:00 - 10:00",
      students: 32,
      progress: 85
    },
    {
      id: "B",
      status: "Pendiente",
      title: "Fisica Mecanica",
      schedule: "Mar, Jue | 10:00 - 12:00",
      students: 28,
      progress: 40
    },
    {
      id: "C",
      status: "Finalizado",
      title: "Metodos Numericos",
      schedule: "Sab | 07:00 - 11:00",
      students: 22,
      progress: 100
    },
    {
      id: "D",
      status: "En curso",
      title: "Algebra Lineal",
      schedule: "Lun, Mie | 14:00 - 16:00",
      students: 26,
      progress: 58
    },
    {
      id: "E",
      status: "En curso",
      title: "Programacion Cientifica",
      schedule: "Vie | 18:00 - 21:00",
      students: 18,
      progress: 73
    }
  ],
  schedule: [
    { day: "Lunes", hour: "08:00 - 10:00", className: "Calculo II", room: "Aula 304", modality: "Presencial" },
    { day: "Lunes", hour: "14:00 - 16:00", className: "Algebra Lineal", room: "Aula 112", modality: "Presencial" },
    { day: "Martes", hour: "10:00 - 12:00", className: "Fisica Mecanica", room: "Lab F-2", modality: "Hibrido" },
    { day: "Miercoles", hour: "08:00 - 10:00", className: "Calculo II", room: "Aula 304", modality: "Presencial" },
    { day: "Miercoles", hour: "14:00 - 16:00", className: "Algebra Lineal", room: "Aula 112", modality: "Presencial" },
    { day: "Jueves", hour: "10:00 - 12:00", className: "Fisica Mecanica", room: "Lab F-2", modality: "Hibrido" },
    { day: "Viernes", hour: "08:00 - 10:00", className: "Calculo II", room: "Aula 304", modality: "Presencial" },
    { day: "Viernes", hour: "18:00 - 21:00", className: "Programacion Cientifica", room: "Virtual", modality: "Virtual" },
    { day: "Sabado", hour: "07:00 - 11:00", className: "Metodos Numericos", room: "Aula 206", modality: "Presencial" }
  ],
  reportItems: [
    { id: "RPT-11", name: "Rendimiento parcial por grupo", period: "Semana 6", status: "Publicado", students: 82 },
    { id: "RPT-14", name: "Asistencia consolidada", period: "Semana 7", status: "Revision", students: 82 },
    { id: "RPT-16", name: "Alertas por bajo puntaje", period: "Corte 2", status: "Borrador", students: 18 },
    { id: "RPT-17", name: "Comparativo por seccion", period: "Corte 2", status: "Publicado", students: 54 },
    { id: "RPT-19", name: "Evolucion de notas", period: "Historico", status: "Revision", students: 82 },
    { id: "RPT-24", name: "Pendientes por cierre", period: "Semana 8", status: "Borrador", students: 12 }
  ],
  studentsRoster: [
    { id: "20230101", name: "Carolina Vega", course: "Calculo II", attendance: "94%", pending: 0, risk: "Bajo" },
    { id: "20230122", name: "Edwin Perdomo", course: "Fisica Mecanica", attendance: "71%", pending: 2, risk: "Medio" },
    { id: "20230134", name: "Natalia Rios", course: "Algebra Lineal", attendance: "88%", pending: 1, risk: "Bajo" },
    { id: "20230148", name: "Julian Arias", course: "Metodos Numericos", attendance: "62%", pending: 3, risk: "Alto" },
    { id: "20230156", name: "Tatiana Roa", course: "Programacion Cientifica", attendance: "91%", pending: 0, risk: "Bajo" },
    { id: "20230177", name: "Samuel Vanegas", course: "Fisica Mecanica", attendance: "76%", pending: 1, risk: "Medio" },
    { id: "20230189", name: "Maria Pulido", course: "Calculo II", attendance: "97%", pending: 0, risk: "Bajo" },
    { id: "20230205", name: "Felipe Cardenas", course: "Algebra Lineal", attendance: "69%", pending: 2, risk: "Alto" },
    { id: "20230219", name: "Valentina Ocampo", course: "Programacion Cientifica", attendance: "82%", pending: 1, risk: "Medio" }
  ],
  reminders: [
    "Fecha limite para cierre de cursos: 15 de junio.",
    "Publica notas finales con 48h de anticipacion.",
    "Actualiza el plan de evaluacion de la semana 10."
  ],
  activity: [
    "Notas publicadas en Calculo - Hoy 09:15",
    "Nuevo alumno inscrito en Fisica - Ayer",
    "Reporte mensual generado - 28 May"
  ]
};
