export function calculateCurrentPage(
  page: number,
  totalListItems: number,
  pageSize: number,
) {
  const maxListPages = Math.ceil(totalListItems / pageSize);
  const validPage = Math.max(1, page);
  return totalListItems === 0 ? 1 : Math.min(validPage, maxListPages);
}

export function calculateOffset(page: number, pageSize: number) {
  return (page - 1) * pageSize;
}

export function calculateTotalPages(totalListItems: number, pageSize: number) {
  return Math.max(1, Math.ceil(totalListItems / pageSize));
}

export function parsePage(value: string) {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    return 1;
  }

  return parsedValue;
}
