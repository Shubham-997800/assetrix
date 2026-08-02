import type { PaginationQuery } from "../../types";
import { PAGINATION_DEFAULTS } from "../../constants";

export function getPagination(query: PaginationQuery) {
  const page = Math.max(1, parseInt(query.page || String(PAGINATION_DEFAULTS.PAGE), 10) || PAGINATION_DEFAULTS.PAGE);
  const limit = Math.min(
    PAGINATION_DEFAULTS.MAX_LIMIT,
    Math.max(1, parseInt(query.limit || String(PAGINATION_DEFAULTS.LIMIT), 10) || PAGINATION_DEFAULTS.LIMIT)
  );
  const sortOrder = query.sortOrder === "asc" ? "asc" : PAGINATION_DEFAULTS.SORT_ORDER;
  const sortBy = query.sortBy || "createdAt";
  const skip = (page - 1) * limit;
  return { page, limit, skip, sortOrder, sortBy };
}

export function buildWhereSearch(fields: string[], search?: string): Record<string, unknown> {
  if (!search) return {};
  return {
    OR: fields.map((field) => ({
      [field]: { contains: search, mode: "insensitive" as const },
    })),
  };
}
