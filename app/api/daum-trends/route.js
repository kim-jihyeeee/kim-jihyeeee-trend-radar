import { fetchDaumTrends } from "../../../lib/fetchDaumTrends";

export async function GET() {
  try {
    const data = await fetchDaumTrends();
    return Response.json(data);
  } catch (error) {
    return Response.json(
      {
        items: [],
        message: "Daum 실검 실패"
      },
      { status: 500 }
    );
  }
}
