import { Navigate, Route, Routes } from "react-router-dom";
import { useAcademicDemo } from "../context/AcademicDemoContext";
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
import { appPaths, withPage } from "./paths";

function roleHomePath(roleCode) {
  if (roleCode === "DIRECTOR") {
    return withPage(appPaths.dashboard.director);
  }

  if (roleCode === "PROFESOR") {
    return withPage(appPaths.dashboard.professor);
  }

  return withPage(appPaths.dashboard.student);
}

function FullPageLoader() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8 text-slate-100">
      <p className="rounded-xl border border-slate-800 bg-slate-900/70 px-5 py-3 text-sm">Cargando sesion...</p>
    </main>
  );
}

function RequireRole({ allowedRoles, children }) {
  const { currentUser, isAuthenticated, isBootstrapping } = useAcademicDemo();

  if (isBootstrapping) {
    return <FullPageLoader />;
  }

  if (!isAuthenticated || !currentUser) {
    return <Navigate replace to={appPaths.login} />;
  }

  if (!allowedRoles.includes(currentUser.roleCode)) {
    return <Navigate replace to={roleHomePath(currentUser.roleCode)} />;
  }

  return children;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<Navigate replace to={appPaths.login} />} path={appPaths.root} />
      <Route element={<LoginPage />} path={appPaths.login} />

      <Route
        element={(
          <RequireRole allowedRoles={["DIRECTOR"]}>
            <DirectorDashboardPage />
          </RequireRole>
        )}
        path={appPaths.dashboard.director}
      />
      <Route
        element={(
          <RequireRole allowedRoles={["DIRECTOR"]}>
            <DirectorCoursesPage />
          </RequireRole>
        )}
        path={appPaths.dashboard.directorCourses}
      />
      <Route
        element={(
          <RequireRole allowedRoles={["DIRECTOR"]}>
            <DirectorProfessorsPage />
          </RequireRole>
        )}
        path={appPaths.dashboard.directorProfessors}
      />
      <Route
        element={(
          <RequireRole allowedRoles={["DIRECTOR"]}>
            <DirectorStudentsPage />
          </RequireRole>
        )}
        path={appPaths.dashboard.directorStudents}
      />
      <Route
        element={(
          <RequireRole allowedRoles={["DIRECTOR"]}>
            <DirectorReportsPage />
          </RequireRole>
        )}
        path={appPaths.dashboard.directorReports}
      />

      <Route
        element={(
          <RequireRole allowedRoles={["PROFESOR"]}>
            <ProfessorDashboardPage />
          </RequireRole>
        )}
        path={appPaths.dashboard.professor}
      />
      <Route
        element={(
          <RequireRole allowedRoles={["PROFESOR"]}>
            <ProfessorClassesPage />
          </RequireRole>
        )}
        path={appPaths.dashboard.professorClasses}
      />
      <Route
        element={(
          <RequireRole allowedRoles={["PROFESOR"]}>
            <ProfessorStudentsPage />
          </RequireRole>
        )}
        path={appPaths.dashboard.professorStudents}
      />

      <Route
        element={(
          <RequireRole allowedRoles={["ESTUDIANTE"]}>
            <StudentDashboardPage />
          </RequireRole>
        )}
        path={appPaths.dashboard.student}
      />
      <Route
        element={(
          <RequireRole allowedRoles={["ESTUDIANTE"]}>
            <StudentMyCoursesPage />
          </RequireRole>
        )}
        path={appPaths.dashboard.studentMyCourses}
      />
      <Route
        element={(
          <RequireRole allowedRoles={["ESTUDIANTE"]}>
            <StudentProfilePage />
          </RequireRole>
        )}
        path={appPaths.dashboard.studentProfile}
      />
      <Route
        element={(
          <RequireRole allowedRoles={["ESTUDIANTE"]}>
            <StudentAcademicRecordPage />
          </RequireRole>
        )}
        path={appPaths.dashboard.studentAcademicRecord}
      />

      <Route element={<Navigate replace to={appPaths.login} />} path="*" />
    </Routes>
  );
}
