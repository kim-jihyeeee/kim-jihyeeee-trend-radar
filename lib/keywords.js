export function generateKeywords(keyword) {
  if (!keyword) return [];

  const base = keyword.replace(/\s/g, "");

  const patterns = {
    정보: [
      `${base} 뜻`,
      `${base} 원리`,
      `${base} 효과`,
      `${base} 부작용`,
      `${base} 정상수치`,
      `${base} 기준`
    ],
    해결: [
      `${base} 낮추는 방법`,
      `${base} 관리 방법`,
      `${base} 해결법`,
      `${base} 개선 방법`,
      `${base} 줄이는 법`
    ],
    구매: [
      `${base} 추천`,
      `${base} 영양제`,
      `${base} 제품`,
      `${base} TOP10`,
      `${base} 순위`
    ],
    비교: [
      `${base} 비교`,
      `${base} 차이`,
      `${base} vs`,
      `${base} 어떤게 좋나요`
    ],
    후기: [
      `${base} 후기`,
      `${base} 리뷰`,
      `${base} 사용 후기`,
      `${base} 효과 후기`
    ],
    연관: [
      `${base} 다이어트`,
      `${base} 음식`,
      `${base} 식단`,
      `${base} 운동`,
      `${base} 습관`
    ],
    브랜드: [
      `${base} 네이버`,
      `${base} 쿠팡`,
      `${base} 올리브영`,
      `${base} 약국`
    ]
  };

  // flatten + 중복 제거
  const result = Object.values(patterns).flat();

  return [...new Set(result)].slice(0, 25);
}
