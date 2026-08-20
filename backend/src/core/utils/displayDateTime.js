 const isoToInputDate = (value) => {
  if (!value) return "";

  // Nếu là Date object
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  // Nếu là string ISO
  if (typeof value === "string") {
    return value.split("T")[0];
  }

  return "";
};


  const toISODateOnly = (dateStr) => {
  return `${dateStr}T00:00:00.000Z`;
};
export { toISODateOnly, isoToInputDate };
