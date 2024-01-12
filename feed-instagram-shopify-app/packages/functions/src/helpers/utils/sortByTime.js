export const sortByTime = (a, b) =>
  new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
