export function timeSince(isoString: string) {
  const timeStamp = new Date(isoString);
  const now = new Date();

  const secondsPast = (now.getTime() - timeStamp.getTime()) / 1000;
  if (secondsPast < 60) {
    return "Только что";
  }
  if (secondsPast < 3600) {
    return (secondsPast / 60).toFixed(0) + " мин. назад";
  }
  if (secondsPast <= 86400) {
    return (secondsPast / 3600).toFixed(0) + " ч. назад";
  }
  if (secondsPast <= 2628000) {
    return (secondsPast / 86400).toFixed + " д. назад";
  }
  if (secondsPast <= 31536000) {
    return (secondsPast / 2628000).toFixed + " мес. назад";
  }
  if (secondsPast > 31536000) {
    return (secondsPast / 31536000).toFixed + " г. назад";
  }
}

// d = new Date(1632201043000);
// console.log(timeSince(d));
