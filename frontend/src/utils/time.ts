export function timeAgoShort(input: Date | string | number) {
  const date =
    input instanceof Date
      ? input
      : new Date(input);

  if (isNaN(date.getTime())) {
    return '-';
  }

  const diff = Date.now() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);
  return `${days}d`;
}
