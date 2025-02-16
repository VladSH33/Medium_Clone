import queryString from "query-string";

export const limit = 10

export const range = (start, end) => {
  return Array.from({ length: end }, (_, i) => i + start);
}

export const getPaginator = search => {
  const parsedSearch = queryString.parse(search)
  const currentPage = parsedSearch.page ? Number(parsedSearch.page) : 1
  const offset = currentPage * limit - limit
  return {currentPage, offset}
}
