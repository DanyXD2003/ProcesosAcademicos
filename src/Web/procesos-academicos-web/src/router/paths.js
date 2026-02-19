export const appPaths = {
  root: "/",
  login: "/login",
  dashboard: {
    director: "/dashboard/director",
    directorCourses: "/dashboard/director/cursos",
    directorProfessors: "/dashboard/director/profesores",
    directorStudents: "/dashboard/director/estudiantes",
    directorReports: "/dashboard/director/reportes",

    professor: "/dashboard/profesor",
    professorClasses: "/dashboard/profesor/mis-clases",
    professorStudents: "/dashboard/profesor/estudiantes",

    student: "/dashboard/estudiante",
    studentMyCourses: "/dashboard/estudiante/mis-cursos",
    studentProfile: "/dashboard/estudiante/perfil",
    studentAcademicRecord: "/dashboard/estudiante/registro-academico"
  }
};

export function withPage(path, page = 1) {
  return `${path}?page=${page}`;
}
