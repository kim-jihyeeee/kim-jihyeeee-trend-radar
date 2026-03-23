export async function fetchNews(keyword) {
  const res = await fetch(
    `https://news.google.com/rss/search?q=${encodeURIComponent(keyword)}`
  );
  const text = await res.text();
  return text;
}
