export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  // Example: "Sep 15, 2025, 10:45 AM"
  return date.toLocaleString('en-US', {
    month: 'short', // "Sep"
    day: 'numeric', // "15"
    year: 'numeric', // "2025"
    hour: 'numeric', // "10"
    minute: '2-digit', // "45"
    hour12: true, // "AM/PM"
  });
}

