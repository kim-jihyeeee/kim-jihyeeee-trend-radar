import { fetchNews } from "../../../lib/fetchNews";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("q") || "";
  const days = Number(searchParams.get("days") || 7);

  try {
    const data = await fetchNews(keyword, days);
    return Response.json(data);
  } catch (error) {
    console.error("search api error:", error);

    return Response.json(
      {
        items: [],
        keywords: [],
        message: "데이터 가져오기 실패"
      },
      { status: 500 }
    );
  }
}
