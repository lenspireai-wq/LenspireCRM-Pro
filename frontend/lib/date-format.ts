const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "long",
  year: "numeric",
};

const validDate = (value: string | Date | null | undefined) => {
  if (!value) return null;
  const source = value instanceof Date
    ? value
    : new Date(`${String(value).slice(0, 10)}T00:00:00`);
  return Number.isNaN(source.getTime()) ? null : source;
};

/** Display CRM dates consistently as DD/MMMM/YYYY. */
export const formatDate = (value: string | Date | null | undefined, empty = "—") => {
  const parsed = validDate(value);
  return parsed ? parsed.toLocaleDateString("en-GB", DATE_OPTIONS).replace(/ /g, "/") : empty;
};

/** Display timestamps with the common date format followed by 24-hour time. */
export const formatDateTime = (value: string | Date | null | undefined, empty = "—") => {
  if (!value) return empty;
  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) return empty;
  const date = parsed.toLocaleDateString("en-GB", DATE_OPTIONS).replace(/ /g, "/");
  const time = parsed.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
  return `${date}, ${time}`;
};
