export function normalizeCourseCode(input: string) {
  if (!input) return '';
  return input.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}
