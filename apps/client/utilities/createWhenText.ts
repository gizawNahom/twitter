export function createWhenText(date: Date) {
  const minDiff = getDifferenceInMinutes(date);
  if (isLessThanAMinute(minDiff)) return 'now';
  if (isLessThanAnHour(minDiff)) return `${minDiff} ${getMinText(minDiff)}`;
  const diffInHours = getDifferenceInHours(minDiff);
  if (isLessThanADay(diffInHours)) return `${diffInHours}h`;
  if (isLessThanTwoDays(diffInHours)) return 'yesterday';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  function getDifferenceInMinutes(date: Date) {
    return Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60));
  }

  function isLessThanAMinute(diffInMinutes: number) {
    return diffInMinutes < 1;
  }

  function isLessThanAnHour(minDiff: number) {
    return minDiff <= 59;
  }

  function getMinText(differenceInMinutes: number) {
    return minDiff === 1 ? 'min' : 'mins';
  }

  function getDifferenceInHours(differenceInMinutes: number) {
    return Math.floor(minDiff) / 60;
  }

  function isLessThanADay(diffInHours: number) {
    return diffInHours <= 23;
  }

  function isLessThanTwoDays(diffInHours: number) {
    return diffInHours <= 47;
  }
}
