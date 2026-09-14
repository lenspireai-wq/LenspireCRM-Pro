const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "short",
  year: "numeric",
};

const validDate = (value: string | Date | null | undefined) => {
  if (!value) return null;
  const source = value instanceof Date
    ? value
    : new Date(`${String(value).slice(0, 10)}T00:00:00`);
  return Number.isNaN(source.getTime()) ? null : source;
};

/** Display CRM dates consistently as DD-MMM-YYYY. */
export const formatDate = (value: string | Date | null | undefined, empty = "—") => {
  const parsed = validDate(value);
  return parsed ? parsed.toLocaleDateString("en-GB", DATE_OPTIONS).replace(/ /g, "-") : empty;
};

/** Display a stored HH:mm[:ss] value in the CRM's 12-hour time format. */
export const formatTime = (value: string | null | undefined, empty = "—") => {
  if (!value) return empty;
  const [hour, minute] = String(value).split(":");
  const hourNumber = Number(hour);
  if (!minute || Number.isNaN(hourNumber) || hourNumber < 0 || hourNumber > 23) return String(value);
  return `${String(((hourNumber + 11) % 12) + 1).padStart(2, "0")}:${minute} ${hourNumber >= 12 ? "PM" : "AM"}`;
};

/** Display timestamps with the common date format followed by 12-hour time. */
export const formatDateTime = (value: string | Date | null | undefined, empty = "—") => {
  if (!value) return empty;
  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) return empty;
  const date = parsed.toLocaleDateString("en-GB", DATE_OPTIONS).replace(/ /g, "-");
  const time = parsed.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  return `${date}, ${time}`;
};
