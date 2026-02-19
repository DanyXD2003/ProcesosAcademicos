import { createContext, useContext, useMemo, useState } from "react";
import { directorDashboardMock } from "../mocks/director.mock";
import { professorDashboardMock } from "../mocks/professor.mock";
import { studentDashboardMock } from "../mocks/student.mock";

const PASSING_GRADE = 61;

const AcademicDemoContext = createContext(undefined);

function getInitialCourses() {
  return directorDashboardMock.coursesCatalog.map((course) => ({ ...course }));
}

function getInitialActiveCodes() {
  return [...studentDashboardMock.myCourses.activeCourseCodes];
}

function getInitialProfessorClasses() {
  return professorDashboardMock.classes.map((course) => ({ ...course }));
}

function getInitialClassGrades() {
  return Object.fromEntries(
    Object.entries(professorDashboardMock.initialGrades).map(([classId, grades]) => [classId, { ...grades }])
  );
}

function getInitialReportRequests() {
  return directorDashboardMock.reportRequests.map((request) => ({ ...request }));
}

function parseSeats(value) {
  const [usedRaw = "0", capacityRaw = "0"] = `${value}`.split("/");
  const used = Number(usedRaw);
  const capacity = Number(capacityRaw);

  return {
    used: Number.isFinite(used) ? used : 0,
    capacity: Number.isFinite(capacity) ? capacity : 0
  };
}

function formatDate(dateValue) {
  const date = new Date(dateValue);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getNextRequestId(requests) {
  const maxId = requests.reduce((highest, item) => {
    const numeric = Number(`${item.id}`.replace(/\D/g, ""));
    if (!Number.isFinite(numeric)) {
      return highest;
    }

    return Math.max(highest, numeric);
  }, 0);

  return `SOL-${String(maxId + 1).padStart(3, "0")}`;
}

export function AcademicDemoProvider({ children }) {
  const [coursesCatalog, setCoursesCatalog] = useState(getInitialCourses);
  const [activeCourseCodes, setActiveCourseCodes] = useState(getInitialActiveCodes);
  const [studentCareer, setStudentCareer] = useState(studentDashboardMock.profileDetails.career ?? "");
  const [professorClasses, setProfessorClasses] = useState(getInitialProfessorClasses);
  const [classGrades, setClassGrades] = useState(getInitialClassGrades);
  const [reportRequests, setReportRequests] = useState(getInitialReportRequests);

  const curriculumByCareer = studentDashboardMock.curriculumByCareer;
  const studentHistory = studentDashboardMock.history;

  const careersCatalog = useMemo(() => Object.keys(curriculumByCareer).sort((left, right) => left.localeCompare(right)), [curriculumByCareer]);

  const studentCurriculum = useMemo(() => {
    if (!studentCareer) {
      return [];
    }

    return curriculumByCareer[studentCareer] ?? [];
  }, [curriculumByCareer, studentCareer]);

  const approvedHistoryCodes = useMemo(() => {
    const topGradeByCode = new Map();

    studentHistory.forEach((row) => {
      const previous = topGradeByCode.get(row.code) ?? -1;
      if (row.grade > previous) {
        topGradeByCode.set(row.code, row.grade);
      }
    });

    return new Set(
      Array.from(topGradeByCode.entries())
        .filter(([, grade]) => grade >= PASSING_GRADE)
        .map(([code]) => code)
    );
  }, [studentHistory]);

  const approvedCurriculumCount = useMemo(
    () => studentCurriculum.filter((course) => approvedHistoryCodes.has(course.code)).length,
    [approvedHistoryCodes, studentCurriculum]
  );

  const pendingCurriculumCount = useMemo(
    () => Math.max(studentCurriculum.length - approvedCurriculumCount, 0),
    [approvedCurriculumCount, studentCurriculum.length]
  );

  const publishedCourses = useMemo(
    () => coursesCatalog.filter((course) => course.publicationStatus === "Publicado"),
    [coursesCatalog]
  );

  const studentActiveCourses = useMemo(
    () => coursesCatalog.filter((course) => activeCourseCodes.includes(course.code)),
    [activeCourseCodes, coursesCatalog]
  );

  const availableCoursesForEnrollment = useMemo(() => {
    if (!studentCareer) {
      return [];
    }

    const curriculumCodes = new Set(studentCurriculum.map((course) => course.code));

    return publishedCourses.filter(
      (course) => course.career === studentCareer && curriculumCodes.has(course.code) && !activeCourseCodes.includes(course.code)
    );
  }, [activeCourseCodes, publishedCourses, studentCareer, studentCurriculum]);

  const studentAverageGrade = useMemo(() => {
    if (studentHistory.length === 0) {
      return "0.0";
    }

    const total = studentHistory.reduce((sum, row) => sum + row.grade, 0);
    return (total / studentHistory.length).toFixed(1);
  }, [studentHistory]);

  const professorStats = useMemo(() => {
    const activeCount = professorClasses.filter((course) => course.status !== "Cerrado").length;

    const pendingGradeEntries = professorClasses.reduce((count, course) => {
      if (course.gradesPublished || course.status === "Cerrado") {
        return count;
      }

      const students = professorDashboardMock.classStudents[course.id] ?? [];
      const grades = classGrades[course.id] ?? {};

      const missing = students.filter((student) => {
        const grade = grades[student.id];
        return !Number.isFinite(grade) || grade <= 0;
      }).length;

      return count + missing;
    }, 0);

    const uniqueStudents = new Set();
    Object.values(professorDashboardMock.classStudents).forEach((list) => {
      list.forEach((student) => uniqueStudents.add(student.id));
    });

    return {
      activeCourses: activeCount,
      pendingGrades: pendingGradeEntries,
      students: uniqueStudents.size
    };
  }, [classGrades, professorClasses]);

  const professorStudentsSummary = useMemo(() => {
    const studentsMap = new Map();

    Object.entries(professorDashboardMock.classStudents).forEach(([classId, students]) => {
      students.forEach((student) => {
        if (!studentsMap.has(student.id)) {
          studentsMap.set(student.id, {
            id: student.id,
            name: student.name,
            career: student.career,
            approvedGrades: []
          });
        }

        const grade = classGrades[classId]?.[student.id];
        if (Number.isFinite(grade) && grade >= PASSING_GRADE) {
          studentsMap.get(student.id).approvedGrades.push(grade);
        }
      });
    });

    return Array.from(studentsMap.values())
      .map((student) => {
        if (student.approvedGrades.length === 0) {
          return {
            id: student.id,
            name: student.name,
            career: student.career,
            approvedAverage: "Sin notas aprobadas"
          };
        }

        const total = student.approvedGrades.reduce((sum, grade) => sum + grade, 0);
        return {
          id: student.id,
          name: student.name,
          career: student.career,
          approvedAverage: (total / student.approvedGrades.length).toFixed(1)
        };
      })
      .sort((left, right) => left.name.localeCompare(right.name));
  }, [classGrades]);

  const directorStats = useMemo(() => {
    const activeClasses = coursesCatalog.filter((course) => course.publicationStatus === "Activo").length;
    const pendingClasses = coursesCatalog.filter((course) => course.publicationStatus === "Publicado").length;

    return {
      totalStudents: directorDashboardMock.studentsRegistry.length,
      totalProfessors: directorDashboardMock.professorsRegistry.length,
      activeClasses,
      pendingClasses
    };
  }, [coursesCatalog]);

  const directorCapacity = useMemo(() => {
    const activeStudents = coursesCatalog
      .filter((course) => course.publicationStatus === "Activo")
      .reduce((sum, course) => sum + parseSeats(course.seats).used, 0);

    const pendingCapacity = coursesCatalog
      .filter((course) => course.publicationStatus === "Publicado")
      .reduce((sum, course) => sum + parseSeats(course.seats).capacity, 0);

    return {
      activeStudents,
      pendingCapacity,
      totalCapacity: activeStudents + pendingCapacity
    };
  }, [coursesCatalog]);

  const studentProfileDetails = useMemo(
    () => ({
      ...studentDashboardMock.profileDetails,
      career: studentCareer,
      program: studentCareer || "Sin carrera asignada"
    }),
    [studentCareer]
  );

  function enrollCareer(careerId) {
    if (!careersCatalog.includes(careerId)) {
      return;
    }

    setStudentCareer((current) => (current ? current : careerId));
  }

  function publishCourse(courseCode) {
    setCoursesCatalog((current) =>
      current.map((course) => {
        if (course.code !== courseCode) {
          return course;
        }

        if (course.publicationStatus !== "Borrador") {
          return course;
        }

        return {
          ...course,
          publicationStatus: "Publicado"
        };
      })
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

  function setDraftGrade(classId, studentId, gradeValue) {
    const selectedClass = professorClasses.find((course) => course.id === classId);
    if (!selectedClass || selectedClass.gradesPublished || selectedClass.status === "Cerrado") {
      return;
    }

    const parsed = Number(gradeValue);
    if (!Number.isFinite(parsed)) {
      return;
    }

    const bounded = Math.max(0, Math.min(100, Math.round(parsed)));

    setClassGrades((current) => ({
      ...current,
      [classId]: {
        ...(current[classId] ?? {}),
        [studentId]: bounded
      }
    }));
  }

  function publishClassGrades(classId) {
    setProfessorClasses((current) =>
      current.map((course) => {
        if (course.id !== classId || course.status === "Cerrado") {
          return course;
        }

        return {
          ...course,
          gradesPublished: true,
          status: course.status === "Publicado" ? "Activo" : course.status
        };
      })
    );
  }

  function closeClass(classId) {
    const selectedClass = professorClasses.find((course) => course.id === classId);
    if (!selectedClass || !selectedClass.gradesPublished || selectedClass.status === "Cerrado") {
      return;
    }

    setProfessorClasses((current) =>
      current.map((course) =>
        course.id === classId
          ? {
              ...course,
              status: "Cerrado"
            }
          : course
      )
    );

    setCoursesCatalog((current) =>
      current.map((course) =>
        course.code === selectedClass.code
          ? {
              ...course,
              publicationStatus: "Cerrado"
            }
          : course
      )
    );
  }

  function createStudentRequest(type) {
    const requestType = type === "Cierre de pensum" ? "Cierre de pensum" : "Certificacion de cursos";

    setReportRequests((current) => [
      {
        id: getNextRequestId(current),
        studentName: studentDashboardMock.profile.name,
        requestType,
        requestedAt: formatDate(new Date()),
        status: "Solicitado",
        issuedAt: "",
        downloadName: ""
      },
      ...current
    ]);
  }

  function createDraftCourse(payload) {
    const code = `${payload.code ?? ""}`.trim();
    const courseName = `${payload.course ?? ""}`.trim();
    const career = `${payload.career ?? ""}`.trim();
    const section = `${payload.section ?? "A"}`.trim() || "A";
    const professor = `${payload.professor ?? "Sin asignar"}`.trim() || "Sin asignar";
    const department = `${payload.department ?? "General"}`.trim() || "General";
    const capacity = Math.max(1, Number(payload.capacity) || 30);

    if (!code || !courseName || !career) {
      return;
    }

    setCoursesCatalog((current) => {
      const exists = current.some((course) => course.code === code);
      if (exists) {
        return current;
      }

      return [
        ...current,
        {
          code,
          course: courseName,
          department,
          career,
          section,
          seats: `0/${capacity}`,
          professor,
          publicationStatus: "Borrador"
        }
      ];
    });
  }

  return (
    <AcademicDemoContext.Provider
      value={{
        activeCourseCodes,
        approvedCurriculumCount,
        availableCoursesForEnrollment,
        careersCatalog,
        classGrades,
        closeClass,
        coursesCatalog,
        createStudentRequest,
        createDraftCourse,
        directorCapacity,
        directorStats,
        enrollCareer,
        enrollStudentInCourse,
        PASSING_GRADE,
        pendingCurriculumCount,
        professorClasses,
        professorClassStudents: professorDashboardMock.classStudents,
        professorStats,
        professorStudentsSummary,
        profile: studentDashboardMock.profile,
        publishClassGrades,
        publishCourse,
        publishedCourses,
        reportRequests,
        setDraftGrade,
        studentActiveCourses,
        studentAverageGrade,
        studentCareer,
        studentCurriculum,
        studentHistory,
        studentProfileDetails,
        teacherAvailability: directorDashboardMock.teacherAvailability,
        teachers: directorDashboardMock.teachers
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
