export const PASSING_GRADE = 61;
export const CURRENT_TERM = "2026-1";

export const CURRENT_STUDENT_ID = "STU-20230104";
export const CURRENT_PROFESSOR_ID = "PROF-AR";

export const academicDomainMock = {
  careers: [
    { id: "CAR-SIS", code: "INGSIS", name: "Ingenieria de Sistemas", faculty: "Facultad de Ingenieria" },
    { id: "CAR-DER", code: "DER", name: "Derecho", faculty: "Facultad de Ciencias Sociales" },
    { id: "CAR-PSI", code: "PSI", name: "Psicologia", faculty: "Facultad de Salud" },
    { id: "CAR-ECO", code: "ECO", name: "Economia", faculty: "Facultad de Economia" },
    { id: "CAR-ADM", code: "ADM", name: "Administracion", faculty: "Facultad de Administracion" },
    { id: "CAR-MED", code: "MED", name: "Medicina", faculty: "Facultad de Medicina" }
  ],
  baseCourses: [
    { id: "CRS-MAT101", code: "MAT-101", name: "Introduccion al Algebra", department: "Ingenieria", credits: 4 },
    { id: "CRS-FIS202", code: "FIS-202", name: "Fisica Mecanica", department: "Ingenieria", credits: 4 },
    { id: "CRS-PROG101", code: "PROG-101", name: "Logica de Programacion", department: "Ingenieria", credits: 3 },
    { id: "CRS-EST210", code: "EST-210", name: "Estadistica Aplicada", department: "Ingenieria", credits: 3 },
    { id: "CRS-BD201", code: "BD-201", name: "Bases de Datos", department: "Ingenieria", credits: 3 },
    { id: "CRS-SOF310", code: "SOF-310", name: "Arquitectura de Software", department: "Ingenieria", credits: 4 },
    { id: "CRS-RED210", code: "RED-210", name: "Redes II", department: "Ingenieria", credits: 3 },
    { id: "CRS-RED310", code: "RED-310", name: "Redes Avanzadas", department: "Ingenieria", credits: 3 },
    { id: "CRS-IA101", code: "IA-101", name: "Fundamentos de IA", department: "Ingenieria", credits: 3 },
    { id: "CRS-SIS330", code: "SIS-330", name: "Arquitectura Empresarial", department: "Ingenieria", credits: 3 },
    { id: "CRS-SEG400", code: "SEG-400", name: "Seguridad de Aplicaciones", department: "Ingenieria", credits: 3 },
    { id: "CRS-BDD320", code: "BDD-320", name: "Bases de Datos Distribuidas", department: "Ingenieria", credits: 3 },
    { id: "CRS-GTI410", code: "GTI-410", name: "Gestion de Proyectos TI", department: "Ingenieria", credits: 3 },
    { id: "CRS-ANA350", code: "ANA-350", name: "Analitica de Datos", department: "Ingenieria", credits: 3 },
    { id: "CRS-CAL220", code: "CAL-220", name: "Calculo Integral", department: "Ingenieria", credits: 4 },
    { id: "CRS-ING280", code: "ING-280", name: "Ingles Tecnico", department: "Humanidades", credits: 2 },
    { id: "CRS-DER101", code: "DER-101", name: "Introduccion al Derecho", department: "Sociales", credits: 3 },
    { id: "CRS-DER220", code: "DER-220", name: "Derecho Penal", department: "Sociales", credits: 4 },
    { id: "CRS-DER310", code: "DER-310", name: "Derecho Constitucional II", department: "Sociales", credits: 4 },
    { id: "CRS-PSI101", code: "PSI-101", name: "Fundamentos de Psicologia", department: "Salud", credits: 3 },
    { id: "CRS-PSI201", code: "PSI-201", name: "Psicologia del Desarrollo", department: "Salud", credits: 3 },
    { id: "CRS-PSI320", code: "PSI-320", name: "Psicologia Social", department: "Salud", credits: 3 },
    { id: "CRS-ECO101", code: "ECO-101", name: "Introduccion a la Economia", department: "Economia", credits: 3 },
    { id: "CRS-ECO210", code: "ECO-210", name: "Microeconomia", department: "Economia", credits: 3 },
    { id: "CRS-ECO320", code: "ECO-320", name: "Economia Internacional", department: "Economia", credits: 3 },
    { id: "CRS-ADM101", code: "ADM-101", name: "Fundamentos de Administracion", department: "Administracion", credits: 3 },
    { id: "CRS-ADM220", code: "ADM-220", name: "Finanzas Corporativas", department: "Administracion", credits: 3 },
    { id: "CRS-ADM320", code: "ADM-320", name: "Planeacion Financiera", department: "Administracion", credits: 3 },
    { id: "CRS-MED101", code: "MED-101", name: "Anatomia", department: "Salud", credits: 4 },
    { id: "CRS-MED220", code: "MED-220", name: "Farmacologia", department: "Salud", credits: 4 },
    { id: "CRS-MED320", code: "MED-320", name: "Fisiologia Clinica", department: "Salud", credits: 4 }
  ],
  curriculumVersions: [
    { id: "CURR-SIS-2025", careerId: "CAR-SIS", versionCode: "INGSIS-2025", name: "Pensum Ingenieria 2025", cohortYear: 2025 },
    { id: "CURR-DER-2025", careerId: "CAR-DER", versionCode: "DER-2025", name: "Pensum Derecho 2025", cohortYear: 2025 },
    { id: "CURR-PSI-2025", careerId: "CAR-PSI", versionCode: "PSI-2025", name: "Pensum Psicologia 2025", cohortYear: 2025 },
    { id: "CURR-ECO-2025", careerId: "CAR-ECO", versionCode: "ECO-2025", name: "Pensum Economia 2025", cohortYear: 2025 },
    { id: "CURR-ADM-2025", careerId: "CAR-ADM", versionCode: "ADM-2025", name: "Pensum Administracion 2025", cohortYear: 2025 },
    { id: "CURR-MED-2025", careerId: "CAR-MED", versionCode: "MED-2025", name: "Pensum Medicina 2025", cohortYear: 2025 }
  ],
  curriculumCourses: [
    { curriculumVersionId: "CURR-SIS-2025", courseId: "CRS-MAT101", termNumber: 1 },
    { curriculumVersionId: "CURR-SIS-2025", courseId: "CRS-FIS202", termNumber: 1 },
    { curriculumVersionId: "CURR-SIS-2025", courseId: "CRS-PROG101", termNumber: 1 },
    { curriculumVersionId: "CURR-SIS-2025", courseId: "CRS-EST210", termNumber: 2 },
    { curriculumVersionId: "CURR-SIS-2025", courseId: "CRS-BD201", termNumber: 3 },
    { curriculumVersionId: "CURR-SIS-2025", courseId: "CRS-SOF310", termNumber: 4 },
    { curriculumVersionId: "CURR-SIS-2025", courseId: "CRS-RED310", termNumber: 4 },
    { curriculumVersionId: "CURR-SIS-2025", courseId: "CRS-IA101", termNumber: 5 },
    { curriculumVersionId: "CURR-SIS-2025", courseId: "CRS-SIS330", termNumber: 6 },
    { curriculumVersionId: "CURR-SIS-2025", courseId: "CRS-SEG400", termNumber: 6 },
    { curriculumVersionId: "CURR-SIS-2025", courseId: "CRS-BDD320", termNumber: 6 },
    { curriculumVersionId: "CURR-SIS-2025", courseId: "CRS-GTI410", termNumber: 7 },
    { curriculumVersionId: "CURR-SIS-2025", courseId: "CRS-ANA350", termNumber: 7 },

    { curriculumVersionId: "CURR-DER-2025", courseId: "CRS-DER101", termNumber: 1 },
    { curriculumVersionId: "CURR-DER-2025", courseId: "CRS-DER220", termNumber: 2 },
    { curriculumVersionId: "CURR-DER-2025", courseId: "CRS-DER310", termNumber: 3 },

    { curriculumVersionId: "CURR-PSI-2025", courseId: "CRS-PSI101", termNumber: 1 },
    { curriculumVersionId: "CURR-PSI-2025", courseId: "CRS-PSI201", termNumber: 2 },
    { curriculumVersionId: "CURR-PSI-2025", courseId: "CRS-PSI320", termNumber: 3 },

    { curriculumVersionId: "CURR-ECO-2025", courseId: "CRS-ECO101", termNumber: 1 },
    { curriculumVersionId: "CURR-ECO-2025", courseId: "CRS-ECO210", termNumber: 2 },
    { curriculumVersionId: "CURR-ECO-2025", courseId: "CRS-ECO320", termNumber: 3 },

    { curriculumVersionId: "CURR-ADM-2025", courseId: "CRS-ADM101", termNumber: 1 },
    { curriculumVersionId: "CURR-ADM-2025", courseId: "CRS-ADM220", termNumber: 2 },
    { curriculumVersionId: "CURR-ADM-2025", courseId: "CRS-ADM320", termNumber: 3 },

    { curriculumVersionId: "CURR-MED-2025", courseId: "CRS-MED101", termNumber: 1 },
    { curriculumVersionId: "CURR-MED-2025", courseId: "CRS-MED220", termNumber: 2 },
    { curriculumVersionId: "CURR-MED-2025", courseId: "CRS-MED320", termNumber: 3 }
  ],
  courseEquivalences: [
    {
      id: "EQ-RED-001",
      careerId: "CAR-SIS",
      sourceCourseId: "CRS-RED210",
      targetCourseId: "CRS-RED310",
      active: true
    }
  ],
  students: [
    {
      id: "STU-20230104",
      code: "20230104",
      fullName: "Juan Sebastian Perez",
      shortName: "Juan Perez",
      initials: "JP",
      careerId: "",
      faculty: "Facultad de Ingenieria",
      semester: 6,
      email: "juan.perez@eduportal.edu",
      phone: "+57 315 000 1234",
      historicalGrades: [92, 85, 88, 74, 91, 89, 58, 72, 93, 60, 66, 78]
    },
    { id: "STU-20230014", code: "20230014", fullName: "Sofia Perez", careerId: "CAR-SIS", semester: 6, historicalGrades: [94, 88, 91, 96, 89] },
    { id: "STU-20230017", code: "20230017", fullName: "Juan Mendez", careerId: "CAR-ECO", semester: 5, historicalGrades: [86, 79, 84, 88] },
    { id: "STU-20230038", code: "20230038", fullName: "Laura Castro", careerId: "CAR-MED", semester: 8, historicalGrades: [75, 83, 78, 81, 74] },
    { id: "STU-20230049", code: "20230049", fullName: "Diego Rios", careerId: "CAR-DER", semester: 4, historicalGrades: [80, 77, 85, 82] },
    { id: "STU-20230052", code: "20230052", fullName: "Angela Mora", careerId: "CAR-PSI", semester: 3, historicalGrades: [62, 70, 68, 65] },
    { id: "STU-20230061", code: "20230061", fullName: "Felipe Aguirre", careerId: "CAR-ECO", semester: 7, historicalGrades: [72, 76, 69, 74, 71] },
    { id: "STU-20230072", code: "20230072", fullName: "Natalia Garzon", careerId: "CAR-ADM", semester: 2, historicalGrades: [98, 92, 95, 90] },
    { id: "STU-20230088", code: "20230088", fullName: "Samuel Vera", careerId: "CAR-SIS", semester: 9, historicalGrades: [58, 64, 61, 55, 67] },
    { id: "STU-20230094", code: "20230094", fullName: "Maria Leon", careerId: "CAR-MED", semester: 1, historicalGrades: [84, 86, 82, 88] },
    { id: "STU-20230103", code: "20230103", fullName: "Andres Vivas", careerId: "CAR-SIS", semester: 6, historicalGrades: [73, 71, 76, 79] },
    { id: "STU-20230111", code: "20230111", fullName: "Diana Solis", careerId: "CAR-ADM", semester: 4, historicalGrades: [87, 89, 85, 90] },
    { id: "STU-20230125", code: "20230125", fullName: "Mateo Prieto", careerId: "CAR-ADM", semester: 7, historicalGrades: [66, 70, 64, 68] },

    { id: "STU-20230101", code: "20230101", fullName: "Carolina Vega", careerId: "CAR-SIS", semester: 5, historicalGrades: [86, 90, 80] },
    { id: "STU-20230122", code: "20230122", fullName: "Edwin Perdomo", careerId: "CAR-SIS", semester: 6, historicalGrades: [72, 64, 78] },
    { id: "STU-20230134", code: "20230134", fullName: "Natalia Rios", careerId: "CAR-SIS", semester: 5, historicalGrades: [90, 79, 82] },
    { id: "STU-20230148", code: "20230148", fullName: "Julian Arias", careerId: "CAR-SIS", semester: 4, historicalGrades: [0, 69, 74] },
    { id: "STU-20230156", code: "20230156", fullName: "Tatiana Roa", careerId: "CAR-SIS", semester: 4, historicalGrades: [0, 75, 68] },
    { id: "STU-20230177", code: "20230177", fullName: "Samuel Vanegas", careerId: "CAR-SIS", semester: 6, historicalGrades: [83, 77, 69] },
    { id: "STU-20230189", code: "20230189", fullName: "Maria Pulido", careerId: "CAR-SIS", semester: 6, historicalGrades: [95, 90, 87] },
    { id: "STU-20230205", code: "20230205", fullName: "Felipe Cardenas", careerId: "CAR-SIS", semester: 7, historicalGrades: [58, 70, 66] },
    { id: "STU-20230219", code: "20230219", fullName: "Valentina Ocampo", careerId: "CAR-SIS", semester: 7, historicalGrades: [91, 88, 84] }
  ],
  professors: [
    {
      id: "PROF-AR",
      code: "PR-040",
      fullName: "Prof. Alejandro R.",
      shortName: "Alejandro R.",
      initials: "AR",
      department: "Ciencias Exactas",
      speciality: "Ciencias Exactas"
    },
    { id: "PROF-HV", code: "PR-001", fullName: "Helena Vance", shortName: "Helena Vance", department: "Ciencias", speciality: "Fisica Aplicada" },
    { id: "PROF-RG", code: "PR-004", fullName: "Ricardo Gomez", shortName: "Ricardo Gomez", department: "Ingenieria", speciality: "Matematicas" },
    { id: "PROF-AM", code: "PR-008", fullName: "Ana Martinez", shortName: "Ana Martinez", department: "Estadistica", speciality: "Estadistica" },
    { id: "PROF-JL", code: "PR-013", fullName: "Javier Lopez", shortName: "Javier Lopez", department: "Ciencias", speciality: "Ciencias" },
    { id: "PROF-LM", code: "PR-017", fullName: "Laura Medina", shortName: "Laura Medina", department: "Psicologia", speciality: "Seguridad" },
    { id: "PROF-CR", code: "PR-022", fullName: "Camilo Rojas", shortName: "Camilo Rojas", department: "Economia", speciality: "Economia" },
    { id: "PROF-MN", code: "PR-024", fullName: "Marta Naranjo", shortName: "Marta Naranjo", department: "Humanidades", speciality: "Humanidades" },
    { id: "PROF-DP", code: "PR-029", fullName: "Diego Prieto", shortName: "Diego Prieto", department: "Ingenieria", speciality: "Software" },
    { id: "PROF-SB", code: "PR-033", fullName: "Sara Beltran", shortName: "Sara Beltran", department: "Administracion", speciality: "Finanzas" },
    { id: "PROF-NF", code: "PR-037", fullName: "Nicolas Fuentes", shortName: "Nicolas Fuentes", department: "Salud", speciality: "Salud" }
  ],
  courseOfferings: [
    {
      id: "OFF-2026-001",
      offeringCode: "CL-2026-001",
      courseId: "CRS-SOF310",
      careerId: "CAR-SIS",
      professorId: "PROF-AR",
      section: "A",
      term: "2026-1",
      status: "Activo",
      seatsTotal: 30,
      seatsTaken: 24
    },
    {
      id: "OFF-2026-002",
      offeringCode: "CL-2026-002",
      courseId: "CRS-BDD320",
      careerId: "CAR-SIS",
      professorId: "PROF-RG",
      section: "B",
      term: "2026-1",
      status: "Publicado",
      seatsTotal: 30,
      seatsTaken: 16
    },
    {
      id: "OFF-2026-003",
      offeringCode: "CL-2026-003",
      courseId: "CRS-RED310",
      careerId: "CAR-SIS",
      professorId: "PROF-AR",
      section: "C",
      term: "2026-1",
      status: "Publicado",
      seatsTotal: 28,
      seatsTaken: 18
    },
    {
      id: "OFF-2026-004",
      offeringCode: "CL-2026-004",
      courseId: "CRS-SEG400",
      careerId: "CAR-SIS",
      professorId: "PROF-AR",
      section: "A",
      term: "2026-1",
      status: "Activo",
      seatsTotal: 25,
      seatsTaken: 21
    },
    {
      id: "OFF-2026-005",
      offeringCode: "CL-2026-005",
      courseId: "CRS-DER310",
      careerId: "CAR-DER",
      professorId: "PROF-JL",
      section: "A",
      term: "2026-1",
      status: "Activo",
      seatsTotal: 30,
      seatsTaken: 22
    },
    {
      id: "OFF-2026-006",
      offeringCode: "CL-2026-006",
      courseId: "CRS-PSI320",
      careerId: "CAR-PSI",
      professorId: "PROF-LM",
      section: "B",
      term: "2026-1",
      status: "Publicado",
      seatsTotal: 30,
      seatsTaken: 11
    },
    {
      id: "OFF-2026-007",
      offeringCode: "CL-2026-007",
      courseId: "CRS-ECO320",
      careerId: "CAR-ECO",
      professorId: "PROF-CR",
      section: "A",
      term: "2026-1",
      status: "Activo",
      seatsTotal: 35,
      seatsTaken: 26
    },
    {
      id: "OFF-2026-008",
      offeringCode: "CL-2026-008",
      courseId: "CRS-ADM320",
      careerId: "CAR-ADM",
      professorId: "PROF-SB",
      section: "A",
      term: "2026-1",
      status: "Borrador",
      seatsTotal: 30,
      seatsTaken: 13
    },
    {
      id: "OFF-2026-009",
      offeringCode: "CL-2026-009",
      courseId: "CRS-MED320",
      careerId: "CAR-MED",
      professorId: "PROF-NF",
      section: "A",
      term: "2026-1",
      status: "Activo",
      seatsTotal: 22,
      seatsTaken: 20
    },
    {
      id: "OFF-2026-010",
      offeringCode: "CL-2026-010",
      courseId: "CRS-GTI410",
      careerId: "CAR-SIS",
      professorId: "PROF-DP",
      section: "D",
      term: "2026-1",
      status: "Borrador",
      seatsTotal: 25,
      seatsTaken: 0
    },
    {
      id: "OFF-2026-011",
      offeringCode: "CL-2026-011",
      courseId: "CRS-SIS330",
      careerId: "CAR-SIS",
      professorId: "PROF-AR",
      section: "E",
      term: "2026-1",
      status: "Cerrado",
      seatsTotal: 30,
      seatsTaken: 22
    },
    {
      id: "OFF-2026-012",
      offeringCode: "CL-2026-012",
      courseId: "CRS-ANA350",
      careerId: "CAR-SIS",
      professorId: "PROF-AM",
      section: "F",
      term: "2026-1",
      status: "Publicado",
      seatsTotal: 32,
      seatsTaken: 14
    },
    {
      id: "OFF-2026-013",
      offeringCode: "CL-2026-013",
      courseId: "CRS-PROG101",
      careerId: "CAR-SIS",
      professorId: "PROF-DP",
      section: "A",
      term: "2026-1",
      status: "Cerrado",
      seatsTotal: 30,
      seatsTaken: 30
    }
  ],
  enrollments: [
    { id: "ENR-001", studentId: "STU-20230101", offeringId: "OFF-2026-001", status: "Activa", enrolledAt: "2026-01-12" },
    { id: "ENR-002", studentId: "STU-20230122", offeringId: "OFF-2026-001", status: "Activa", enrolledAt: "2026-01-12" },
    { id: "ENR-003", studentId: "STU-20230134", offeringId: "OFF-2026-001", status: "Activa", enrolledAt: "2026-01-12" },

    { id: "ENR-004", studentId: "STU-20230122", offeringId: "OFF-2026-003", status: "Activa", enrolledAt: "2026-01-13" },
    { id: "ENR-005", studentId: "STU-20230148", offeringId: "OFF-2026-003", status: "Activa", enrolledAt: "2026-01-13" },
    { id: "ENR-006", studentId: "STU-20230156", offeringId: "OFF-2026-003", status: "Activa", enrolledAt: "2026-01-13" },

    { id: "ENR-007", studentId: "STU-20230134", offeringId: "OFF-2026-004", status: "Activa", enrolledAt: "2026-01-14" },
    { id: "ENR-008", studentId: "STU-20230177", offeringId: "OFF-2026-004", status: "Activa", enrolledAt: "2026-01-14" },
    { id: "ENR-009", studentId: "STU-20230189", offeringId: "OFF-2026-004", status: "Activa", enrolledAt: "2026-01-14" },

    { id: "ENR-010", studentId: "STU-20230205", offeringId: "OFF-2026-011", status: "Cerrada", enrolledAt: "2026-01-10" },
    { id: "ENR-011", studentId: "STU-20230219", offeringId: "OFF-2026-011", status: "Cerrada", enrolledAt: "2026-01-10" }
  ],
  studentCurriculumAssignments: [],
  gradeDrafts: {
    "OFF-2026-001": {
      "STU-20230101": 86,
      "STU-20230122": 72,
      "STU-20230134": 90
    },
    "OFF-2026-003": {
      "STU-20230122": 64,
      "STU-20230148": 0,
      "STU-20230156": 0
    },
    "OFF-2026-004": {
      "STU-20230134": 79,
      "STU-20230177": 83,
      "STU-20230189": 95
    },
    "OFF-2026-011": {
      "STU-20230205": 58,
      "STU-20230219": 91
    }
  },
  gradePublications: {
    "OFF-2026-004": {
      publishedAt: "2026-02-05",
      grades: {
        "STU-20230134": 79,
        "STU-20230177": 83,
        "STU-20230189": 95
      }
    },
    "OFF-2026-011": {
      publishedAt: "2026-02-01",
      grades: {
        "STU-20230205": 58,
        "STU-20230219": 91
      }
    }
  },
  academicRecords: [
    { id: "REC-001", studentId: "STU-20230104", courseId: "CRS-MAT101", offeringId: null, term: "2023-1", grade: 92 },
    { id: "REC-002", studentId: "STU-20230104", courseId: "CRS-FIS202", offeringId: null, term: "2023-1", grade: 85 },
    { id: "REC-003", studentId: "STU-20230104", courseId: "CRS-PROG101", offeringId: null, term: "2023-2", grade: 88 },
    { id: "REC-004", studentId: "STU-20230104", courseId: "CRS-EST210", offeringId: null, term: "2024-1", grade: 74 },
    { id: "REC-005", studentId: "STU-20230104", courseId: "CRS-BD201", offeringId: null, term: "2024-2", grade: 91 },
    { id: "REC-006", studentId: "STU-20230104", courseId: "CRS-SOF310", offeringId: null, term: "2025-1", grade: 89 },
    { id: "REC-007", studentId: "STU-20230104", courseId: "CRS-RED210", offeringId: null, term: "2025-1", grade: 58 },
    { id: "REC-008", studentId: "STU-20230104", courseId: "CRS-RED210", offeringId: null, term: "2025-2", grade: 72 },
    { id: "REC-009", studentId: "STU-20230104", courseId: "CRS-IA101", offeringId: null, term: "2025-2", grade: 93 },
    { id: "REC-010", studentId: "STU-20230104", courseId: "CRS-ING280", offeringId: null, term: "2025-2", grade: 60 },
    { id: "REC-011", studentId: "STU-20230104", courseId: "CRS-CAL220", offeringId: null, term: "2025-2", grade: 66 },
    { id: "REC-012", studentId: "STU-20230104", courseId: "CRS-SIS330", offeringId: null, term: "2025-2", grade: 78 },

    { id: "REC-013", studentId: "STU-20230205", courseId: "CRS-SIS330", offeringId: "OFF-2026-011", term: "2026-1", grade: 58 },
    { id: "REC-014", studentId: "STU-20230219", courseId: "CRS-SIS330", offeringId: "OFF-2026-011", term: "2026-1", grade: 91 }
  ],
  reportRequests: [
    {
      id: "SOL-001",
      studentId: "STU-20230014",
      studentName: "Sofia Perez",
      requestType: "Certificacion de cursos",
      requestedAt: "2026-02-10",
      issuedAt: "2026-02-12",
      downloadName: "certificacion-cursos-sol-001.txt"
    },
    {
      id: "SOL-002",
      studentId: "STU-20230017",
      studentName: "Juan Mendez",
      requestType: "Cierre de pensum",
      requestedAt: "2026-02-13",
      issuedAt: "2026-02-13",
      downloadName: "cierre-pensum-sol-002.txt"
    },
    {
      id: "SOL-003",
      studentId: "STU-20230038",
      studentName: "Laura Castro",
      requestType: "Certificacion de cursos",
      requestedAt: "2026-02-15",
      issuedAt: "2026-02-15",
      downloadName: "certificacion-cursos-sol-003.txt"
    }
  ],
  teacherAvailabilitySnapshots: [
    { professorId: "PROF-HV", status: "Libre" },
    { professorId: "PROF-RG", status: "En clase" },
    { professorId: "PROF-AM", status: "Ocupado" },
    { professorId: "PROF-JL", status: "Libre" }
  ],
  uiProfiles: {
    student: {
      name: "Juan Perez",
      subtitle: "ID 20230104",
      initials: "JP"
    },
    professor: {
      name: "Prof. Alejandro R.",
      subtitle: "Ciencias Exactas",
      initials: "AR"
    },
    director: {
      name: "Dr. Alberto Ruiz",
      subtitle: "Director Administrativo",
      initials: "AR"
    }
  }
};
