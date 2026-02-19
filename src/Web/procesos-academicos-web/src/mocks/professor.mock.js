export const professorDashboardMock = {
  profile: {
    name: "Prof. Alejandro R.",
    subtitle: "Ciencias Exactas",
    initials: "AR"
  },
  schedule: [
    { id: "SCH-001", day: "Lunes", block: "08:00 - 10:00", room: "Lab A" },
    { id: "SCH-002", day: "Miercoles", block: "10:00 - 12:00", room: "Aula 204" }
  ],
  reportItems: [
    { id: "RP-001", title: "Acta parcial", createdAt: "2026-02-10", status: "Emitido" },
    { id: "RP-002", title: "Consolidado de notas", createdAt: "2026-02-12", status: "Pendiente" }
  ]
};
