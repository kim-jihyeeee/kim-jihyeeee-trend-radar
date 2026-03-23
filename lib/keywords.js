const suffixes = ["추천", "후기", "가격", "비교", "효능", "부작용", "선물", "인기", "먹는법"];

export function expandKeywords(baseKeyword) {
  const base = String(baseKeyword || "").trim();
  if (!base) return [];

  const result = new Set();
  suffixes.forEach((suffix) => {
    result.add(`${base} ${suffix}`);
    result.add(`${base}${suffix}`);
  });

  result.add(`${base} 네이버`);
  result.add(`${base} 구글`);
  result.add(`${base} 인스타`);
  result.add(`${base} 트위터`);

  return [...result].slice(0, 20);
}
