const HOUR_24_TIME = 1000 * 60 * 60 * 24;

export default function isAfter24Hour(feature, targetDate = '') {
  if (targetDate !== '') {
    return new Date(targetDate).getTime() - new Date(feature.createdAt).getTime() >= HOUR_24_TIME;
  }
  return new Date().getTime() - new Date(feature.createdAt).getTime() >= HOUR_24_TIME;
}
