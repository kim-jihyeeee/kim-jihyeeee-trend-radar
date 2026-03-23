import axios from "axios";
import * as cheerio from "cheerio";

export async function fetchDaumTrends() {
  const targets = [
    "https://www.daum.net",
    "https://m.daum.net"
  ];

  for (const target of targets) {
    try {
      const res = await axios.get(target, {
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      });

      const $ = cheerio.load(res.data);
      const candidates = [];

      $("a, span, strong").each((_, el) => {
        const text = $(el).text().trim();

        if (!text) return;
        if (text.length < 2 || text.length > 30) return;

        candidates.push(text);
      });

      const unique = [...new Set(candidates)];

      const items = unique
        .filter((v) => !v.includes("로그인"))
        .filter((v) => !v.includes("메일"))
        .filter((v) => !v.includes("뉴스"))
        .filter((v) => !v.includes("카페"))
        .filter((v) => !v.includes("쇼핑"))
        .slice(0, 10)
        .map((keyword, index) => ({
          rank: index + 1,
          keyword
        }));

      if (items.length) {
        return {
          source: target,
          collectedAt: new Date().toISOString(),
          items
        };
      }
    } catch (e) {}
  }

  return {
    source: "",
    collectedAt: new Date().toISOString(),
    items: []
  };
}
