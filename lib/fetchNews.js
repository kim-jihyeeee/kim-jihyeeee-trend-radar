export async function fetchNews(keyword, days) {
  try {
    // 1. 가장 안전한 구글 뉴스 RSS 방식 (차단 위험 거의 없음)
    const googleUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(keyword)}&hl=ko&gl=KR&ceid=KR:ko`;
    
    const res = await fetch(googleUrl);
    const text = await res.text();

    // XML에서 데이터를 추출하는 초간단 방식 (부품 충돌 방지)
    const items = [];
    const rawItems = text.split("<item>").slice(1);

    rawItems.forEach((raw, i) => {
      if (i < 10) {
        const title = raw.match(/<title>(.*?)<\/title>/)?.[1] || "";
        const link = raw.match(/<link>(.*?)<\/link>/)?.[1] || "";
        const pubDate = raw.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || "";
        const source = raw.match(/<source.*?>(.*?)<\/source>/)?.[1] || "뉴스";

        if (title && link) {
          items.push({
            title: title.replace("<![CDATA[", "").replace("]]>", ""),
            link: link,
            source: source,
            pubDate: pubDate.split(" ").slice(1, 4).join(" "),
            sentiment: "확인됨"
          });
        }
      }
    });

    return {
      items: items.length > 0 ? items : [{ title: "검색 결과가 없습니다.", link: "#", source: "-", pubDate: "-", sentiment: "-" }],
      keywords: [keyword, "트렌드", "마케팅 분석"]
    };

  } catch (error) {
    console.error("복구 모드 에러:", error);
    return {
      items: [{ title: "서버 연결이 원활하지 않습니다. 다시 시도해주세요.", link: "#", source: "에러", pubDate: "-", sentiment: "-" }],
      keywords: []
    };
  }
}
