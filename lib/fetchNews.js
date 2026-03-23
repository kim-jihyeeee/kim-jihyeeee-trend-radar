export async function fetchNews(keyword) {
  const res = await fetch(
    `https://news.google.com/rss/search?q=${encodeURIComponent(keyword)}&hl=ko&gl=KR&ceid=KR:ko`
  );

  const text = await res.text();

  const items = [...text.matchAll(/<item>([\s\S]*?)<\/item>/g)];

  return items.slice(0, 5).map((item) => {
    const content = item[1];
    const title = content.match(/<title>(.*?)<\/title>/)?.[1] || "";
    const link = content.match(/<link>(.*?)<\/link>/)?.[1] || "";
    return { title, link };
  });
}
