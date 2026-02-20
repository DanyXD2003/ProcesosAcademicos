import { getItems, getPagination, request } from "./client";

export async function getDashboard() {
  const response = await request("/api/v1/director/dashboard", {
    method: "GET"
  });

  return response.data;
}

export async function getCourses({ page = 1, pageSize = 10, status, careerId } = {}) {
  const response = await request("/api/v1/director/courses", {
    method: "GET",
    query: {
      page,
      pageSize,
      status,
      careerId
    }
  });

  return {
    items: getItems(response.data),
    pagination: getPagination(response.meta)
  };
}

export async function createCourse(payload) {
  const response = await request("/api/v1/director/courses", {
    method: "POST",
    body: payload
  });

  return response.data;
}

export async function publishCourse(offeringId) {
  const response = await request(`/api/v1/director/courses/${offeringId}/publish`, {
    method: "POST"
  });

  return response.data;
}

export async function activateCourse(offeringId) {
  const response = await request(`/api/v1/director/courses/${offeringId}/activate`, {
    method: "POST"
  });

  return response.data;
}

export async function closeCourse(offeringId) {
  const response = await request(`/api/v1/director/courses/${offeringId}/close`, {
    method: "POST"
  });

  return response.data;
}

export async function assignProfessor(offeringId, professorId) {
  const response = await request(`/api/v1/director/courses/${offeringId}/assign-professor`, {
    method: "POST",
    body: {
      professorId
    }
  });

  return response.data;
}

export async function getProfessors({ page = 1, pageSize = 10 } = {}) {
  const response = await request("/api/v1/director/professors", {
    method: "GET",
    query: {
      page,
      pageSize
    }
  });

  return {
    items: getItems(response.data),
    pagination: getPagination(response.meta)
  };
}

export async function getStudents({ page = 1, pageSize = 10 } = {}) {
  const response = await request("/api/v1/director/students", {
    method: "GET",
    query: {
      page,
      pageSize
    }
  });

  return {
    items: getItems(response.data),
    pagination: getPagination(response.meta)
  };
}

export async function getReportRequests({ page = 1, pageSize = 10, type } = {}) {
  const response = await request("/api/v1/director/report-requests", {
    method: "GET",
    query: {
      page,
      pageSize,
      type
    }
  });

  return {
    items: getItems(response.data),
    pagination: getPagination(response.meta)
  };
}

export async function getTeacherAvailability() {
  const response = await request("/api/v1/director/teacher-availability", {
    method: "GET"
  });

  return getItems(response.data);
}
