export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("q") || "";
  const days = Number(searchParams.get("days") || 7);

  try {
    const res = await fetch(
      `https://www.reddit.com/search.json?q=${encodeURIComponent(keyword)}&sort=new&limit=10`,
      {
        headers: {
          "User-Agent": "trend-radar/1.0"
        },
        cache: "no-store"
      }
    );

    const json = await res.json();
    const children = json?.data?.children || [];

    const items = children.slice(0, 5).map((child) => {
      const data = child.data || {};
      return {
        source: "Reddit",
        text: data.title || "",
        sentiment: "중립",
        link: data.permalink ? `https://www.reddit.com${data.permalink}` : ""
      };
    });

    if (items.length > 0) {
      return Response.json({ items });
    }

    return Response.json({
      items: [
        {
          source: "커뮤니티",
          text: `${keyword} 관련 커뮤니티 실데이터가 부족합니다.`,
          sentiment: "중립",
          link: ""
        }
      ]
    });
  } catch (error) {
    return Response.json({
      items: [
        {
          source: "커뮤니티",
          text: `${keyword} 관련 커뮤니티 데이터를 불러오지 못했습니다.`,
          sentiment: "중립",
          link: ""
        }
      ]
    });
  }
}
