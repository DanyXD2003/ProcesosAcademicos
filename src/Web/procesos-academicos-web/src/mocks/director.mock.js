export const directorDashboardMock = {
  profile: {
    name: "Dr. Alberto Ruiz",
    subtitle: "Director Administrativo",
    initials: "AR"
  },
  coursesCatalog: [
    {
      code: "CL-2026-001",
      course: "Arquitectura de Software",
      department: "Ingenieria",
      career: "Ingenieria de Sistemas",
      section: "A",
      seats: "24/30",
      professor: "Dra. Helena Vance",
      publicationStatus: "Activo"
    },
    {
      code: "CL-2026-002",
      course: "Bases de Datos Distribuidas",
      department: "Ingenieria",
      career: "Ingenieria de Sistemas",
      section: "B",
      seats: "16/30",
      professor: "Dr. Ricardo Gomez",
      publicationStatus: "Publicado"
    },
    {
      code: "CL-2026-003",
      course: "Redes Avanzadas",
      department: "Ingenieria",
      career: "Ingenieria de Sistemas",
      section: "C",
      seats: "18/28",
      professor: "Ing. Natalia Cardenas",
      publicationStatus: "Publicado"
    },
    {
      code: "CL-2026-004",
      course: "Seguridad de Aplicaciones",
      department: "Ingenieria",
      career: "Ingenieria de Sistemas",
      section: "A",
      seats: "21/25",
      professor: "MSc. Laura Medina",
      publicationStatus: "Activo"
    },
    {
      code: "CL-2026-005",
      course: "Derecho Constitucional II",
      department: "Sociales",
      career: "Derecho",
      section: "A",
      seats: "22/30",
      professor: "Dr. Luis Herrera",
      publicationStatus: "Activo"
    },
    {
      code: "CL-2026-006",
      course: "Psicologia Social",
      department: "Salud",
      career: "Psicologia",
      section: "B",
      seats: "11/30",
      professor: "Dra. Carolina Franco",
      publicationStatus: "Publicado"
    },
    {
      code: "CL-2026-007",
      course: "Economia Internacional",
      department: "Economia",
      career: "Economia",
      section: "A",
      seats: "26/35",
      professor: "Dr. Javier R.",
      publicationStatus: "Activo"
    },
    {
      code: "CL-2026-008",
      course: "Planeacion Financiera",
      department: "Administracion",
      career: "Administracion",
      section: "A",
      seats: "13/30",
      professor: "Mg. Andres Solis",
      publicationStatus: "Borrador"
    },
    {
      code: "CL-2026-009",
      course: "Fisiologia Clinica",
      department: "Salud",
      career: "Medicina",
      section: "A",
      seats: "20/22",
      professor: "Dra. Maria Leon",
      publicationStatus: "Activo"
    },
    {
      code: "CL-2026-010",
      course: "Gestion de Proyectos TI",
      department: "Ingenieria",
      career: "Ingenieria de Sistemas",
      section: "D",
      seats: "0/25",
      professor: "Ing. Samuel Vera",
      publicationStatus: "Borrador"
    },
    {
      code: "CL-2026-011",
      course: "Arquitectura Empresarial",
      department: "Ingenieria",
      career: "Ingenieria de Sistemas",
      section: "E",
      seats: "22/30",
      professor: "Dra. Laura M.",
      publicationStatus: "Activo"
    },
    {
      code: "CL-2026-012",
      course: "Analitica de Datos",
      department: "Ingenieria",
      career: "Ingenieria de Sistemas",
      section: "F",
      seats: "14/32",
      professor: "Dr. Marcos G.",
      publicationStatus: "Publicado"
    },
    {
      code: "CL-2026-013",
      course: "Metodologia de Investigacion",
      department: "Ingenieria",
      career: "Ingenieria de Sistemas",
      section: "A",
      seats: "30/30",
      professor: "Ing. David Castro",
      publicationStatus: "Cerrado"
    }
  ],
  professorsRegistry: [
    { id: "PR-001", name: "Helena Vance", department: "Ciencias", load: 4 },
    { id: "PR-004", name: "Ricardo Gomez", department: "Ingenieria", load: 5 },
    { id: "PR-008", name: "Ana Martinez", department: "Estadistica", load: 3 },
    { id: "PR-013", name: "Javier Lopez", department: "Ciencias", load: 4 },
    { id: "PR-017", name: "Laura Medina", department: "Psicologia", load: 2 },
    { id: "PR-022", name: "Camilo Rojas", department: "Economia", load: 5 },
    { id: "PR-024", name: "Marta Naranjo", department: "Humanidades", load: 3 },
    { id: "PR-029", name: "Diego Prieto", department: "Ingenieria", load: 4 },
    { id: "PR-033", name: "Sara Beltran", department: "Administracion", load: 2 },
    { id: "PR-037", name: "Nicolas Fuentes", department: "Salud", load: 5 }
  ],
  studentsRegistry: [
    { id: "20230014", name: "Sofia Perez", program: "Ingenieria", semester: 6, courseGrades: [94, 88, 91, 96, 89] },
    { id: "20230017", name: "Juan Mendez", program: "Arquitectura", semester: 5, courseGrades: [86, 79, 84, 88] },
    { id: "20230038", name: "Laura Castro", program: "Medicina", semester: 8, courseGrades: [75, 83, 78, 81, 74] },
    { id: "20230049", name: "Diego Rios", program: "Derecho", semester: 4, courseGrades: [80, 77, 85, 82] },
    { id: "20230052", name: "Angela Mora", program: "Psicologia", semester: 3, courseGrades: [62, 70, 68, 65] },
    { id: "20230061", name: "Felipe Aguirre", program: "Economia", semester: 7, courseGrades: [72, 76, 69, 74, 71] },
    { id: "20230072", name: "Natalia Garzon", program: "Administracion", semester: 2, courseGrades: [98, 92, 95, 90] },
    { id: "20230088", name: "Samuel Vera", program: "Ingenieria", semester: 9, courseGrades: [58, 64, 61, 55, 67] },
    { id: "20230094", name: "Maria Leon", program: "Biologia", semester: 1, courseGrades: [84, 86, 82, 88] },
    { id: "20230103", name: "Andres Vivas", program: "Matematicas", semester: 6, courseGrades: [73, 71, 76, 79] },
    { id: "20230111", name: "Diana Solis", program: "Trabajo Social", semester: 4, courseGrades: [87, 89, 85, 90] },
    { id: "20230125", name: "Mateo Prieto", program: "Contaduria", semester: 7, courseGrades: [66, 70, 64, 68] }
  ],
  reportRequests: [
    {
      id: "SOL-001",
      studentName: "Sofia Perez",
      requestType: "Certificacion de cursos",
      requestedAt: "2026-02-10",
      status: "Generado",
      issuedAt: "2026-02-12",
      downloadName: "certificacion-sol-001.pdf"
    },
    {
      id: "SOL-002",
      studentName: "Juan Mendez",
      requestType: "Cierre de pensum",
      requestedAt: "2026-02-13",
      status: "En proceso",
      issuedAt: "",
      downloadName: ""
    },
    {
      id: "SOL-003",
      studentName: "Laura Castro",
      requestType: "Certificacion de cursos",
      requestedAt: "2026-02-15",
      status: "Solicitado",
      issuedAt: "",
      downloadName: ""
    }
  ],
  teacherAvailability: [
    { initials: "HV", name: "Helena Vance", speciality: "Fisica Aplicada", status: "Libre" },
    { initials: "RG", name: "Ricardo Gomez", speciality: "Matematicas", status: "En clase" },
    { initials: "AM", name: "Ana Martinez", speciality: "Estadistica", status: "Ocupado" },
    { initials: "JL", name: "Javier Lopez", speciality: "Ciencias", status: "Libre" }
  ],
  teachers: [
    { id: "hv", name: "Helena Vance", speciality: "Doctorado en Fisica Aplicada", status: "Disponible" },
    { id: "rg", name: "Ricardo Gomez", speciality: "Ingenieria Matematica", status: "Disponible" },
    { id: "am", name: "Ana Martinez", speciality: "Especialista en Estadistica", status: "Carga alta" },
    { id: "jl", name: "Javier Lopez", speciality: "Ciencias", status: "Disponible" }
  ]
};
