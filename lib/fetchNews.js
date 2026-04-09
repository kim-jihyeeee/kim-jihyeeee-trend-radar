import axios from "axios";
import * as cheerio from "cheerio";

export async function fetchNews(keyword, days) {
  let combinedItems = [];
  
  // 1. [네이버 뉴스] 시도
  try {
    const naverUrl = `https://search.naver.com/search.naver?where=news&query=${encodeURIComponent(keyword)}&sort=1`;
    const naverRes = await axios.get(naverUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" },
      timeout: 5000
    });
    const $ = cheerio.load(naverRes.data);
    $("ul.list_news > li.bx").each((i, el) => {
      if (i < 5) {
        combinedItems.push({
          title: `[네이버] ${$(el).find("a.news_tit").text().trim()}`,
          link: $(el).find("a.news_tit").attr("href"),
          source: $(el).find("a.info.press").text().trim(),
          pubDate: "최근",
          sentiment: "중립"
        });
      }
    });
  } catch (e) {
    console.log("네이버 뉴스 수집 실패 (차단됨)");
  }

  // 2. [구글 뉴스] 시도 (원래 나오던 방식대로 복구)
  try {
    const googleUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(keyword)}+when:${days}d&hl=ko&gl=KR&ceid=KR:ko`;
    const googleRes = await axios.get(googleUrl);
    const $ = cheerio.load(googleRes.data, { xmlMode: true });
    
    $("item").each((i, el) => {
      if (i < 10) {
        combinedItems.push({
          title: $(el).find("title").text(),
          link: $(el).find("link").text(),
          source: "구글뉴스",
          pubDate: $(el).find("pubDate").text().split(' ').slice(0, 4).join(' '),
          sentiment: "확인됨"
        });
      }
    });
  } catch (e) {
    console.log("구글 뉴스 수집 실패");
  }

  return {
    items: combinedItems,
    keywords: [keyword, `${keyword} 분석`, "마케팅 트렌드"]
  };
}
