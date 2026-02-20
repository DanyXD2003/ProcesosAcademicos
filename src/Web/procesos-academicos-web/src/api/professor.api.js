import { getItems, getPagination, request } from "./client";

export async function getDashboard() {
  const response = await request("/api/v1/professor/dashboard", {
    method: "GET"
  });

  return response.data;
}

export async function getClasses({ page = 1, pageSize = 10 } = {}) {
  const response = await request("/api/v1/professor/classes", {
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

export async function getClassStudents(classId) {
  const response = await request(`/api/v1/professor/classes/${classId}/students`, {
    method: "GET"
  });

  return response.data;
}

export async function upsertDraftGrades(classId, grades) {
  const response = await request(`/api/v1/professor/classes/${classId}/grades/draft`, {
    method: "PUT",
    body: {
      grades
    }
  });

  return response.data;
}

export async function publishGrades(classId) {
  const response = await request(`/api/v1/professor/classes/${classId}/grades/publish`, {
    method: "POST"
  });

  return response.data;
}

export async function closeClass(classId) {
  const response = await request(`/api/v1/professor/classes/${classId}/close`, {
    method: "POST"
  });

  return response.data;
}

export async function getStudents({ page = 1, pageSize = 10 } = {}) {
  const response = await request("/api/v1/professor/students", {
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
