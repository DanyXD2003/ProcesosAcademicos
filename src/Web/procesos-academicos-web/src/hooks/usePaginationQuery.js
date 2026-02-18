import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function usePaginationQuery(totalItems, pageSize, defaultPage = 1) {
  const [searchParams, setSearchParams] = useSearchParams();
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const rawPage = searchParams.get("page");
  const parsedPage = Number.parseInt(rawPage ?? `${defaultPage}`, 10);
  const normalizedPage = Number.isNaN(parsedPage) ? defaultPage : parsedPage;
  const safePage = Math.min(Math.max(normalizedPage, 1), totalPages);

  useEffect(() => {
    if (rawPage === String(safePage)) {
      return;
    }

    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("page", String(safePage));
    setSearchParams(nextSearchParams, { replace: true });
  }, [rawPage, safePage, searchParams, setSearchParams]);

  function setPage(nextPage) {
    const clamped = Math.min(Math.max(nextPage, 1), totalPages);
    const nextSearchParams = new URLSearchParams(searchParams);

    nextSearchParams.set("page", String(clamped));
    setSearchParams(nextSearchParams);
  }

  return {
    page: safePage,
    totalPages,
    setPage
  };
}
