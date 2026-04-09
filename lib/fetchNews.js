export async function fetchNews(keyword, days) {
  try {
    // 1. 차단 걱정 없는 구글 뉴스 RSS (가장 안정적인 주소)
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(keyword)}&hl=ko&gl=KR&ceid=KR:ko`;
    
    // axios 대신 Next.js 기본 내장 함수인 fetch 사용 (에러 방지)
    const res = await fetch(url);
    const text = await res.text();

    // 2. 아주 단순한 방식으로 데이터 추출 (정규식 사용)
    const items = [];
    const itemMatches = text.match(/<item>([\s\S]*?)<\/item>/g);

    if (itemMatches) {
      itemMatches.slice(0, 10).forEach((itemHtml) => {
        const title = itemHtml.match(/<title>(.*?)<\/title>/)?.[1] || "제목 없음";
        const link = itemHtml.match(/<link>(.*?)<\/link>/)?.[1] || "#";
        const source = itemHtml.match(/<source.*?>(.*?)<\/source>/)?.[1] || "뉴스";
        
        items.push({
          title: title.replace("<![CDATA[", "").replace("]]>", ""),
          link: link,
          source: source,
          pubDate: "최근",
          sentiment: "확인됨"
        });
      });
    }

    // 결과가 없어도 최소한 안내 문구는 띄움
    return {
      items: items.length > 0 ? items : [{ title: "뉴스를 찾을 수 없습니다. 키워드를 확인해주세요.", link: "#", source: "-", pubDate: "-", sentiment: "-" }],
      keywords: [keyword, "분석", "트렌드"]
    };

  } catch (error) {
    // 에러 발생 시에도 빈 화면 대신 에러 메시지 표시
    return {
      items: [{ title: "데이터 로드 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.", link: "#", source: "에러", pubDate: "-", sentiment: "-" }],
      keywords: []
    };
  }
}
