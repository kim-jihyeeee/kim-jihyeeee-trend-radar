import axios from "axios";
import * as cheerio from "cheerio";

export async function fetchNews(keyword, days) {
  let allNews = [];

  // 1. 구글 뉴스 (안전한 RSS 방식 - 무조건 먼저 시도)
  try {
    const googleUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(keyword)}&hl=ko&gl=KR&ceid=KR:ko`;
    const gRes = await axios.get(googleUrl, { timeout: 5000 });
    const $g = cheerio.load(gRes.data, { xmlMode: true });

    $g("item").each((i, el) => {
      if (i < 8) {
        allNews.push({
          title: $g(el).find("title").text(),
          link: $g(el).find("link").text(),
          source: "구글뉴스",
          pubDate: $g(el).find("pubDate").text().split(' ').slice(1, 4).join(' '),
          sentiment: "확인됨"
        });
      }
    });
  } catch (err) {
    console.error("Google News Fail");
  }

  // 2. 네이버 뉴스 (차단 가능성 대비 catch 처리)
  try {
    // 검색 방식을 '통합검색'이 아닌 '뉴스탭 직접검색'으로 변경하여 차단 회피
    const naverUrl = `https://search.naver.com/search.naver?where=news&query=${encodeURIComponent(keyword)}&sm=tab_smr&nso=so:dd,p:all,a:all`;
    const nRes = await axios.get(naverUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      timeout: 5000
    });
    
    const $n = cheerio.load(nRes.data);
    $n("ul.list_news > li.bx").each((i, el) => {
      if (i < 5) {
        const t = $n(el).find("a.news_tit").text().trim();
        const l = $n(el).find("a.news_tit").attr("href");
        const s = $n(el).find("a.info.press").text().trim();
        
        if (t && l) {
          allNews.unshift({ // 네이버 뉴스를 리스트 맨 위로 추가
            title: `[네이버] ${t}`,
            link: l,
            source: s || "네이버뉴스",
            pubDate: "최신",
            sentiment: "중립"
          });
        }
      }
    });
  } catch (err) {
    console.error("Naver News Blocked");
  }

  // 만약 둘 다 실패해서 데이터가 하나도 없다면 가짜 데이터라도 보내서 작동 확인
  if (allNews.length === 0) {
    allNews.push({
      title: "현재 뉴스를 불러올 수 없습니다. 잠시 후 다시 검색해 주세요.",
      link: "#",
      source: "안내",
      pubDate: "-",
      sentiment: "-"
    });
  }

  return {
    items: allNews,
    keywords: [keyword, `${keyword} 트렌드`, "실시간 이슈"]
  };
}
