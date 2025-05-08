export default function formatViews(count: number) {
    if (count < 1000) {
      return count.toString(); // Less than 1k, return the number as is
    } else if (count >= 1000 && count < 1_000_000) {
      return (count / 1000).toFixed(count % 1000 === 0 ? 0 : 1) + "k"; // 1k to 999k
    } else if (count >= 1_000_000 && count < 1_000_000_000) {
      return (count / 1_000_000).toFixed(count % 1_000_000 === 0 ? 0 : 1) + "m"; // 1m to 999m
    } else {
      return (count / 1_000_000_000).toFixed(count % 1_000_000_000 === 0 ? 0 : 1) + "b"; // 1b and above
    }
  }