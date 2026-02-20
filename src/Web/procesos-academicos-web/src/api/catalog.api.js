import { getItems, request } from "./client";

export async function getCareers() {
  const response = await request("/api/v1/catalog/careers", {
    method: "GET"
  });

  return getItems(response.data);
}

export async function getBaseCourses(careerId) {
  const response = await request("/api/v1/catalog/base-courses", {
    method: "GET",
    query: {
      careerId
    }
  });

  return getItems(response.data);
}
