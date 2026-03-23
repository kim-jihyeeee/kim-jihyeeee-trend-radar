import { fetchNews } from "../../../lib/fetchNews";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("q") || "";

  try {
    const data = await fetchNews(keyword);
    return Response.json(data);
  } catch (error) {
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
