export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("q") || "";
  const days = Number(searchParams.get("days") || 7);

  const mock = [
    {
      source: "X",
      text: `${keyword} 관련 반응이 최근 ${days}일 내 증가하는 흐름`,
      sentiment: "중립"
    },
    {
      source: "커뮤니티",
      text: `${keyword} 후기/추천 키워드가 반복 노출되는 패턴`,
      sentiment: "긍정"
    }
  ];

  return Response.json({ items: mock });
}
