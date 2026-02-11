export function startOfDay(date: Date): Date {
  const d = new Date(date);
  // Normaliza para 00:00 em UTC para evitar deslocamentos por fuso/horário de verão
  d.setUTCHours(0, 0, 0, 0);
  return d;
}
