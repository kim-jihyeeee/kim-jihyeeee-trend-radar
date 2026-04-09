import axios from "axios";
import * as cheerio from "cheerio";

export async function fetchNews(keyword, days) {
  try {
    // 네이버 뉴스 검색 (최신순)
    const url = `https://search.naver.com/search.naver?where=news&query=${encodeURIComponent(keyword)}&sm=tab_opt&sort=1`;
    
    // ⭐ 중요: 네이버를 속이기 위한 실제 브라우저 정보 추가
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7"
      },
      timeout: 10000 // 10초 내에 응답 없으면 취소
    });

    const $ = cheerio.load(response.data);
    const items = [];

    // 네이버 뉴스 리스트를 찾는 태그 (네이버가 수시로 바꿀 수 있어 두 가지 버전을 준비)
    const newsList = $("ul.list_news > li.bx");

    newsList.each((i, el) => {
      if (i < 10) {
        const title = $(el).find("a.news_tit").text().trim();
        const link = $(el).find("a.news_tit").attr("href");
        const source = $(el).find("a.info.press").text().replace("언론사 선정", "").trim();
        const pubDate = $(el).find(".info_group .info").first().text().trim() || "방금 전";

        if (title && link) {
          items.push({
            title: title,
            link: link,
            source: source,
            pubDate: pubDate,
            sentiment: "중립"
          });
        }
      }
    });

    // 만약 네이버에서 한 개도 못 가져왔을 때의 처리
    if (items.length === 0) {
        console.log("네이버 뉴스 검색 결과가 0건입니다.");
    }

    return {
      items: items,
      keywords: [keyword, `${keyword} 트렌드`, "마케팅"]
    };

  } catch (error) {
    console.error("News Fetch Error:", error.message);
    // 에러 발생 시 빈 값을 돌려주어 화면 멈춤 방지
    return { items: [], keywords: [], message: "데이터를 불러오는 중 오류가 발생했습니다." };
  }
}
