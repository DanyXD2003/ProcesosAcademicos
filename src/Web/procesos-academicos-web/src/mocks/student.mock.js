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
    career: "",
    faculty: "Facultad de Ingenieria",
    semester: 6,
    email: "juan.perez@eduportal.edu",
    phone: "+57 315 000 1234"
  },
  myCourses: {
    activeCourseCodes: []
  },
  history: [
    { code: "MAT-101", subject: "Introduccion al Algebra", period: "2023-1", credits: 4, grade: 92, status: "Aprobado" },
    { code: "FIS-202", subject: "Fisica Mecanica", period: "2023-1", credits: 4, grade: 85, status: "Aprobado" },
    { code: "PROG-101", subject: "Logica de Programacion", period: "2023-2", credits: 3, grade: 88, status: "Aprobado" },
    { code: "EST-210", subject: "Estadistica Aplicada", period: "2024-1", credits: 3, grade: 74, status: "Aprobado" },
    { code: "ARB-110", subject: "Analitica Basica", period: "2024-2", credits: 4, grade: 87, status: "Aprobado" },
    { code: "BD-201", subject: "Bases de Datos", period: "2024-2", credits: 3, grade: 91, status: "Aprobado" },
    { code: "SOF-310", subject: "Arquitectura de Software", period: "2025-1", credits: 4, grade: 89, status: "Aprobado" },
    { code: "RED-210", subject: "Redes II", period: "2025-1", credits: 3, grade: 58, status: "Reprobado" },
    { code: "IA-101", subject: "Fundamentos de IA", period: "2025-2", credits: 3, grade: 93, status: "Aprobado" },
    { code: "ING-280", subject: "Ingles Tecnico", period: "2025-2", credits: 2, grade: 60, status: "Reprobado" },
    { code: "CAL-220", subject: "Calculo Integral", period: "2025-2", credits: 4, grade: 66, status: "Aprobado" },
    { code: "SIS-330", subject: "Arquitectura Empresarial", period: "2025-2", credits: 3, grade: 78, status: "Aprobado" }
  ],
  curriculumByCareer: {
    "Ingenieria de Sistemas": [
      { code: "MAT-101", subject: "Introduccion al Algebra" },
      { code: "FIS-202", subject: "Fisica Mecanica" },
      { code: "PROG-101", subject: "Logica de Programacion" },
      { code: "EST-210", subject: "Estadistica Aplicada" },
      { code: "ARB-110", subject: "Analitica Basica" },
      { code: "BD-201", subject: "Bases de Datos" },
      { code: "SOF-310", subject: "Arquitectura de Software" },
      { code: "RED-210", subject: "Redes II" },
      { code: "IA-101", subject: "Fundamentos de IA" },
      { code: "SIS-330", subject: "Arquitectura Empresarial" },
      { code: "CL-2026-001", subject: "Arquitectura de Software" },
      { code: "CL-2026-002", subject: "Bases de Datos Distribuidas" },
      { code: "CL-2026-003", subject: "Redes Avanzadas" },
      { code: "CL-2026-004", subject: "Seguridad de Aplicaciones" },
      { code: "CL-2026-010", subject: "Gestion de Proyectos TI" },
      { code: "CL-2026-011", subject: "Arquitectura Empresarial" },
      { code: "CL-2026-012", subject: "Analitica de Datos" }
    ],
    Derecho: [
      { code: "DER-101", subject: "Introduccion al Derecho" },
      { code: "DER-220", subject: "Derecho Penal" },
      { code: "CL-2026-005", subject: "Derecho Constitucional II" }
    ],
    Psicologia: [
      { code: "PSI-101", subject: "Fundamentos de Psicologia" },
      { code: "PSI-201", subject: "Psicologia del Desarrollo" },
      { code: "CL-2026-006", subject: "Psicologia Social" }
    ],
    Economia: [
      { code: "ECO-101", subject: "Introduccion a la Economia" },
      { code: "ECO-210", subject: "Microeconomia" },
      { code: "CL-2026-007", subject: "Economia Internacional" }
    ],
    Administracion: [
      { code: "ADM-101", subject: "Fundamentos de Administracion" },
      { code: "ADM-220", subject: "Finanzas Corporativas" },
      { code: "CL-2026-008", subject: "Planeacion Financiera" }
    ],
    Medicina: [
      { code: "MED-101", subject: "Anatomia" },
      { code: "MED-220", subject: "Farmacologia" },
      { code: "CL-2026-009", subject: "Fisiologia Clinica" }
    ]
  }
};
