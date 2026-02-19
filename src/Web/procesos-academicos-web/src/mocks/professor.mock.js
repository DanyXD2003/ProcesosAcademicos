export const professorDashboardMock = {
  profile: {
    name: "Prof. Alejandro R.",
    subtitle: "Ciencias Exactas",
    initials: "AR"
  },
  classes: [
    {
      id: "A",
      code: "CL-2026-001",
      status: "Activo",
      title: "Arquitectura de Software",
      students: 3,
      gradesPublished: false
    },
    {
      id: "B",
      code: "CL-2026-003",
      status: "Publicado",
      title: "Redes Avanzadas",
      students: 3,
      gradesPublished: false
    },
    {
      id: "C",
      code: "CL-2026-004",
      status: "Activo",
      title: "Seguridad de Aplicaciones",
      students: 3,
      gradesPublished: true
    },
    {
      id: "D",
      code: "CL-2026-011",
      status: "Cerrado",
      title: "Arquitectura Empresarial",
      students: 2,
      gradesPublished: true
    }
  ],
  classStudents: {
    A: [
      { id: "20230101", name: "Carolina Vega", career: "Ingenieria de Sistemas" },
      { id: "20230122", name: "Edwin Perdomo", career: "Ingenieria de Sistemas" },
      { id: "20230134", name: "Natalia Rios", career: "Ingenieria de Sistemas" }
    ],
    B: [
      { id: "20230122", name: "Edwin Perdomo", career: "Ingenieria de Sistemas" },
      { id: "20230148", name: "Julian Arias", career: "Ingenieria de Sistemas" },
      { id: "20230156", name: "Tatiana Roa", career: "Ingenieria de Sistemas" }
    ],
    C: [
      { id: "20230134", name: "Natalia Rios", career: "Ingenieria de Sistemas" },
      { id: "20230177", name: "Samuel Vanegas", career: "Ingenieria de Sistemas" },
      { id: "20230189", name: "Maria Pulido", career: "Ingenieria de Sistemas" }
    ],
    D: [
      { id: "20230205", name: "Felipe Cardenas", career: "Ingenieria de Sistemas" },
      { id: "20230219", name: "Valentina Ocampo", career: "Ingenieria de Sistemas" }
    ]
  },
  initialGrades: {
    A: {
      "20230101": 86,
      "20230122": 72,
      "20230134": 90
    },
    B: {
      "20230122": 64,
      "20230148": 0,
      "20230156": 0
    },
    C: {
      "20230134": 79,
      "20230177": 83,
      "20230189": 95
    },
    D: {
      "20230205": 58,
      "20230219": 91
    }
  }
};
