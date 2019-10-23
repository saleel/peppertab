function getMessagePrefix() {
  const hours = new Date().getHours();

  if (hours > 4 && hours < 12) return 'Good Morning';
  if (hours >= 12 && hours <= 15) return 'Good Afternoon';
  if (hours > 15 || hours <= 1) return 'Good Evening';
  return 'Hello';
}


export { getMessagePrefix };
