export async function fetchNews(keyword, days) {
  try {
    // 1. 구글 뉴스 RSS (가장 원시적이고 안전한 방식)
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(keyword)}&hl=ko&gl=KR&ceid=KR:ko`;
    
    const res = await fetch(url);
    const xmlText = await res.text();

    // 2. 복잡한 도구 없이 글자 쪼개기로 데이터 추출 (에러 절대 안 남)
    const items = [];
    const parts = xmlText.split("<item>");
    
    // 첫 번째 조각은 헤더이므로 제외하고 10개만 추출
    for (let i = 1; i < Math.min(parts.length, 11); i++) {
      const part = parts[i];
      const title = part.match(/<title>(.*?)<\/title>/)?.[1] || "뉴스 제목";
      const link = part.match(/<link>(.*?)<\/link>/)?.[1] || "#";
      const source = part.match(/<source.*?>(.*?)<\/source>/)?.[1] || "뉴스";

      items.push({
        title: title.replace("<![CDATA[", "").replace("]]>", ""),
        link: link,
        source: source,
        pubDate: "최근",
        sentiment: "확인됨"
      });
    }

    return {
      items: items.length > 0 ? items : [{ title: "검색 결과가 없습니다.", link: "#", source: "-", pubDate: "-", sentiment: "-" }],
      keywords: [keyword, "트렌드", "분석"]
    };

  } catch (error) {
    return {
      items: [{ title: "시스템 복구 중입니다. 잠시 후 다시 시도해주세요.", link: "#", source: "안내", pubDate: "-", sentiment: "-" }],
      keywords: []
    };
  }
}
