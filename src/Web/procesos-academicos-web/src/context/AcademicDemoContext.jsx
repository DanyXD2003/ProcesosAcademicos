import { createContext, useContext, useMemo, useState } from "react";
import { directorDashboardMock } from "../mocks/director.mock";
import { studentDashboardMock } from "../mocks/student.mock";

const AcademicDemoContext = createContext(undefined);

function getInitialCourses() {
  return directorDashboardMock.coursesCatalog.map((course) => ({ ...course }));
}

function getInitialActiveCodes() {
  return [...studentDashboardMock.myCourses.activeCourseCodes];
}

export function AcademicDemoProvider({ children }) {
  const [coursesCatalog, setCoursesCatalog] = useState(getInitialCourses);
  const [activeCourseCodes, setActiveCourseCodes] = useState(getInitialActiveCodes);
  const studentCareer = studentDashboardMock.profileDetails.career ?? "";

  const publishedCourses = useMemo(
    () => coursesCatalog.filter((course) => course.publicationStatus === "Publicado"),
    [coursesCatalog]
  );

  const activeCourses = useMemo(
    () => coursesCatalog.filter((course) => activeCourseCodes.includes(course.code)),
    [activeCourseCodes, coursesCatalog]
  );

  const pendingCourses = useMemo(() => {
    if (!studentCareer) {
      return [];
    }

    return publishedCourses.filter((course) => course.career === studentCareer && !activeCourseCodes.includes(course.code));
  }, [activeCourseCodes, publishedCourses, studentCareer]);

  const careersCatalog = useMemo(() => {
    const careers = new Set(coursesCatalog.map((course) => course.career));
    return Array.from(careers).sort((left, right) => left.localeCompare(right));
  }, [coursesCatalog]);

  function publishCourse(courseCode) {
    setCoursesCatalog((current) =>
      current.map((course) =>
        course.code === courseCode
          ? {
              ...course,
              publicationStatus: "Publicado"
            }
          : course
      )
    );
  }

  function enrollStudentInCourse(courseCode) {
    setActiveCourseCodes((current) => {
      if (current.includes(courseCode)) {
        return current;
      }

      return [...current, courseCode];
    });
  }

  return (
    <AcademicDemoContext.Provider
      value={{
        activeCourseCodes,
        activeCourses,
        careersCatalog,
        coursesCatalog,
        enrollStudentInCourse,
        pendingCourses,
        publishCourse,
        publishedCourses,
        studentCareer
      }}
    >
      {children}
    </AcademicDemoContext.Provider>
  );
}

export function useAcademicDemo() {
  const context = useContext(AcademicDemoContext);

  if (!context) {
    throw new Error("useAcademicDemo debe usarse dentro de AcademicDemoProvider");
  }

  return context;
}
