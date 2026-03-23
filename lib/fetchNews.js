import { analyzeSentiment } from "./sentiment";
import { expandKeywords } from "./keywords";

function decodeXml(value) {
  return String(value || "")
    .replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function isWithinDays(pubDate, days) {
  if (!pubDate) return false;

  const articleDate = new Date(pubDate);
  if (Number.isNaN(articleDate.getTime())) return false;

  const now = new Date();
  const diff = now.getTime() - articleDate.getTime();
  const limit = days * 24 * 60 * 60 * 1000;

  return diff <= limit;
}

export async function fetchNews(keyword, days = 7) {
  const q = String(keyword || "").trim();
  if (!q) return { items: [], keywords: [] };

  const res = await fetch(
    `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=ko&gl=KR&ceid=KR:ko`,
    { cache: "no-store" }
  );

  const text = await res.text();
  const matches = [...text.matchAll(/<item>([\s\S]*?)<\/item>/g)];

  const items = matches
    .map((item) => {
      const content = item[1];
      const titleRaw = content.match(/<title>(.*?)<\/title>/)?.[1] || "";
      const linkRaw = content.match(/<link>(.*?)<\/link>/)?.[1] || "";
      const pubDateRaw = content.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || "";

      const title = decodeXml(titleRaw);
      const link = decodeXml(linkRaw);
      const pubDate = decodeXml(pubDateRaw);
      const sentiment = analyzeSentiment(title);

      return {
        title,
        link,
        pubDate,
        sentiment,
        source: "Google News"
      };
    })
    .filter((item) => item.title && item.link)
    .filter((item) => isWithinDays(item.pubDate, days))
    .slice(0, 10);

  return {
    items,
    keywords: expandKeywords(q)
  };
}
