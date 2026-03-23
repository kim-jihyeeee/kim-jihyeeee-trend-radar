export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("q");

  return Response.json({
    result: `${keyword} 관련 트렌드 데이터 수집 완료`,
  });
}
