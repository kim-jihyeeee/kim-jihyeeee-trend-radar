import axios from "axios";
import * as cheerio from "cheerio";

export async function fetchNews(keyword, days) {
  try {
    // 1. 네이버 뉴스 크롤링 (최신순)
    const naverUrl = `https://search.naver.com/search.naver?where=news&query=${encodeURIComponent(keyword)}&sm=tab_opt&sort=1`;
    const { data: naverHtml } = await axios.get(naverUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" }
    });

    const $ = cheerio.load(naverHtml);
    const naverNews = [];

    $("ul.list_news > li.bx").each((i, el) => {
      if (i < 5) { // 상위 5개만 가져오기 (조절 가능)
        const title = $(el).find("a.news_tit").text();
        const link = $(el).find("a.news_tit").attr("href");
        const source = $(el).find("a.info.press").text().replace("언론사 선정", "").trim();
        const pubDate = "네이버뉴스"; // 날짜 데이터는 추가 가공 필요

        naverNews.push({
          title: `[네이버] ${title}`,
          link,
          source,
          pubDate,
          sentiment: "분석중"
        });
      }
    });

    // 2. 기존 구글 뉴스 로직 (가상 예시 - 기존 로직이 있다면 여기에 합치세요)
    // 만약 기존에 구글 뉴스를 가져오던 다른 API 주소가 있다면 여기서 fetch 하시면 됩니다.
    
    // 최종 결과물 합치기
    return {
      items: naverNews, // 여기에 기존 구글 뉴스 배열을 합칠 수 있습니다 (예: naverNews.concat(googleNews))
      keywords: [keyword, "트렌드", "분석"], // 확장 키워드 예시
    };

  } catch (error) {
    console.error("fetchNews Error:", error);
    return { items: [], keywords: [] };
  }
}
