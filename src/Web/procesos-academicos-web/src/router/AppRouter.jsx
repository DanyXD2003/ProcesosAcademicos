import { Navigate, Route, Routes } from "react-router-dom";
import DirectorCoursesPage from "../pages/DirectorCoursesPage";
import DirectorDashboardPage from "../pages/DirectorDashboardPage";
import DirectorProfessorsPage from "../pages/DirectorProfessorsPage";
import DirectorReportsPage from "../pages/DirectorReportsPage";
import DirectorStudentsPage from "../pages/DirectorStudentsPage";
import LoginPage from "../pages/LoginPage";
import ProfessorClassesPage from "../pages/ProfessorClassesPage";
import ProfessorDashboardPage from "../pages/ProfessorDashboardPage";
import ProfessorStudentsPage from "../pages/ProfessorStudentsPage";
import StudentAcademicRecordPage from "../pages/StudentAcademicRecordPage";
import StudentDashboardPage from "../pages/StudentDashboardPage";
import StudentMyCoursesPage from "../pages/StudentMyCoursesPage";
import StudentProfilePage from "../pages/StudentProfilePage";
import { appPaths } from "./paths";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<Navigate replace to={appPaths.login} />} path={appPaths.root} />
      <Route element={<LoginPage />} path={appPaths.login} />

      <Route element={<DirectorDashboardPage />} path={appPaths.dashboard.director} />
      <Route element={<DirectorCoursesPage />} path={appPaths.dashboard.directorCourses} />
      <Route element={<DirectorProfessorsPage />} path={appPaths.dashboard.directorProfessors} />
      <Route element={<DirectorStudentsPage />} path={appPaths.dashboard.directorStudents} />
      <Route element={<DirectorReportsPage />} path={appPaths.dashboard.directorReports} />

      <Route element={<ProfessorDashboardPage />} path={appPaths.dashboard.professor} />
      <Route element={<ProfessorClassesPage />} path={appPaths.dashboard.professorClasses} />
      <Route element={<ProfessorStudentsPage />} path={appPaths.dashboard.professorStudents} />

      <Route element={<StudentDashboardPage />} path={appPaths.dashboard.student} />
      <Route element={<StudentMyCoursesPage />} path={appPaths.dashboard.studentMyCourses} />
      <Route element={<StudentProfilePage />} path={appPaths.dashboard.studentProfile} />
      <Route element={<StudentAcademicRecordPage />} path={appPaths.dashboard.studentAcademicRecord} />

      <Route element={<Navigate replace to={appPaths.login} />} path="*" />
    </Routes>
  );
}
