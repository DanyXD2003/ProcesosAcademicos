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
  settings: [
    {
      id: "ST-SET-001",
      title: "Notificaciones academicas",
      description: "Control visual de alertas por correo y plataforma",
      enabled: true
    },
    {
      id: "ST-SET-002",
      title: "Privacidad del perfil",
      description: "Preferencias de visibilidad para datos del estudiante",
      enabled: true
    },
    {
      id: "ST-SET-003",
      title: "Seguridad de cuenta",
      description: "Cambio de contrasena y sesiones activas",
      enabled: false
    }
  ]
};
