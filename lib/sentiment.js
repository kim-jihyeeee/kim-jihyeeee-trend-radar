const positiveWords = [
  "인기", "추천", "호평", "급상승", "관심", "화제", "기대", "강세", "성장", "확대"
];

const negativeWords = [
  "논란", "우려", "급감", "하락", "불만", "악화", "비판", "이슈", "문제", "부진"
];

export function analyzeSentiment(text) {
  const value = String(text || "");

  let positive = 0;
  let negative = 0;

  positiveWords.forEach((word) => {
    if (value.includes(word)) positive += 1;
  });

  negativeWords.forEach((word) => {
    if (value.includes(word)) negative += 1;
  });

  if (positive > negative) return "긍정";
  if (negative > positive) return "부정";
  return "중립";
}
