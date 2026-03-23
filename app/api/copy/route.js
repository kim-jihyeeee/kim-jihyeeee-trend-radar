export async function POST(req) {
  const { keyword, keywords } = await req.json();

  const base = keyword || "";
  const related = (keywords || []).slice(0, 3);

  const copies = [
    `🔥 ${base} 지금 인기 급상승!`,
    `${base} 고민중이라면 지금 확인하세요`,
    `${base} 관련 키워드 TOP: ${related.join(", ")}`,
    `지금 ${base} 검색량 증가중! 놓치지 마세요`,
    `${base} 후기/정보 한번에 확인하기`
  ];

  return Response.json({ copies });
}
