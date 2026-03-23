import { fetchDaumTrends } from "../../../lib/fetchDaumTrends";

export async function GET() {
  try {
    const data = await fetchDaumTrends();
    return Response.json(data);
  } catch (error) {
    return Response.json(
      {
        source: "",
        collectedAt: new Date().toISOString(),
        items: [],
        message: "Daum 실시간 트렌드 데이터를 불러오지 못했습니다."
      },
      { status: 500 }
    );
  }
}
