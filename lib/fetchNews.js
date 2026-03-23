import { analyzeSentiment } from "./sentiment";
import { expandKeywords } from "./keywords";

function decodeXml(value) {
  return String(value || "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1");
}

export async function fetchNews(keyword) {
  const q = String(keyword || "").trim();
  if (!q) return { items: [], keywords: [] };

  const res = await fetch(
    `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=ko&gl=KR&ceid=KR:ko`,
    { cache: "no-store" }
  );

  const text = await res.text();
  const matches = [...text.matchAll(/<item>([\s\S]*?)<\/item>/g)];

  const items = matches.slice(0, 10).map((item) => {
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
  });

  return {
    items,
    keywords: expandKeywords(q)
  };
}
