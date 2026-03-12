export function getDateInfo() {
  const now = new Date();

  return {
    now,
    today: now.getDate(),
    month: now.toLocaleString("default", { month: "long" }),
    year: now.getFullYear()
  };
}