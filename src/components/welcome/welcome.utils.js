function getMessagePrefix() {
  const hours = new Date().getHours();

  if (hours > 4 && hours < 12) return 'Good Morning';
  if (hours >= 12 && hours <= 17) return 'Good Afternoon';
  if (hours > 17 || hours < 4) return 'Good Evening';
  return 'Hello';
}


export { getMessagePrefix };
