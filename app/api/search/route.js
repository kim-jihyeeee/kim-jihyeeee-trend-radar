import { fetchNews } from "../../../lib/fetchNews";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("q");

  try {
    const data = await fetchNews(keyword);
    return Response.json({ result: data });
  } catch (e) {
    return Response.json({ result: "데이터 가져오기 실패" });
  }
}
