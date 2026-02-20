import { getItems, getPagination, request } from "./client";

export async function getProfile() {
  const response = await request("/api/v1/student/profile", {
    method: "GET"
  });

  return response.data;
}

export async function enrollCareer(careerId) {
  const response = await request("/api/v1/student/career-enrollment", {
    method: "POST",
    body: {
      careerId
    }
  });

  return response.data;
}

export async function getDashboard() {
  const response = await request("/api/v1/student/dashboard", {
    method: "GET"
  });

  return response.data;
}

export async function getAvailableCourses({ page = 1, pageSize = 10, search } = {}) {
  const response = await request("/api/v1/student/courses/available", {
    method: "GET",
    query: {
      page,
      pageSize,
      search
    }
  });

  return {
    items: getItems(response.data),
    pagination: getPagination(response.meta)
  };
}

export async function getActiveCourses({ page = 1, pageSize = 10, search } = {}) {
  const response = await request("/api/v1/student/courses/active", {
    method: "GET",
    query: {
      page,
      pageSize,
      search
    }
  });

  return {
    items: getItems(response.data),
    pagination: getPagination(response.meta)
  };
}

export async function enrollCourse(offeringId) {
  const response = await request(`/api/v1/student/courses/${offeringId}/enroll`, {
    method: "POST"
  });

  return response.data;
}

export async function getAcademicRecord({ page = 1, pageSize = 10 } = {}) {
  const response = await request("/api/v1/student/academic-record", {
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

export async function createReportRequest(requestType) {
  const response = await request("/api/v1/student/report-requests", {
    method: "POST",
    body: {
      requestType
    }
  });

  return response.data;
}

export async function getCurriculumProgress() {
  const response = await request("/api/v1/student/curriculum/progress", {
    method: "GET"
  });

  return response.data;
}
