import { createContext, useContext, useMemo, useState } from "react";
import {
  academicDomainMock,
  CURRENT_PROFESSOR_ID,
  CURRENT_STUDENT_ID,
  CURRENT_TERM,
  PASSING_GRADE
} from "../mocks/academic-domain.mock";

const AcademicDemoContext = createContext(undefined);

function cloneItems(items) {
  return items.map((item) => ({ ...item }));
}

function cloneNestedMap(record) {
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [key, { ...value }])
  );
}

function formatDate(dateValue) {
  const date = new Date(dateValue);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function average(values) {
  if (!Array.isArray(values) || values.length === 0) {
    return "-";
  }

  const total = values.reduce((sum, value) => sum + value, 0);
  return (total / values.length).toFixed(1);
}

function nextRequestId(requests) {
  const max = requests.reduce((highest, item) => {
    const numeric = Number(`${item.id}`.replace(/\D/g, ""));
    if (!Number.isFinite(numeric)) {
      return highest;
    }
    return Math.max(highest, numeric);
  }, 0);

  return `SOL-${String(max + 1).padStart(3, "0")}`;
}

function randomId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
}

function buildReportDownloadName(requestType, requestId) {
  const normalized = requestType === "Cierre de pensum" ? "cierre-pensum" : "certificacion-cursos";
  return `${normalized}-${requestId.toLowerCase()}.txt`;
}

function downloadGeneratedReport(request) {
  if (typeof window === "undefined" || !request?.downloadName) {
    return;
  }

  const content = [
    "Procesos Academicos - Documento generado",
    `Solicitud: ${request.id}`,
    `Estudiante: ${request.studentName}`,
    `Tipo: ${request.requestType}`,
    `Fecha emision: ${request.issuedAt}`
  ].join("\n");

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = request.downloadName;
  anchor.click();
  URL.revokeObjectURL(url);
}

function buildEquivalenceGraph(equivalences) {
  const graph = new Map();

  equivalences
    .filter((item) => item.active)
    .forEach((item) => {
      if (!graph.has(item.sourceCourseId)) {
        graph.set(item.sourceCourseId, new Set());
      }
      if (!graph.has(item.targetCourseId)) {
        graph.set(item.targetCourseId, new Set());
      }
      graph.get(item.sourceCourseId).add(item.targetCourseId);
      graph.get(item.targetCourseId).add(item.sourceCourseId);
    });

  return graph;
}

function collectEquivalentCourseIds(courseId, graph) {
  const visited = new Set([courseId]);
  const queue = [courseId];

  while (queue.length > 0) {
    const current = queue.shift();
    const neighbors = graph.get(current) ?? new Set();

    neighbors.forEach((neighbor) => {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    });
  }

  return visited;
}

function nextOfferingCode(term, offerings) {
  const year = `${term}`.split("-")[0] || "2026";
  const regex = new RegExp(`^CL-${year}-(\\d{3})$`);
  const max = offerings.reduce((highest, offering) => {
    const match = `${offering.offeringCode}`.match(regex);
    if (!match) {
      return highest;
    }
    const value = Number(match[1]);
    if (!Number.isFinite(value)) {
      return highest;
    }
    return Math.max(highest, value);
  }, 0);

  return `CL-${year}-${String(max + 1).padStart(3, "0")}`;
}

function statusTone(status) {
  if (status === "Activo") {
    return "Activo";
  }

  if (status === "Publicado") {
    return "Publicado";
  }

  if (status === "Borrador") {
    return "Borrador";
  }

  return "Cerrado";
}

export function AcademicDemoProvider({ children }) {
  const [students, setStudents] = useState(() => cloneItems(academicDomainMock.students));
  const [courseOfferings, setCourseOfferings] = useState(() => cloneItems(academicDomainMock.courseOfferings));
  const [enrollments, setEnrollments] = useState(() => cloneItems(academicDomainMock.enrollments));
  const [studentCurriculumAssignments, setStudentCurriculumAssignments] = useState(() => cloneItems(academicDomainMock.studentCurriculumAssignments));
  const [gradeDrafts, setGradeDrafts] = useState(() => cloneNestedMap(academicDomainMock.gradeDrafts));
  const [gradePublications, setGradePublications] = useState(() => cloneNestedMap(academicDomainMock.gradePublications));
  const [academicRecords, setAcademicRecords] = useState(() => cloneItems(academicDomainMock.academicRecords));
  const [reportRequests, setReportRequests] = useState(() => cloneItems(academicDomainMock.reportRequests));

  const careers = academicDomainMock.careers;
  const baseCourses = academicDomainMock.baseCourses;
  const curriculumVersions = academicDomainMock.curriculumVersions;
  const curriculumCourses = academicDomainMock.curriculumCourses;
  const courseEquivalences = academicDomainMock.courseEquivalences;
  const professors = academicDomainMock.professors;
  const uiProfiles = academicDomainMock.uiProfiles;

  const careerById = useMemo(() => new Map(careers.map((career) => [career.id, career])), [careers]);
  const courseById = useMemo(() => new Map(baseCourses.map((course) => [course.id, course])), [baseCourses]);
  const professorById = useMemo(() => new Map(professors.map((professor) => [professor.id, professor])), [professors]);
  const studentById = useMemo(() => new Map(students.map((student) => [student.id, student])), [students]);

  const equivalenceGraph = useMemo(() => buildEquivalenceGraph(courseEquivalences), [courseEquivalences]);

  const currentStudent = useMemo(
    () => students.find((student) => student.id === CURRENT_STUDENT_ID) ?? null,
    [students]
  );

  const studentCareerId = currentStudent?.careerId ?? "";
  const studentCareer = studentCareerId ? careerById.get(studentCareerId)?.name ?? "" : "";

  const activeCurriculumAssignment = useMemo(
    () => studentCurriculumAssignments.find((item) => item.studentId === CURRENT_STUDENT_ID && item.isActive) ?? null,
    [studentCurriculumAssignments]
  );

  const fallbackCurriculumVersion = useMemo(() => {
    if (!studentCareerId) {
      return null;
    }

    const versions = curriculumVersions
      .filter((item) => item.careerId === studentCareerId)
      .sort((left, right) => right.cohortYear - left.cohortYear);

    return versions[0] ?? null;
  }, [curriculumVersions, studentCareerId]);

  const activeCurriculumVersion = useMemo(() => {
    if (activeCurriculumAssignment) {
      return curriculumVersions.find((version) => version.id === activeCurriculumAssignment.curriculumVersionId) ?? null;
    }

    return fallbackCurriculumVersion;
  }, [activeCurriculumAssignment, curriculumVersions, fallbackCurriculumVersion]);

  const studentCurriculum = useMemo(() => {
    if (!activeCurriculumVersion) {
      return [];
    }

    return curriculumCourses
      .filter((item) => item.curriculumVersionId === activeCurriculumVersion.id)
      .map((item) => {
        const course = courseById.get(item.courseId);

        return {
          courseId: item.courseId,
          code: course?.code ?? "",
          subject: course?.name ?? "Curso sin definir",
          termNumber: item.termNumber
        };
      })
      .sort((left, right) => {
        if (left.termNumber !== right.termNumber) {
          return left.termNumber - right.termNumber;
        }
        return left.code.localeCompare(right.code);
      });
  }, [activeCurriculumVersion, courseById, curriculumCourses]);

  const approvedBaseCourseIds = useMemo(() => {
    const directApproved = new Set(
      academicRecords
        .filter((row) => row.studentId === CURRENT_STUDENT_ID && row.grade >= PASSING_GRADE)
        .map((row) => row.courseId)
    );

    const expanded = new Set();

    directApproved.forEach((courseId) => {
      const equivalents = collectEquivalentCourseIds(courseId, equivalenceGraph);
      equivalents.forEach((item) => expanded.add(item));
    });

    return expanded;
  }, [academicRecords, equivalenceGraph]);

  const pendingCurriculumCourses = useMemo(
    () => studentCurriculum.filter((course) => !approvedBaseCourseIds.has(course.courseId)),
    [approvedBaseCourseIds, studentCurriculum]
  );

  const approvedCurriculumCount = studentCurriculum.length - pendingCurriculumCourses.length;
  const pendingCurriculumCount = pendingCurriculumCourses.length;

  const careersCatalog = useMemo(
    () => careers.map((career) => career.name).sort((left, right) => left.localeCompare(right)),
    [careers]
  );

  const careersOptions = useMemo(
    () => careers.map((career) => ({ id: career.id, name: career.name })),
    [careers]
  );

  function buildOfferingView(offering) {
    const course = courseById.get(offering.courseId);
    const career = careerById.get(offering.careerId);
    const professor = offering.professorId ? professorById.get(offering.professorId) : null;

    return {
      id: offering.id,
      offeringId: offering.id,
      offeringCode: offering.offeringCode,
      code: course?.code ?? "",
      baseCourseCode: course?.code ?? "",
      course: course?.name ?? "Curso sin definir",
      courseId: offering.courseId,
      careerId: offering.careerId,
      career: career?.name ?? "Sin carrera",
      section: offering.section,
      term: offering.term,
      seatsTaken: offering.seatsTaken,
      seatsTotal: offering.seatsTotal,
      seats: `${offering.seatsTaken}/${offering.seatsTotal}`,
      professorId: offering.professorId,
      professor: professor?.fullName ?? "Sin asignar",
      gradesPublished: Boolean(gradePublications[offering.id]),
      publicationStatus: statusTone(offering.status),
      status: statusTone(offering.status)
    };
  }

  const courseOfferingsById = useMemo(() => new Map(courseOfferings.map((offering) => [offering.id, offering])), [courseOfferings]);

  const studentActiveEnrollmentRows = useMemo(
    () => enrollments.filter((item) => item.studentId === CURRENT_STUDENT_ID && item.status === "Activa"),
    [enrollments]
  );

  const studentActiveOfferingIds = useMemo(
    () => new Set(studentActiveEnrollmentRows.map((item) => item.offeringId)),
    [studentActiveEnrollmentRows]
  );

  const studentActiveOfferings = useMemo(
    () =>
      courseOfferings
        .filter((offering) => studentActiveOfferingIds.has(offering.id) && offering.status !== "Cerrado")
        .map((offering) => buildOfferingView(offering)),
    [courseOfferings, studentActiveOfferingIds]
  );

  const availableOfferingsForEnrollment = useMemo(() => {
    if (!studentCareerId || !activeCurriculumVersion) {
      return [];
    }

    const requiredCourseIds = new Set(studentCurriculum.map((item) => item.courseId));
    const activeCourseIds = new Set(
      studentActiveEnrollmentRows
        .map((item) => courseOfferingsById.get(item.offeringId))
        .filter(Boolean)
        .map((offering) => offering.courseId)
    );

    return courseOfferings
      .filter((offering) => offering.status === "Publicado")
      .filter((offering) => offering.term === CURRENT_TERM)
      .filter((offering) => offering.careerId === studentCareerId)
      .filter((offering) => requiredCourseIds.has(offering.courseId))
      .filter((offering) => !approvedBaseCourseIds.has(offering.courseId))
      .filter((offering) => !activeCourseIds.has(offering.courseId))
      .filter((offering) => offering.seatsTaken < offering.seatsTotal)
      .map((offering) => buildOfferingView(offering))
      .sort((left, right) => left.offeringCode.localeCompare(right.offeringCode));
  }, [
    activeCurriculumVersion,
    approvedBaseCourseIds,
    courseOfferings,
    courseOfferingsById,
    studentActiveEnrollmentRows,
    studentCareerId,
    studentCurriculum
  ]);

  const studentHistory = useMemo(
    () =>
      academicRecords
        .filter((row) => row.studentId === CURRENT_STUDENT_ID)
        .map((row) => {
          const course = courseById.get(row.courseId);
          return {
            id: row.id,
            code: course?.code ?? "",
            subject: course?.name ?? "Curso sin definir",
            period: row.term,
            credits: course?.credits ?? 0,
            grade: row.grade,
            status: row.grade >= PASSING_GRADE ? "Aprobado" : "Reprobado"
          };
        })
        .sort((left, right) => right.period.localeCompare(left.period)),
    [academicRecords, courseById]
  );

  const studentAverageGrade = useMemo(() => {
    if (studentHistory.length === 0) {
      return "0.0";
    }

    const total = studentHistory.reduce((sum, row) => sum + row.grade, 0);
    return (total / studentHistory.length).toFixed(1);
  }, [studentHistory]);

  const professorClasses = useMemo(
    () =>
      courseOfferings
        .filter((offering) => offering.professorId === CURRENT_PROFESSOR_ID)
        .map((offering) => {
          const classStudents = enrollments.filter((item) => item.offeringId === offering.id);
          const course = courseById.get(offering.courseId);

          return {
            id: offering.id,
            offeringCode: offering.offeringCode,
            code: course?.code ?? "",
            title: course?.name ?? "Curso sin definir",
            section: offering.section,
            term: offering.term,
            status: offering.status,
            students: classStudents.length,
            gradesPublished: Boolean(gradePublications[offering.id])
          };
        })
        .sort((left, right) => left.offeringCode.localeCompare(right.offeringCode)),
    [courseById, courseOfferings, enrollments, gradePublications]
  );

  const professorClassStudents = useMemo(() => {
    const byClass = {};

    professorClasses.forEach((classItem) => {
      const rows = enrollments.filter((item) => item.offeringId === classItem.id);

      byClass[classItem.id] = rows
        .map((row) => {
          const student = studentById.get(row.studentId);
          const career = student?.careerId ? careerById.get(student.careerId) : null;

          return {
            id: row.studentId,
            studentCode: student?.code ?? row.studentId,
            name: student?.fullName ?? "Estudiante sin nombre",
            career: career?.name ?? "Sin carrera"
          };
        })
        .sort((left, right) => left.name.localeCompare(right.name));
    });

    return byClass;
  }, [careerById, enrollments, professorClasses, studentById]);

  const professorStats = useMemo(() => {
    const activeCourses = professorClasses.filter((item) => item.status !== "Cerrado").length;

    const pendingGrades = professorClasses.reduce((count, classItem) => {
      if (classItem.gradesPublished || classItem.status === "Cerrado") {
        return count;
      }

      const studentsInClass = professorClassStudents[classItem.id] ?? [];
      const grades = gradeDrafts[classItem.id] ?? {};
      const missing = studentsInClass.filter((student) => {
        const grade = grades[student.id];
        return !Number.isFinite(grade) || grade <= 0;
      }).length;

      return count + missing;
    }, 0);

    const studentsSet = new Set();
    Object.values(professorClassStudents).forEach((list) => {
      list.forEach((student) => studentsSet.add(student.id));
    });

    return {
      activeCourses,
      pendingGrades,
      students: studentsSet.size
    };
  }, [gradeDrafts, professorClassStudents, professorClasses]);

  const professorStudentsSummary = useMemo(() => {
    const grouped = new Map();

    Object.entries(professorClassStudents).forEach(([offeringId, classStudents]) => {
      classStudents.forEach((student) => {
        if (!grouped.has(student.id)) {
          grouped.set(student.id, {
            id: student.studentCode,
            name: student.name,
            career: student.career,
            approvedGrades: []
          });
        }

        const grade = gradeDrafts[offeringId]?.[student.id];
        if (Number.isFinite(grade) && grade >= PASSING_GRADE) {
          grouped.get(student.id).approvedGrades.push(grade);
        }
      });
    });

    return Array.from(grouped.values())
      .map((item) => ({
        id: item.id,
        name: item.name,
        career: item.career,
        approvedAverage:
          item.approvedGrades.length > 0 ? average(item.approvedGrades) : "Sin notas aprobadas"
      }))
      .sort((left, right) => left.name.localeCompare(right.name));
  }, [gradeDrafts, professorClassStudents]);

  const directorCourses = useMemo(
    () =>
      courseOfferings
        .map((offering) => buildOfferingView(offering))
        .sort((left, right) => left.offeringCode.localeCompare(right.offeringCode)),
    [courseOfferings, gradePublications]
  );

  const directorStats = useMemo(() => {
    const activeClasses = courseOfferings.filter((offering) => offering.status === "Activo").length;
    const pendingClasses = courseOfferings.filter((offering) => offering.status === "Publicado").length;

    return {
      totalStudents: students.length,
      totalProfessors: professors.length,
      activeClasses,
      pendingClasses
    };
  }, [courseOfferings, professors.length, students.length]);

  const directorCapacity = useMemo(() => {
    const activeOfferingIds = new Set(
      courseOfferings.filter((offering) => offering.status === "Activo").map((offering) => offering.id)
    );

    const activeStudents = enrollments.filter(
      (enrollment) => enrollment.status === "Activa" && activeOfferingIds.has(enrollment.offeringId)
    ).length;

    const pendingCapacity = courseOfferings
      .filter((offering) => offering.status === "Publicado")
      .reduce((sum, offering) => sum + offering.seatsTotal, 0);

    return {
      activeStudents,
      pendingCapacity,
      totalCapacity: activeStudents + pendingCapacity
    };
  }, [courseOfferings, enrollments]);

  const directorProfessors = useMemo(() => {
    return professors
      .map((professor) => {
        const load = courseOfferings.filter(
          (offering) =>
            offering.professorId === professor.id &&
            offering.term === CURRENT_TERM &&
            offering.status !== "Cerrado"
        ).length;

        return {
          professorId: professor.id,
          id: professor.code,
          name: professor.fullName,
          department: professor.department,
          load
        };
      })
      .sort((left, right) => left.name.localeCompare(right.name));
  }, [courseOfferings, professors]);

  const directorStudents = useMemo(() => {
    return students
      .map((student) => {
        const career = student.careerId ? careerById.get(student.careerId)?.name : "Sin carrera";
        return {
          id: student.code,
          name: student.fullName,
          program: career || "Sin carrera",
          semester: student.semester ?? "-",
          average: average(student.historicalGrades)
        };
      })
      .sort((left, right) => left.name.localeCompare(right.name));
  }, [careerById, students]);

  const teacherAvailability = useMemo(() => {
    return academicDomainMock.teacherAvailabilitySnapshots.map((snapshot) => {
      const professor = professorById.get(snapshot.professorId);
      const initials = professor?.fullName
        ?.split(" ")
        .slice(0, 2)
        .map((token) => token[0])
        .join("")
        .toUpperCase();

      return {
        initials: initials || "--",
        name: professor?.fullName ?? "Profesor sin nombre",
        speciality: professor?.speciality ?? "Sin especialidad",
        status: snapshot.status
      };
    });
  }, [professorById]);

  const teachers = useMemo(() => {
    return professors
      .map((professor) => {
        const load = directorProfessors.find((item) => item.professorId === professor.id)?.load ?? 0;
        let status = "Disponible";
        if (load >= 5) {
          status = "Carga alta";
        } else if (load >= 4) {
          status = "Carga media";
        }

        return {
          id: professor.id,
          name: professor.fullName,
          speciality: professor.speciality,
          status
        };
      })
      .sort((left, right) => left.name.localeCompare(right.name));
  }, [directorProfessors, professors]);

  const studentProfileDetails = useMemo(() => {
    return {
      fullName: currentStudent?.fullName ?? "Sin nombre",
      studentId: currentStudent?.code ?? "",
      program: studentCareer || "Sin carrera asignada",
      career: studentCareer || "Sin carrera asignada",
      faculty: currentStudent?.faculty ?? "Sin facultad",
      semester: currentStudent?.semester ?? "-",
      email: currentStudent?.email ?? "",
      phone: currentStudent?.phone ?? ""
    };
  }, [currentStudent, studentCareer]);

  function enrollCareer(careerId) {
    if (!careerById.has(careerId)) {
      return;
    }

    if (!currentStudent || currentStudent.careerId) {
      return;
    }

    setStudents((current) =>
      current.map((student) =>
        student.id === CURRENT_STUDENT_ID
          ? {
              ...student,
              careerId
            }
          : student
      )
    );

    const selectedVersion = curriculumVersions
      .filter((version) => version.careerId === careerId)
      .sort((left, right) => right.cohortYear - left.cohortYear)[0];

    if (!selectedVersion) {
      return;
    }

    setStudentCurriculumAssignments((current) => {
      const alreadyAssigned = current.some((item) => item.studentId === CURRENT_STUDENT_ID && item.isActive);
      if (alreadyAssigned) {
        return current;
      }

      return [
        ...current,
        {
          id: randomId("SCA"),
          studentId: CURRENT_STUDENT_ID,
          curriculumVersionId: selectedVersion.id,
          assignedAt: formatDate(new Date()),
          isActive: true
        }
      ];
    });
  }

  function enrollStudentInOffering(offeringId) {
    if (!currentStudent || !currentStudent.careerId) {
      return;
    }

    const selectedOffering = courseOfferings.find((offering) => offering.id === offeringId);
    if (!selectedOffering) {
      return;
    }

    if (selectedOffering.status !== "Publicado") {
      return;
    }

    if (selectedOffering.term !== CURRENT_TERM) {
      return;
    }

    if (selectedOffering.careerId !== currentStudent.careerId) {
      return;
    }

    if (selectedOffering.seatsTaken >= selectedOffering.seatsTotal) {
      return;
    }

    if (approvedBaseCourseIds.has(selectedOffering.courseId)) {
      return;
    }

    const existingEnrollment = enrollments.find(
      (item) => item.studentId === CURRENT_STUDENT_ID && item.offeringId === selectedOffering.id
    );

    if (existingEnrollment) {
      return;
    }

    const sameBaseActive = enrollments.some((item) => {
      if (item.studentId !== CURRENT_STUDENT_ID || item.status !== "Activa") {
        return false;
      }
      const offering = courseOfferingsById.get(item.offeringId);
      return offering?.courseId === selectedOffering.courseId;
    });

    if (sameBaseActive) {
      return;
    }

    setEnrollments((current) => [
      ...current,
      {
        id: randomId("ENR"),
        studentId: CURRENT_STUDENT_ID,
        offeringId,
        status: "Activa",
        enrolledAt: formatDate(new Date())
      }
    ]);

    setCourseOfferings((current) =>
      current.map((offering) =>
        offering.id === offeringId
          ? {
              ...offering,
              seatsTaken: Math.min(offering.seatsTaken + 1, offering.seatsTotal)
            }
          : offering
      )
    );
  }

  function setDraftGrade(offeringId, studentId, gradeValue) {
    const selectedOffering = courseOfferingsById.get(offeringId);
    const alreadyPublished = Boolean(gradePublications[offeringId]);

    if (!selectedOffering || selectedOffering.status === "Cerrado" || alreadyPublished) {
      return;
    }

    const parsed = Number(gradeValue);
    if (!Number.isFinite(parsed)) {
      return;
    }

    const bounded = Math.max(0, Math.min(100, Math.round(parsed)));

    setGradeDrafts((current) => ({
      ...current,
      [offeringId]: {
        ...(current[offeringId] ?? {}),
        [studentId]: bounded
      }
    }));
  }

  function publishClassGrades(offeringId) {
    const selectedOffering = courseOfferingsById.get(offeringId);
    if (!selectedOffering || selectedOffering.status === "Cerrado" || gradePublications[offeringId]) {
      return;
    }

    const draft = gradeDrafts[offeringId] ?? {};

    setGradePublications((current) => ({
      ...current,
      [offeringId]: {
        publishedAt: formatDate(new Date()),
        grades: { ...draft }
      }
    }));

    setCourseOfferings((current) =>
      current.map((offering) => {
        if (offering.id !== offeringId) {
          return offering;
        }

        if (offering.status === "Publicado") {
          return {
            ...offering,
            status: "Activo"
          };
        }

        return offering;
      })
    );
  }

  function closeOfferingWithConsolidation(offeringId) {
    const selectedOffering = courseOfferingsById.get(offeringId);
    const publication = gradePublications[offeringId];

    if (!selectedOffering || selectedOffering.status === "Cerrado" || !publication) {
      return false;
    }

    const classEnrollments = enrollments.filter((item) => item.offeringId === offeringId);

    setCourseOfferings((current) =>
      current.map((offering) =>
        offering.id === offeringId
          ? {
              ...offering,
              status: "Cerrado"
            }
          : offering
      )
    );

    setEnrollments((current) =>
      current.map((item) =>
        item.offeringId === offeringId
          ? {
              ...item,
              status: "Cerrada"
            }
          : item
      )
    );

    setAcademicRecords((current) => {
      const consolidated = classEnrollments.map((enrollment) => {
        const grade = publication.grades[enrollment.studentId];
        return {
          id: randomId("REC"),
          studentId: enrollment.studentId,
          courseId: selectedOffering.courseId,
          offeringId,
          term: selectedOffering.term,
          grade: Number.isFinite(grade) ? grade : 0
        };
      });

      return [...current.filter((record) => record.offeringId !== offeringId), ...consolidated];
    });

    return true;
  }

  function closeClass(offeringId) {
    closeOfferingWithConsolidation(offeringId);
  }

  function publishOffering(offeringId) {
    setCourseOfferings((current) =>
      current.map((offering) =>
        offering.id === offeringId && offering.status === "Borrador"
          ? {
              ...offering,
              status: "Publicado"
            }
          : offering
      )
    );
  }

  function activateOffering(offeringId) {
    setCourseOfferings((current) =>
      current.map((offering) =>
        offering.id === offeringId && offering.status === "Publicado"
          ? {
              ...offering,
              status: "Activo"
            }
          : offering
      )
    );
  }

  function closeOffering(offeringId) {
    closeOfferingWithConsolidation(offeringId);
  }

  function assignProfessorToOffering(offeringId, professorId) {
    const professorExists = professors.some((professor) => professor.id === professorId);
    if (!professorExists) {
      return;
    }

    setCourseOfferings((current) =>
      current.map((offering) =>
        offering.id === offeringId
          ? {
              ...offering,
              professorId
            }
          : offering
      )
    );
  }

  function createDraftOffering(payload) {
    const courseId = `${payload.baseCourseId ?? ""}`.trim();
    const careerId = `${payload.careerId ?? ""}`.trim();
    const section = `${payload.section ?? "A"}`.trim() || "A";
    const term = `${payload.term ?? CURRENT_TERM}`.trim() || CURRENT_TERM;
    const seatsTotal = Math.max(1, Number(payload.capacity) || 30);
    const professorId = `${payload.professorId ?? ""}`.trim() || null;

    if (!courseById.has(courseId) || !careerById.has(careerId)) {
      return false;
    }

    const offeringCodeRaw = `${payload.offeringCode ?? ""}`.trim();
    const offeringCode = offeringCodeRaw || nextOfferingCode(term, courseOfferings);

    const duplicateCode = courseOfferings.some((offering) => offering.offeringCode === offeringCode);
    if (duplicateCode) {
      return false;
    }

    setCourseOfferings((current) => [
      ...current,
      {
        id: randomId("OFF"),
        offeringCode,
        courseId,
        careerId,
        professorId,
        section,
        term,
        status: "Borrador",
        seatsTotal,
        seatsTaken: 0
      }
    ]);

    return true;
  }

  function createStudentRequest(type) {
    const requestType = type === "Cierre de pensum" ? "Cierre de pensum" : "Certificacion de cursos";
    const issuedAt = formatDate(new Date());

    setReportRequests((current) => {
      const requestId = nextRequestId(current);
      const createdRequest = {
        id: requestId,
        studentId: CURRENT_STUDENT_ID,
        studentName: currentStudent?.fullName ?? "Estudiante",
        requestType,
        requestedAt: issuedAt,
        issuedAt,
        downloadName: buildReportDownloadName(requestType, requestId)
      };

      downloadGeneratedReport(createdRequest);
      return [createdRequest, ...current];
    });
  }

  const value = {
    PASSING_GRADE,
    currentTerm: CURRENT_TERM,

    profile: uiProfiles.student,
    professorProfile: uiProfiles.professor,
    directorProfile: uiProfiles.director,

    studentCareer,
    studentCareerId,
    studentProfileDetails,
    studentCurriculum,
    approvedBaseCourseIds: Array.from(approvedBaseCourseIds),
    pendingCurriculumCourses,
    approvedCurriculumCount,
    pendingCurriculumCount,
    studentActiveOfferings,
    studentActiveCourses: studentActiveOfferings,
    availableOfferingsForEnrollment,
    availableCoursesForEnrollment: availableOfferingsForEnrollment,
    studentHistory,
    studentAverageGrade,

    careersCatalog,
    careersOptions,
    enrollCareer,
    enrollStudentInOffering,
    enrollStudentInCourse: enrollStudentInOffering,

    reportRequests,
    createStudentRequest,

    classGrades: gradeDrafts,
    professorClasses,
    professorClassStudents,
    professorStats,
    professorStudentsSummary,
    setDraftGrade,
    publishClassGrades,
    closeClass,

    directorCourses,
    coursesCatalog: directorCourses,
    directorStats,
    directorCapacity,
    directorProfessors,
    directorStudents,
    teacherAvailability,
    teachers,
    publishOffering,
    publishCourse: publishOffering,
    activateOffering,
    closeOffering,
    assignProfessorToOffering,
    createDraftOffering,
    createDraftCourse: createDraftOffering,

    baseCoursesCatalog: baseCourses.map((course) => ({
      id: course.id,
      code: course.code,
      name: course.name,
      department: course.department
    }))
  };

  return <AcademicDemoContext.Provider value={value}>{children}</AcademicDemoContext.Provider>;
}

export function useAcademicDemo() {
  const context = useContext(AcademicDemoContext);

  if (!context) {
    throw new Error("useAcademicDemo debe usarse dentro de AcademicDemoProvider");
  }

  return context;
}
