export const directorDashboardMock = {
  profile: {
    name: "Dr. Alberto Ruiz",
    subtitle: "Director Administrativo",
    initials: "AR"
  },
  stats: [
    { icon: "group", label: "Total alumnos", value: "1,250", change: "+2.5%", changeTone: "positive" },
    { icon: "co_present", label: "Profesores activos", value: "84", change: "-1.2%", changeTone: "negative" },
    { icon: "class", label: "Clases programadas", value: "42", change: "Estable", changeTone: "neutral" },
    { icon: "pie_chart", label: "Ocupacion total", value: "88%", change: "+5%", changeTone: "positive" }
  ],
  classes: [
    {
      id: "CL-2024-001",
      short: "M1",
      subject: "Matematicas Avanzadas I",
      room: "Aula 102",
      teacher: "Dra. Helena Vance",
      assigned: true,
      occupancy: "28/30",
      occupancyPercent: 93,
      schedule: "Lun - Mie, 08:00"
    },
    {
      id: "CL-2024-042",
      short: "H3",
      subject: "Historia Contemporanea",
      room: "Aula 204",
      teacher: "Sin asignar",
      assigned: false,
      occupancy: "12/25",
      occupancyPercent: 48,
      schedule: "Mar - Jue, 10:30"
    },
    {
      id: "CL-2024-015",
      short: "B2",
      subject: "Biologia Celular",
      room: "Laboratorio B",
      teacher: "Dr. Marcos G.",
      assigned: true,
      occupancy: "20/20",
      occupancyPercent: 100,
      schedule: "Viernes, 09:00"
    },
    {
      id: "CL-2024-020",
      short: "Q4",
      subject: "Quimica Organica",
      room: "Aula 311",
      teacher: "Dra. Sofia L.",
      assigned: true,
      occupancy: "19/25",
      occupancyPercent: 76,
      schedule: "Lun - Jue, 16:00"
    },
    {
      id: "CL-2024-033",
      short: "D6",
      subject: "Diseno de Sistemas",
      room: "Aula 201",
      teacher: "Sin asignar",
      assigned: false,
      occupancy: "10/30",
      occupancyPercent: 34,
      schedule: "Mie - Vie, 18:00"
    },
    {
      id: "CL-2024-054",
      short: "E7",
      subject: "Economia Aplicada",
      room: "Aula 118",
      teacher: "Dr. Javier R.",
      assigned: true,
      occupancy: "21/28",
      occupancyPercent: 75,
      schedule: "Martes, 07:00"
    },
    {
      id: "CL-2024-062",
      short: "P8",
      subject: "Psicologia Educativa",
      room: "Aula 402",
      teacher: "Dra. Laura M.",
      assigned: true,
      occupancy: "16/22",
      occupancyPercent: 72,
      schedule: "Jueves, 11:00"
    }
  ],
  coursesCatalog: [
    {
      code: "CL-2026-001",
      course: "Arquitectura de Software",
      department: "Ingenieria",
      career: "Ingenieria de Sistemas",
      section: "A",
      modality: "Presencial",
      seats: "20/30",
      professor: "Dra. Helena Vance",
      publicationStatus: "Publicado"
    },
    {
      code: "CL-2026-002",
      course: "Bases de Datos Distribuidas",
      department: "Ingenieria",
      career: "Ingenieria de Sistemas",
      section: "B",
      modality: "Hibrido",
      seats: "18/28",
      professor: "Dr. Ricardo Gomez",
      publicationStatus: "Borrador"
    },
    {
      code: "CL-2026-003",
      course: "Redes Avanzadas",
      department: "Ingenieria",
      career: "Ingenieria de Sistemas",
      section: "C",
      modality: "Virtual",
      seats: "27/30",
      professor: "Ing. Natalia Cardenas",
      publicationStatus: "Publicado"
    },
    {
      code: "CL-2026-004",
      course: "Seguridad de Aplicaciones",
      department: "Ingenieria",
      career: "Ingenieria de Sistemas",
      section: "A",
      modality: "Presencial",
      seats: "15/25",
      professor: "MSc. Laura Medina",
      publicationStatus: "Publicado"
    },
    {
      code: "CL-2026-005",
      course: "Derecho Constitucional II",
      department: "Sociales",
      career: "Derecho",
      section: "A",
      modality: "Presencial",
      seats: "22/30",
      professor: "Dr. Luis Herrera",
      publicationStatus: "Publicado"
    },
    {
      code: "CL-2026-006",
      course: "Psicologia Social",
      department: "Salud",
      career: "Psicologia",
      section: "B",
      modality: "Hibrido",
      seats: "24/30",
      professor: "Dra. Carolina Franco",
      publicationStatus: "Borrador"
    },
    {
      code: "CL-2026-007",
      course: "Economia Internacional",
      department: "Economia",
      career: "Economia",
      section: "A",
      modality: "Virtual",
      seats: "26/35",
      professor: "Dr. Javier R.",
      publicationStatus: "Publicado"
    },
    {
      code: "CL-2026-008",
      course: "Planeacion Financiera",
      department: "Administracion",
      career: "Administracion",
      section: "A",
      modality: "Presencial",
      seats: "19/30",
      professor: "Mg. Andres Solis",
      publicationStatus: "Borrador"
    },
    {
      code: "CL-2026-009",
      course: "Fisiologia Clinica",
      department: "Salud",
      career: "Medicina",
      section: "A",
      modality: "Laboratorio",
      seats: "16/22",
      professor: "Dra. Maria Leon",
      publicationStatus: "Publicado"
    },
    {
      code: "CL-2026-010",
      course: "Gestion de Proyectos TI",
      department: "Ingenieria",
      career: "Ingenieria de Sistemas",
      section: "D",
      modality: "Hibrido",
      seats: "18/25",
      professor: "Ing. Samuel Vera",
      publicationStatus: "Borrador"
    },
    {
      code: "CL-2026-011",
      course: "Arquitectura Empresarial",
      department: "Ingenieria",
      career: "Ingenieria de Sistemas",
      section: "E",
      modality: "Presencial",
      seats: "21/30",
      professor: "Dra. Laura M.",
      publicationStatus: "Publicado"
    },
    {
      code: "CL-2026-012",
      course: "Analitica de Datos",
      department: "Ingenieria",
      career: "Ingenieria de Sistemas",
      section: "F",
      modality: "Virtual",
      seats: "23/32",
      professor: "Dr. Marcos G.",
      publicationStatus: "Borrador"
    }
  ],
  professorsRegistry: [
    { id: "PR-001", name: "Helena Vance", department: "Ciencias", load: "4/5", status: "Disponible" },
    { id: "PR-004", name: "Ricardo Gomez", department: "Ingenieria", load: "5/5", status: "Carga alta" },
    { id: "PR-008", name: "Ana Martinez", department: "Estadistica", load: "3/5", status: "Disponible" },
    { id: "PR-013", name: "Javier Lopez", department: "Ciencias", load: "4/5", status: "En clase" },
    { id: "PR-017", name: "Laura Medina", department: "Psicologia", load: "2/5", status: "Disponible" },
    { id: "PR-022", name: "Camilo Rojas", department: "Economia", load: "5/5", status: "Carga alta" },
    { id: "PR-024", name: "Marta Naranjo", department: "Humanidades", load: "3/5", status: "Disponible" },
    { id: "PR-029", name: "Diego Prieto", department: "Ingenieria", load: "4/5", status: "En clase" },
    { id: "PR-033", name: "Sara Beltran", department: "Administracion", load: "2/5", status: "Disponible" },
    { id: "PR-037", name: "Nicolas Fuentes", department: "Salud", load: "5/5", status: "Carga alta" }
  ],
  studentsRegistry: [
    { id: "20230014", name: "Sofia Perez", program: "Ingenieria", semester: 6, gpa: 4.4, risk: "Bajo" },
    { id: "20230017", name: "Juan Mendez", program: "Arquitectura", semester: 5, gpa: 4.1, risk: "Bajo" },
    { id: "20230038", name: "Laura Castro", program: "Medicina", semester: 8, gpa: 3.9, risk: "Medio" },
    { id: "20230049", name: "Diego Rios", program: "Derecho", semester: 4, gpa: 4.0, risk: "Bajo" },
    { id: "20230052", name: "Angela Mora", program: "Psicologia", semester: 3, gpa: 3.2, risk: "Alto" },
    { id: "20230061", name: "Felipe Aguirre", program: "Economia", semester: 7, gpa: 3.6, risk: "Medio" },
    { id: "20230072", name: "Natalia Garzon", program: "Administracion", semester: 2, gpa: 4.5, risk: "Bajo" },
    { id: "20230088", name: "Samuel Vera", program: "Ingenieria", semester: 9, gpa: 3.1, risk: "Alto" },
    { id: "20230094", name: "Maria Leon", program: "Biologia", semester: 1, gpa: 4.2, risk: "Bajo" },
    { id: "20230103", name: "Andres Vivas", program: "Matematicas", semester: 6, gpa: 3.7, risk: "Medio" },
    { id: "20230111", name: "Diana Solis", program: "Trabajo Social", semester: 4, gpa: 4.3, risk: "Bajo" },
    { id: "20230125", name: "Mateo Prieto", program: "Contaduria", semester: 7, gpa: 3.4, risk: "Medio" }
  ],
  reportsRegistry: [
    { id: "REP-001", name: "Ocupacion por Facultad", period: "2026-1", owner: "Planeacion", status: "Publicado" },
    { id: "REP-004", name: "Desercion por Programa", period: "2026-1", owner: "Bienestar", status: "Revision" },
    { id: "REP-007", name: "Carga Docente", period: "2026-1", owner: "Coordinacion", status: "Publicado" },
    { id: "REP-009", name: "Asistencia semanal", period: "Semana 07", owner: "Analitica", status: "Borrador" },
    { id: "REP-012", name: "Riesgo academico", period: "2026-1", owner: "Consejeria", status: "Revision" },
    { id: "REP-015", name: "Rendimiento por curso", period: "2026-1", owner: "Decanaturas", status: "Publicado" },
    { id: "REP-019", name: "Estado de cupos", period: "2026-1", owner: "Registro", status: "Publicado" },
    { id: "REP-021", name: "Tendencia matrículas", period: "Historico", owner: "Planeacion", status: "Borrador" }
  ],
  teacherAvailability: [
    { initials: "HV", name: "Helena Vance", speciality: "Fisica Aplicada", status: "Libre" },
    { initials: "RG", name: "Ricardo Gomez", speciality: "Matematicas", status: "En clase" },
    { initials: "AM", name: "Ana Martinez", speciality: "Estadistica", status: "Ocupado" },
    { initials: "JL", name: "Javier Lopez", speciality: "Ciencias", status: "Libre" }
  ],
  enrollmentOverview: [
    { icon: "person_add", label: "Nuevos inscritos", value: "128", progress: 65, tone: "sky" },
    { icon: "check_circle", label: "Asistencia promedio", value: "96%", progress: 96, tone: "emerald" },
    { icon: "warning", label: "Riesgo academico", value: "15", progress: 15, tone: "rose" }
  ],
  recentEnrollments: [
    { initials: "SP", name: "Sofia Perez", program: "Ingenieria" },
    { initials: "JM", name: "Juan Mendez", program: "Arquitectura" },
    { initials: "LC", name: "Laura Castro", program: "Medicina" },
    { initials: "DR", name: "Diego Rios", program: "Derecho" }
  ],
  teachers: [
    { id: "hv", name: "Helena Vance", speciality: "Doctorado en Fisica Aplicada", status: "Disponible" },
    { id: "rg", name: "Ricardo Gomez", speciality: "Ingenieria Matematica", status: "Disponible" },
    { id: "am", name: "Ana Martinez", speciality: "Especialista en Estadistica", status: "Carga alta" },
    { id: "jl", name: "Javier Lopez", speciality: "Ciencias", status: "Disponible" }
  ]
};
