import { appPaths, withPage } from "../router/paths";

export function getDirectorSidebarItems() {
  return [
    { label: "Dashboard", icon: "dashboard", to: withPage(appPaths.dashboard.director) },
    { label: "Cursos", icon: "auto_stories", to: withPage(appPaths.dashboard.directorCourses) },
    { label: "Profesores", icon: "co_present", to: withPage(appPaths.dashboard.directorProfessors) },
    { label: "Estudiantes", icon: "groups", to: withPage(appPaths.dashboard.directorStudents) },
    { label: "Reportes", icon: "analytics", to: withPage(appPaths.dashboard.directorReports) }
  ];
}

export function getProfessorSidebarItems() {
  return [
    { label: "Dashboard", icon: "dashboard", to: withPage(appPaths.dashboard.professor) },
    { label: "Mis clases", icon: "menu_book", to: withPage(appPaths.dashboard.professorClasses) },
    { label: "Horario", icon: "calendar_today", to: withPage(appPaths.dashboard.professorSchedule) },
    { label: "Reportes", icon: "assessment", to: withPage(appPaths.dashboard.professorReports) },
    { label: "Estudiantes", icon: "groups", to: withPage(appPaths.dashboard.professorStudents) }
  ];
}

export function getStudentSidebarItems() {
  return [
    { label: "Dashboard", icon: "home", to: withPage(appPaths.dashboard.student) },
    { label: "Mis cursos", icon: "library_books", to: appPaths.dashboard.studentMyCourses },
    { label: "Perfil", icon: "person", to: appPaths.dashboard.studentProfile },
    { label: "Registro academico", icon: "history_edu", to: withPage(appPaths.dashboard.studentAcademicRecord) },
    { label: "Configuracion", icon: "settings", to: appPaths.dashboard.studentSettings }
  ];
}
