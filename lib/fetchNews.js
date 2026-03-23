import xml2js from "xml2js";

export async function fetchNews(keyword) {
  const res = await fetch(
    `https://news.google.com/rss/search?q=${encodeURIComponent(keyword)}&hl=ko&gl=KR&ceid=KR:ko`
  );

  const text = await res.text();

  const parser = new xml2js.Parser();
  const json = await parser.parseStringPromise(text);

  const items = json.rss.channel[0].item;

  return items.slice(0, 5).map((item) => ({
    title: item.title[0],
    link: item.link[0],
    source: item.source?.[0]?._ || "Google News",
  }));
}
