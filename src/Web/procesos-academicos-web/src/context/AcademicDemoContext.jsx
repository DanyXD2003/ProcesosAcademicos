import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import * as authApi from "../api/auth.api";
import * as catalogApi from "../api/catalog.api";
import { API_BASE_URL, configureApiClientAuth, getFunctionalCode, ApiClientError } from "../api/client";
import * as directorApi from "../api/director.api";
import * as professorApi from "../api/professor.api";
import * as studentApi from "../api/student.api";
import { clearSession, readSession, writeSession } from "./sessionStore";

const AcademicDemoContext = createContext(undefined);

const PASSING_GRADE = 61;
const DEFAULT_PAGE_SIZE = 10;
const API_MAX_PAGE_SIZE = 100;
const DEFAULT_TERM = `${new Date().getFullYear()}-1`;
const AUTH_SESSION_ERROR_CODES = new Set([
  "AUTH_INVALID_TOKEN",
  "AUTH_TOKEN_EXPIRED",
  "AUTH_REFRESH_INVALID",
  "AUTH_REFRESH_EXPIRED"
]);

const EMPTY_PROFILE = {
  initials: "--",
  name: "Sin sesion",
  subtitle: "No autenticado"
};

const EMPTY_PAGINATION = {
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  total: 0,
  totalPages: 1
};

function normalizeSearch(value) {
  return `${value ?? ""}`.toLowerCase().trim();
}

function safeUpper(value) {
  return `${value ?? ""}`.trim().toUpperCase();
}

function toIsoDateTime(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return `${value}`;
  }

  return date.toISOString();
}

function formatDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return `${value}`;
  }

  return date.toISOString().slice(0, 10);
}

function initialsFromName(name) {
  const words = `${name ?? ""}`
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return "--";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0] ?? ""}${words[1][0] ?? ""}`.toUpperCase();
}

function toUiProfile(currentUser, fallbackRoleLabel) {
  if (!currentUser) {
    return EMPTY_PROFILE;
  }

  const roleLabel = currentUser.roleLabel ?? fallbackRoleLabel ?? "Usuario";
  const subtitle = currentUser.roleCode === "ESTUDIANTE"
    ? `${roleLabel} ${currentUser.careerId ? "con carrera activa" : "sin carrera"}`
    : roleLabel;

  return {
    initials: initialsFromName(currentUser.displayName),
    name: currentUser.displayName ?? "Usuario",
    subtitle
  };
}

function buildPagination(total, page, pageSize) {
  const safePageSize = Math.max(1, Number.isFinite(Number(pageSize)) ? Number(pageSize) : DEFAULT_PAGE_SIZE);
  const safeTotal = Math.max(0, Number.isFinite(Number(total)) ? Number(total) : 0);
  const totalPages = Math.max(1, Math.ceil(safeTotal / safePageSize));
  const safePage = Math.min(Math.max(1, Number.isFinite(Number(page)) ? Number(page) : 1), totalPages);

  return {
    page: safePage,
    pageSize: safePageSize,
    total: safeTotal,
    totalPages
  };
}

function pageItems(items, page = 1, pageSize = DEFAULT_PAGE_SIZE) {
  const source = Array.isArray(items) ? items : [];
  const pagination = buildPagination(source.length, page, pageSize);
  const start = (pagination.page - 1) * pagination.pageSize;

  return {
    items: source.slice(start, start + pagination.pageSize),
    pagination
  };
}

function mapCareerOption(item) {
  return {
    id: item.careerId,
    code: item.careerCode,
    name: item.careerName,
    isActive: Boolean(item.isActive)
  };
}

function mapBaseCourseOption(item) {
  return {
    id: item.courseId,
    code: item.courseCode,
    name: item.courseName,
    department: item.department
  };
}

function mapStudentCourseRow(item) {
  return {
    offeringId: item.courseOfferingId,
    offeringCode: item.offeringCode,
    baseCourseCode: item.baseCourseCode,
    course: item.courseName,
    term: item.term,
    career: item.careerName,
    section: item.section,
    professor: item.professorName,
    seatsTaken: item.seatsTaken,
    seatsTotal: item.seatsTotal,
    seats: `${item.seatsTaken}/${item.seatsTotal}`,
    status: item.status
  };
}

function mapAcademicRecordRow(item, index) {
  return {
    id: `${item.code}-${item.period}-${index}`,
    code: item.code,
    subject: item.subject,
    period: item.period,
    credits: item.credits ?? "-",
    grade: Number.isFinite(Number(item.grade)) ? Number(item.grade).toFixed(1) : `${item.grade ?? "-"}`,
    status: item.status
  };
}

function mapProfessorClass(item) {
  return {
    id: item.classId,
    offeringId: item.courseOfferingId,
    offeringCode: item.offeringCode,
    code: item.baseCourseCode,
    title: item.title,
    term: item.term,
    section: item.section ?? "-",
    status: item.status,
    gradesPublished: Boolean(item.gradesPublished),
    studentsCount: Number(item.studentsCount ?? 0),
    progressPercent: Number(item.progressPercent ?? 0)
  };
}

function mapProfessorStudent(student) {
  return {
    id: student.studentId,
    studentCode: student.studentCode ?? student.studentId.slice(0, 8),
    name: student.studentName,
    career: student.careerName,
    gradeDraft: student.gradeDraft,
    gradePublished: student.gradePublished
  };
}

function mapDirectorCourse(item) {
  return {
    offeringId: item.courseOfferingId,
    offeringCode: item.offeringCode,
    baseCourseCode: item.baseCourseCode,
    course: item.courseName,
    career: item.careerName,
    term: item.term,
    section: item.section,
    professorId: item.professorId,
    professor: item.professorName,
    seatsTaken: item.seatsTaken,
    seatsTotal: item.seatsTotal,
    seats: `${item.seatsTaken}/${item.seatsTotal}`,
    gradesPublished: Boolean(item.gradesPublished),
    status: item.status
  };
}

function mapTeacherAvailability(item) {
  return {
    professorId: item.professorId,
    name: item.name,
    speciality: item.speciality ?? "Sin especialidad",
    status: item.status
  };
}

function mapTeacherStatusForAssign(status) {
  if (status === "Libre") {
    return "Disponible";
  }

  if (status === "En clase") {
    return "Carga media";
  }

  return "No disponible";
}

function mapDirectorProfessor(item) {
  const loadAssigned = Number(item.loadAssigned ?? 0);
  const loadMax = Number(item.loadMax ?? 5);

  return {
    professorId: item.professorId,
    professorCode: item.professorCode,
    name: item.name,
    department: item.department,
    loadAssigned,
    loadMax,
    load: loadAssigned
  };
}

function mapDirectorStudent(item) {
  return {
    studentId: item.studentId,
    studentCode: item.studentCode,
    name: item.name,
    program: item.program,
    semester: item.semester,
    average: Number.isFinite(Number(item.average0to100)) ? Number(item.average0to100).toFixed(1) : "-"
  };
}

function mapDirectorReport(item) {
  return {
    id: item.requestId,
    studentName: item.studentName,
    requestType: item.requestType,
    requestedAt: formatDate(item.requestedAt),
    issuedAt: item.issuedAt ? formatDate(item.issuedAt) : "",
    downloadedAt: item.downloadedAt ? formatDate(item.downloadedAt) : "",
    downloadsCount: Number(item.downloadsCount ?? 0)
  };
}

function mapProfessorSummary(item) {
  return {
    studentId: item.studentId,
    studentCode: item.studentCode,
    name: item.name,
    career: item.career,
    approvedAverage: Number.isFinite(Number(item.approvedAverage)) ? Number(item.approvedAverage).toFixed(1) : "-"
  };
}

function resolveUserFacingError(error, fallback = "No fue posible completar la operacion.") {
  if (error instanceof ApiClientError) {
    if (error.code === "NETWORK_ERROR") {
      return "No fue posible conectar con el backend. Verifica que la API este corriendo y CORS configurado.";
    }

    return error.message || fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

function isAuthenticationError(error) {
  if (!(error instanceof ApiClientError)) {
    return false;
  }

  return error.status === 401 || AUTH_SESSION_ERROR_CODES.has(error.code);
}

async function fetchAllPages(fetchPage, baseQuery = {}) {
  const firstPage = await fetchPage({
    ...baseQuery,
    page: 1,
    pageSize: API_MAX_PAGE_SIZE
  });

  const firstItems = Array.isArray(firstPage?.items) ? firstPage.items : [];
  const firstPagination = firstPage?.pagination ?? EMPTY_PAGINATION;
  const parsedTotalPages = Number(firstPagination.totalPages);
  const totalPages = Number.isFinite(parsedTotalPages) ? Math.max(1, parsedTotalPages) : 1;

  if (totalPages <= 1) {
    return firstItems;
  }

  const allItems = [...firstItems];

  for (let page = 2; page <= totalPages; page += 1) {
    const nextPage = await fetchPage({
      ...baseQuery,
      page,
      pageSize: API_MAX_PAGE_SIZE
    });

    if (Array.isArray(nextPage?.items) && nextPage.items.length > 0) {
      allItems.push(...nextPage.items);
    }
  }

  return allItems;
}

function showActionError(error, fallback) {
  const message = resolveUserFacingError(error, fallback);

  if (typeof window !== "undefined") {
    window.alert(message);
  }
}

function roleOf(session) {
  return session?.currentUser?.roleCode ?? "";
}

function emptyStudentProfile() {
  return {
    fullName: "",
    studentId: "",
    program: "",
    faculty: "",
    semester: "-",
    career: "",
    email: "",
    phone: ""
  };
}

function toSessionFromAuthResponse(authResponse) {
  const expiresIn = Number(authResponse?.expiresIn ?? 1800);

  return {
    accessToken: authResponse.accessToken,
    refreshToken: authResponse.refreshToken,
    expiresAt: new Date(Date.now() + Math.max(60, expiresIn) * 1000).toISOString(),
    currentUser: authResponse.user
  };
}

export function AcademicDemoProvider({ children }) {
  const [session, setSession] = useState(() => readSession());
  const sessionRef = useRef(session);

  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [authError, setAuthError] = useState("");

  const [careersOptions, setCareersOptions] = useState([]);
  const [baseCoursesCatalog, setBaseCoursesCatalog] = useState([]);

  const [studentCareer, setStudentCareer] = useState("");
  const [studentCareerId, setStudentCareerId] = useState("");
  const [studentProfileDetails, setStudentProfileDetails] = useState(emptyStudentProfile());
  const [studentCurriculum, setStudentCurriculum] = useState([]);
  const [approvedBaseCourseIds, setApprovedBaseCourseIds] = useState([]);
  const [pendingCurriculumCourses, setPendingCurriculumCourses] = useState([]);
  const [approvedCurriculumCount, setApprovedCurriculumCount] = useState(0);
  const [pendingCurriculumCount, setPendingCurriculumCount] = useState(0);
  const [studentActiveOfferings, setStudentActiveOfferings] = useState([]);
  const [availableOfferingsForEnrollment, setAvailableOfferingsForEnrollment] = useState([]);
  const [studentHistory, setStudentHistory] = useState([]);
  const [studentAverageGrade, setStudentAverageGrade] = useState("0.0");
  const [reportRequests, setReportRequests] = useState([]);

  const [professorClasses, setProfessorClasses] = useState([]);
  const [professorClassStudents, setProfessorClassStudents] = useState({});
  const [classGrades, setClassGrades] = useState({});
  const [gradeCompletionByOfferingId, setGradeCompletionByOfferingId] = useState({});
  const [professorStats, setProfessorStats] = useState({
    activeCourses: 0,
    pendingGrades: 0,
    students: 0
  });
  const [professorStudentsSummary, setProfessorStudentsSummary] = useState([]);

  const [directorCourses, setDirectorCourses] = useState([]);
  const [directorStats, setDirectorStats] = useState({
    totalStudents: 0,
    totalProfessors: 0,
    activeClasses: 0,
    pendingClasses: 0
  });
  const [directorCapacity, setDirectorCapacity] = useState({
    activeStudents: 0,
    pendingCapacity: 0,
    totalCapacity: 0
  });
  const [directorProfessors, setDirectorProfessors] = useState([]);
  const [directorStudents, setDirectorStudents] = useState([]);
  const [directorReportRequests, setDirectorReportRequests] = useState([]);
  const [teacherAvailability, setTeacherAvailability] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [currentTerm, setCurrentTerm] = useState(DEFAULT_TERM);

  const resetRoleData = useCallback(() => {
    setCareersOptions([]);
    setBaseCoursesCatalog([]);

    setStudentCareer("");
    setStudentCareerId("");
    setStudentProfileDetails(emptyStudentProfile());
    setStudentCurriculum([]);
    setApprovedBaseCourseIds([]);
    setPendingCurriculumCourses([]);
    setApprovedCurriculumCount(0);
    setPendingCurriculumCount(0);
    setStudentActiveOfferings([]);
    setAvailableOfferingsForEnrollment([]);
    setStudentHistory([]);
    setStudentAverageGrade("0.0");
    setReportRequests([]);

    setProfessorClasses([]);
    setProfessorClassStudents({});
    setClassGrades({});
    setGradeCompletionByOfferingId({});
    setProfessorStats({
      activeCourses: 0,
      pendingGrades: 0,
      students: 0
    });
    setProfessorStudentsSummary([]);

    setDirectorCourses([]);
    setDirectorStats({
      totalStudents: 0,
      totalProfessors: 0,
      activeClasses: 0,
      pendingClasses: 0
    });
    setDirectorCapacity({
      activeStudents: 0,
      pendingCapacity: 0,
      totalCapacity: 0
    });
    setDirectorProfessors([]);
    setDirectorStudents([]);
    setDirectorReportRequests([]);
    setTeacherAvailability([]);
    setTeachers([]);

    setCurrentTerm(DEFAULT_TERM);
  }, []);

  const applySession = useCallback((nextSession) => {
    sessionRef.current = nextSession;
    setSession(nextSession);

    if (nextSession) {
      writeSession(nextSession);
    } else {
      clearSession();
    }
  }, []);

  const clearCurrentSession = useCallback((resetData = true) => {
    applySession(null);

    if (resetData) {
      resetRoleData();
    }
  }, [applySession, resetRoleData]);

  useEffect(() => {
    configureApiClientAuth({
      getSession: () => sessionRef.current,
      onSessionRefreshed: (nextSession) => {
        applySession(nextSession);
      },
      onSessionInvalid: () => {
        clearCurrentSession();
      }
    });
  }, [applySession, clearCurrentSession]);

  const loadStudentData = useCallback(async () => {
    const [profileDto, dashboardDto, curriculumDto, careersDto] = await Promise.all([
      studentApi.getProfile(),
      studentApi.getDashboard(),
      studentApi.getCurriculumProgress(),
      catalogApi.getCareers()
    ]);

    const [activeCoursesResult, availableCoursesResult, academicRecordResult] = await Promise.allSettled([
      fetchAllPages(studentApi.getActiveCourses),
      fetchAllPages(studentApi.getAvailableCourses),
      fetchAllPages(studentApi.getAcademicRecord)
    ]);

    const careerId = profileDto.careerId ?? "";

    let baseCoursesDto = [];
    if (careerId) {
      try {
        baseCoursesDto = await catalogApi.getBaseCourses(careerId);
      } catch {
        baseCoursesDto = [];
      }
    }

    const baseCourseMap = new Map(baseCoursesDto.map((course) => [safeUpper(course.courseId), course]));

    const activeCourseItems = activeCoursesResult.status === "fulfilled" ? activeCoursesResult.value : [];
    const availableCourseItems = availableCoursesResult.status === "fulfilled" ? availableCoursesResult.value : [];
    const academicRecordItems = academicRecordResult.status === "fulfilled" ? academicRecordResult.value : [];

    const careers = careersDto.map(mapCareerOption);
    const activeRows = activeCourseItems.map(mapStudentCourseRow);
    const availableRows = availableCourseItems.map(mapStudentCourseRow);
    const historyRows = academicRecordItems.map(mapAcademicRecordRow);

    const pendingCourseRows = (curriculumDto.pendingCourseIds ?? []).map((courseId) => {
      const courseInfo = baseCourseMap.get(safeUpper(courseId));

      return {
        courseId,
        code: courseInfo?.courseCode ?? courseId.slice(0, 8),
        subject: courseInfo?.courseName ?? "Curso pendiente",
        termNumber: "-"
      };
    });

    setCareersOptions(careers);
    setBaseCoursesCatalog(baseCoursesDto.map(mapBaseCourseOption));

    setStudentCareer(profileDto.careerName ?? "");
    setStudentCareerId(careerId);
    setStudentProfileDetails({
      fullName: profileDto.fullName,
      studentId: profileDto.studentId,
      program: profileDto.program,
      faculty: profileDto.faculty ?? "",
      semester: profileDto.semester ?? "-",
      career: profileDto.careerName ?? "Sin carrera",
      email: profileDto.email,
      phone: profileDto.phone ?? ""
    });

    setStudentCurriculum(pendingCourseRows);
    setApprovedBaseCourseIds(curriculumDto.approvedCourseIds ?? []);
    setPendingCurriculumCourses(pendingCourseRows);
    setApprovedCurriculumCount(Number(curriculumDto.approved ?? dashboardDto.approvedCourses ?? 0));
    setPendingCurriculumCount(Number(curriculumDto.pending ?? dashboardDto.pendingCourses ?? 0));

    setStudentActiveOfferings(activeRows);
    setAvailableOfferingsForEnrollment(availableRows);
    setStudentHistory(historyRows);
    setStudentAverageGrade(Number.isFinite(Number(dashboardDto.averageGrade)) ? Number(dashboardDto.averageGrade).toFixed(1) : "0.0");
  }, []);

  const loadProfessorData = useCallback(async () => {
    const [dashboardDto, classItems] = await Promise.all([
      professorApi.getDashboard(),
      fetchAllPages(professorApi.getClasses)
    ]);

    let studentsSummaryItems = [];

    try {
      studentsSummaryItems = await fetchAllPages(professorApi.getStudents);
    } catch (error) {
      if (isAuthenticationError(error)) {
        throw error;
      }

      studentsSummaryItems = [];
    }

    const classRows = classItems.map(mapProfessorClass);

    const classStudentsResults = await Promise.allSettled(
      classRows.map((course) => professorApi.getClassStudents(course.id))
    );
    const studentsMap = {};

    for (let index = 0; index < classRows.length; index += 1) {
      const course = classRows[index];
      const classStudentsResult = classStudentsResults[index];

      if (classStudentsResult?.status === "fulfilled") {
        studentsMap[course.id] = (classStudentsResult.value.students ?? []).map(mapProfessorStudent);
        continue;
      }

      const error = classStudentsResult?.reason;

      if (isAuthenticationError(error)) {
        throw error;
      }

      studentsMap[course.id] = [];
    }

    const gradesMap = {};
    const completionMap = {};

    classRows.forEach((course) => {
      const students = studentsMap[course.id] ?? [];

      const rowGrades = {};
      let gradedCount = 0;

      students.forEach((student) => {
        const value = Number.isFinite(Number(student.gradeDraft))
          ? Number(student.gradeDraft)
          : Number.isFinite(Number(student.gradePublished))
            ? Number(student.gradePublished)
            : null;

        if (Number.isFinite(value)) {
          rowGrades[student.id] = value;
          gradedCount++;
        }
      });

      gradesMap[course.id] = rowGrades;
      completionMap[course.id] = {
        total: students.length,
        graded: gradedCount,
        missing: Math.max(students.length - gradedCount, 0)
      };
    });

    setProfessorClasses(classRows);
    setProfessorClassStudents(studentsMap);
    setClassGrades(gradesMap);
    setGradeCompletionByOfferingId(completionMap);

    setProfessorStats({
      activeCourses: Number(dashboardDto.stats?.activeCourses ?? 0),
      pendingGrades: Number(dashboardDto.stats?.pendingGrades ?? 0),
      students: Number(dashboardDto.stats?.students ?? 0)
    });

    setProfessorStudentsSummary(studentsSummaryItems.map(mapProfessorSummary));
  }, []);

  const loadDirectorData = useCallback(async () => {
    const [dashboardDto, courseItems, careersDto, baseCoursesDto, professorItems, studentItems, reportRequestItems, teacherAvailabilityRows] = await Promise.all([
      directorApi.getDashboard(),
      fetchAllPages(directorApi.getCourses),
      catalogApi.getCareers(),
      catalogApi.getBaseCourses(),
      fetchAllPages(directorApi.getProfessors),
      fetchAllPages(directorApi.getStudents),
      fetchAllPages(directorApi.getReportRequests),
      directorApi.getTeacherAvailability()
    ]);

    const courses = courseItems.map(mapDirectorCourse);
    const professorRows = professorItems.map(mapDirectorProfessor);
    const availabilityRows = teacherAvailabilityRows.map(mapTeacherAvailability);

    const availabilityByProfessorId = new Map(availabilityRows.map((row) => [row.professorId, row]));
    const teacherRows = professorRows.map((professor) => {
      const availability = availabilityByProfessorId.get(professor.professorId);

      return {
        id: professor.professorId,
        name: professor.name,
        speciality: availability?.speciality ?? professor.department,
        status: mapTeacherStatusForAssign(availability?.status)
      };
    });

    const primaryTerm = courses[0]?.term ?? DEFAULT_TERM;

    setCurrentTerm(primaryTerm);
    setCareersOptions(careersDto.map(mapCareerOption));
    setBaseCoursesCatalog(baseCoursesDto.map(mapBaseCourseOption));

    setDirectorCourses(courses);
    setDirectorStats({
      totalStudents: Number(dashboardDto.stats?.totalStudents ?? 0),
      totalProfessors: Number(dashboardDto.stats?.totalProfessors ?? 0),
      activeClasses: Number(dashboardDto.stats?.activeClasses ?? 0),
      pendingClasses: Number(dashboardDto.stats?.pendingClasses ?? 0)
    });
    setDirectorCapacity({
      activeStudents: Number(dashboardDto.capacity?.activeStudents ?? 0),
      pendingCapacity: Number(dashboardDto.capacity?.pendingCapacity ?? 0),
      totalCapacity: Number(dashboardDto.capacity?.totalCapacity ?? 0)
    });

    setDirectorProfessors(professorRows);
    setDirectorStudents(studentItems.map(mapDirectorStudent));
    setDirectorReportRequests(reportRequestItems.map(mapDirectorReport));
    setTeacherAvailability(availabilityRows);
    setTeachers(teacherRows);
  }, []);

  const loadRoleData = useCallback(async (roleCode) => {
    if (!roleCode) {
      return;
    }

    setIsLoadingData(true);

    try {
      if (roleCode === "ESTUDIANTE") {
        await loadStudentData();
      }

      if (roleCode === "PROFESOR") {
        await loadProfessorData();
      }

      if (roleCode === "DIRECTOR") {
        await loadDirectorData();
      }

      setAuthError("");
    } finally {
      setIsLoadingData(false);
    }
  }, [loadDirectorData, loadProfessorData, loadStudentData]);

  useEffect(() => {
    let disposed = false;

    async function bootstrap() {
      const savedSession = readSession();

      if (!savedSession) {
        if (!disposed) {
          setIsBootstrapping(false);
        }
        return;
      }

      applySession(savedSession);

      try {
        const currentUser = await authApi.me();
        const mergedSession = {
          ...savedSession,
          currentUser
        };

        applySession(mergedSession);

        await loadRoleData(currentUser.roleCode);
      } catch (error) {
        if (isAuthenticationError(error)) {
          clearCurrentSession();
          setAuthError(resolveUserFacingError(error, "Tu sesion no es valida, inicia sesion nuevamente."));
        } else {
          setAuthError(resolveUserFacingError(error, "No se pudieron cargar todos tus datos. Intenta refrescar."));
        }
      } finally {
        if (!disposed) {
          setIsBootstrapping(false);
        }
      }
    }

    bootstrap();

    return () => {
      disposed = true;
    };
  }, [applySession, clearCurrentSession, loadRoleData]);

  const login = useCallback(async ({ usernameOrEmail, password }) => {
    setAuthError("");

    const authSession = await authApi.login({ usernameOrEmail, password });
    const sessionPayload = toSessionFromAuthResponse(authSession);

    applySession(sessionPayload);
    await loadRoleData(sessionPayload.currentUser.roleCode);

    return sessionPayload.currentUser;
  }, [applySession, loadRoleData]);

  const logout = useCallback(async () => {
    const current = sessionRef.current;

    try {
      if (current?.refreshToken) {
        await authApi.logout(current.refreshToken);
      }
    } catch {
      // ignore logout network or token failures; local cleanup still applies
    }

    setAuthError("");
    clearCurrentSession();
  }, [clearCurrentSession]);

  const enrollCareer = useCallback(async (careerId) => {
    try {
      await studentApi.enrollCareer(careerId);
      await loadStudentData();
      return true;
    } catch (error) {
      showActionError(error, "No se pudo inscribir la carrera.");
      return false;
    }
  }, [loadStudentData]);

  const enrollStudentInOffering = useCallback(async (offeringId) => {
    try {
      await studentApi.enrollCourse(offeringId);
      await loadStudentData();
      return true;
    } catch (error) {
      showActionError(error, "No se pudo completar la inscripcion del curso.");
      return false;
    }
  }, [loadStudentData]);

  const createStudentRequest = useCallback(async (requestType) => {
    try {
      const created = await studentApi.createReportRequest(requestType);

      setReportRequests((current) => [
        {
          id: created.requestId,
          studentName: sessionRef.current?.currentUser?.displayName ?? "Estudiante",
          requestType: created.requestType,
          requestedAt: formatDate(created.requestedAt),
          issuedAt: formatDate(created.issuedAt)
        },
        ...current
      ]);

      if (created.downloadUrl && typeof window !== "undefined") {
        const normalizedUrl = created.downloadUrl.startsWith("http://") || created.downloadUrl.startsWith("https://")
          ? created.downloadUrl
          : `${API_BASE_URL}${created.downloadUrl.startsWith("/") ? "" : "/"}${created.downloadUrl}`;

        window.open(normalizedUrl, "_blank", "noopener,noreferrer");
      }

      return true;
    } catch (error) {
      showActionError(error, "No se pudo generar la solicitud de reporte.");
      return false;
    }
  }, []);

  const setDraftGrade = useCallback((classId, studentId, nextGrade) => {
    const normalizedInput = `${nextGrade ?? ""}`.trim();
    const parsedGrade = normalizedInput.length > 0 ? Number(normalizedInput) : Number.NaN;
    const numericGrade = Number.isFinite(parsedGrade)
      ? Math.max(0, Math.min(100, parsedGrade))
      : Number.NaN;

    setClassGrades((current) => {
      const classRows = {
        ...(current[classId] ?? {})
      };

      if (Number.isFinite(numericGrade)) {
        classRows[studentId] = numericGrade;
      } else {
        delete classRows[studentId];
      }

      return {
        ...current,
        [classId]: classRows
      };
    });

    setGradeCompletionByOfferingId((current) => {
      const students = professorClassStudents[classId] ?? [];
      const total = students.length;
      const nextGrades = {
        ...(classGrades[classId] ?? {})
      };

      if (Number.isFinite(numericGrade)) {
        nextGrades[studentId] = numericGrade;
      } else {
        delete nextGrades[studentId];
      }

      const graded = students.filter((student) => Number.isFinite(Number(nextGrades[student.id]))).length;

      return {
        ...current,
        [classId]: {
          total,
          graded,
          missing: Math.max(total - graded, 0)
        }
      };
    });
  }, [classGrades, professorClassStudents]);

  const publishClassGrades = useCallback(async (classId) => {
    try {
      const classStudents = professorClassStudents[classId] ?? [];
      const gradesMap = classGrades[classId] ?? {};

      const payload = classStudents
        .map((student) => {
          const grade = Number(gradesMap[student.id]);

          if (!Number.isFinite(grade)) {
            return null;
          }

          return {
            studentId: student.id,
            grade
          };
        })
        .filter(Boolean);

      await professorApi.upsertDraftGrades(classId, payload);
      await professorApi.publishGrades(classId);
      await loadProfessorData();
      return true;
    } catch (error) {
      showActionError(error, "No se pudieron publicar las notas.");
      return false;
    }
  }, [classGrades, loadProfessorData, professorClassStudents]);

  const closeClass = useCallback(async (classId) => {
    try {
      await professorApi.closeClass(classId);
      await loadProfessorData();
      return true;
    } catch (error) {
      showActionError(error, "No se pudo cerrar el curso.");
      return false;
    }
  }, [loadProfessorData]);

  const publishOffering = useCallback(async (offeringId) => {
    try {
      await directorApi.publishCourse(offeringId);
      await loadDirectorData();
      return true;
    } catch (error) {
      showActionError(error, "No se pudo publicar la oferta.");
      return false;
    }
  }, [loadDirectorData]);

  const activateOffering = useCallback(async (offeringId) => {
    try {
      await directorApi.activateCourse(offeringId);
      await loadDirectorData();
      return true;
    } catch (error) {
      showActionError(error, "No se pudo activar la oferta.");
      return false;
    }
  }, [loadDirectorData]);

  const closeOffering = useCallback(async (offeringId) => {
    try {
      await directorApi.closeCourse(offeringId);
      await loadDirectorData();
      return true;
    } catch (error) {
      showActionError(error, "No se pudo cerrar la oferta.");
      return false;
    }
  }, [loadDirectorData]);

  const assignProfessorToOffering = useCallback(async (offeringId, professorId) => {
    try {
      await directorApi.assignProfessor(offeringId, professorId);
      await loadDirectorData();
      return true;
    } catch (error) {
      showActionError(error, "No se pudo asignar el profesor.");
      return false;
    }
  }, [loadDirectorData]);

  const createDraftOffering = useCallback(async (payload) => {
    try {
      const response = await directorApi.createCourse({
        baseCourseId: payload.baseCourseId,
        careerId: payload.careerId,
        section: payload.section,
        term: payload.term,
        professorId: payload.professorId ? payload.professorId : null,
        capacity: Number(payload.capacity),
        offeringCode: payload.offeringCode ? payload.offeringCode : null
      });

      await loadDirectorData();

      return {
        ok: true,
        offeringId: response.courseOfferingId
      };
    } catch (error) {
      return {
        ok: false,
        code: getFunctionalCode(error)
      };
    }
  }, [loadDirectorData]);

  const getStudentActiveOfferingsPage = useCallback(({ search, page = 1, pageSize = DEFAULT_PAGE_SIZE } = {}) => {
    const term = normalizeSearch(search);
    const items = term
      ? studentActiveOfferings.filter((course) => normalizeSearch(`${course.offeringCode} ${course.baseCourseCode} ${course.course} ${course.professor}`).includes(term))
      : studentActiveOfferings;

    return pageItems(items, page, pageSize);
  }, [studentActiveOfferings]);

  const getStudentAvailableOfferingsPage = useCallback(({ search, page = 1, pageSize = DEFAULT_PAGE_SIZE } = {}) => {
    const term = normalizeSearch(search);
    const items = term
      ? availableOfferingsForEnrollment.filter((course) => normalizeSearch(`${course.offeringCode} ${course.baseCourseCode} ${course.course} ${course.professor}`).includes(term))
      : availableOfferingsForEnrollment;

    return pageItems(items, page, pageSize);
  }, [availableOfferingsForEnrollment]);

  const getStudentHistoryPage = useCallback(({ page = 1, pageSize = DEFAULT_PAGE_SIZE } = {}) => {
    return pageItems(studentHistory, page, pageSize);
  }, [studentHistory]);

  const getProfessorClassesPage = useCallback(({ page = 1, pageSize = DEFAULT_PAGE_SIZE } = {}) => {
    return pageItems(professorClasses, page, pageSize);
  }, [professorClasses]);

  const getProfessorStudentsSummaryPage = useCallback(({ page = 1, pageSize = DEFAULT_PAGE_SIZE } = {}) => {
    return pageItems(professorStudentsSummary, page, pageSize);
  }, [professorStudentsSummary]);

  const getDirectorCoursesPage = useCallback(({ page = 1, pageSize = DEFAULT_PAGE_SIZE, status, careerId, search } = {}) => {
    const normalizedStatus = `${status ?? ""}`.trim();
    const normalizedCareerId = `${careerId ?? ""}`.trim();
    const query = normalizeSearch(search);

    let items = directorCourses;

    if (normalizedStatus) {
      items = items.filter((item) => item.status === normalizedStatus);
    }

    if (normalizedCareerId) {
      items = items.filter((item) => {
        const career = careersOptions.find((careerOption) => careerOption.id === normalizedCareerId);

        if (!career) {
          return false;
        }

        return item.career === career.name;
      });
    }

    if (query) {
      items = items.filter((item) =>
        normalizeSearch(`${item.offeringCode} ${item.baseCourseCode} ${item.course} ${item.professor} ${item.career} ${item.term}`).includes(query)
      );
    }

    return pageItems(items, page, pageSize);
  }, [careersOptions, directorCourses]);

  const getDirectorProfessorsPage = useCallback(({ page = 1, pageSize = DEFAULT_PAGE_SIZE } = {}) => {
    return pageItems(directorProfessors, page, pageSize);
  }, [directorProfessors]);

  const getDirectorStudentsPage = useCallback(({ page = 1, pageSize = DEFAULT_PAGE_SIZE } = {}) => {
    return pageItems(directorStudents, page, pageSize);
  }, [directorStudents]);

  const getDirectorReportRequestsPage = useCallback(({ page = 1, pageSize = DEFAULT_PAGE_SIZE } = {}) => {
    return pageItems(directorReportRequests, page, pageSize);
  }, [directorReportRequests]);

  const isAuthenticated = Boolean(session?.accessToken);
  const currentUser = session?.currentUser ?? null;

  const profile = useMemo(() => toUiProfile(currentUser, "Estudiante"), [currentUser]);
  const professorProfile = useMemo(() => toUiProfile(currentUser, "Profesor"), [currentUser]);
  const directorProfile = useMemo(() => toUiProfile(currentUser, "Director"), [currentUser]);

  const value = {
    PASSING_GRADE,
    currentTerm,

    isBootstrapping,
    isLoadingData,
    isAuthenticated,
    currentUser,
    authError,

    login,
    logout,

    profile,
    professorProfile,
    directorProfile,

    studentCareer,
    studentCareerId,
    studentProfileDetails,
    studentCurriculum,
    approvedBaseCourseIds,
    pendingCurriculumCourses,
    approvedCurriculumCount,
    pendingCurriculumCount,
    studentActiveOfferings,
    studentActiveCourses: studentActiveOfferings,
    getStudentActiveOfferingsPage,
    availableOfferingsForEnrollment,
    availableCoursesForEnrollment: availableOfferingsForEnrollment,
    getStudentAvailableOfferingsPage,
    studentHistory,
    getStudentHistoryPage,
    studentAverageGrade,

    careersCatalog: careersOptions.map((career) => career.name),
    careersOptions,
    enrollCareer,
    enrollStudentInOffering,
    enrollStudentInCourse: enrollStudentInOffering,

    reportRequests,
    createStudentRequest,

    classGrades,
    gradeCompletionByOfferingId,
    professorClasses,
    professorClassStudents,
    professorStats,
    professorStudentsSummary,
    getProfessorClassesPage,
    getProfessorStudentsSummaryPage,
    setDraftGrade,
    publishClassGrades,
    closeClass,

    directorCourses,
    getDirectorCoursesPage,
    coursesCatalog: directorCourses,
    directorStats,
    directorCapacity,
    directorProfessors,
    getDirectorProfessorsPage,
    directorStudents,
    getDirectorStudentsPage,
    getDirectorReportRequestsPage,
    teacherAvailability,
    teachers,
    publishOffering,
    publishCourse: publishOffering,
    activateOffering,
    closeOffering,
    assignProfessorToOffering,
    createDraftOffering,
    createDraftCourse: createDraftOffering,

    baseCoursesCatalog
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
