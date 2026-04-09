import axios from "axios";
import * as cheerio from "cheerio";

export async function fetchNews(keyword, days) {
  try {
    const url = `https://search.naver.com/search.naver?where=news&query=${encodeURIComponent(keyword)}&sort=1`;
    
    // 네이버를 완전히 속이기 위한 정밀 헤더
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache"
      },
      timeout: 8000
    });

    const $ = cheerio.load(response.data);
    const items = [];

    // 네이버 뉴스 리스트 선택자 (가장 정확한 li.bx)
    const list = $("ul.list_news > li.bx");

    list.each((i, el) => {
      if (i < 10) {
        const title = $(el).find("a.news_tit").text().trim();
        const link = $(el).find("a.news_tit").attr("href");
        const source = $(el).find("a.info.press").text().replace("언론사 선정", "").trim();
        const pubDate = $(el).find(".info_group .info").first().text().trim() || "최신";

        if (title && link) {
          items.push({
            title: title,
            link: link,
            source: source,
            pubDate: pubDate,
            sentiment: "확인완료"
          });
        }
      }
    });

    // 만약 네이버에서 차단당해 데이터가 0건이면 가짜 데이터라도 보여주어 작동 확인
    if (items.length === 0) {
      return {
        items: [{ title: "네이버 뉴스 결과가 없습니다 (차단 확인 중)", link: "#", source: "시스템", pubDate: "-", sentiment: "-" }],
        keywords: [keyword, "분석중"]
      };
    }

    return {
      items: items,
      keywords: [keyword, "최신 트렌드", "마케팅"]
    };

  } catch (error) {
    // 에러 발생 시 사용자에게 에러 종류를 알림
    return { 
      items: [{ title: `에러 발생: ${error.message}`, link: "#", source: "System", pubDate: "-", sentiment: "Error" }], 
      keywords: [] 
    };
  }
}
