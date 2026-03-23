"use client";

import { useState } from "react";

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [days, setDays] = useState(7);
  const [newsItems, setNewsItems] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [days, setDays] = useState(7);
  const [newsItems, setNewsItems] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [socialItems, setSocialItems] = useState([]);
  const [copies, setCopies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [socialItems, setSocialItems] = useState([]);
  const [copies, setCopies] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    setLoading(true);

    try {
      const [newsRes, socialRes] = await Promise.all([
        fetch(`/api/search?q=${encodeURIComponent(keyword)}&days=${days}`),
        fetch(`/api/social?q=${encodeURIComponent(keyword)}&days=${days}`)
      ]);

      const newsData = await newsRes.json();
      const socialData = await socialRes.json();

      setNewsItems(newsData.items || []);
      setKeywords(newsData.keywords || []);
      setSocialItems(socialData.items || []);

      const copyRes = await fetch("/api/copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, keywords: newsData.keywords || [] })
      });

      const copyData = await copyRes.json();
      setCopies(copyData.copies || []);
    } catch (error) {
      console.error(error);
      setNewsItems([]);
      setKeywords([]);
      setSocialItems([]);
      setCopies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    const res = await fetch("/api/export", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ newsItems, socialItems, keywords })
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "trend-radar.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: 40, fontFamily: "Arial, sans-serif" }}>
      <h1>🔥 Trend Radar</h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="키워드 입력"
          style={{ width: 220, padding: 8 }}
        />
        <button onClick={handleSearch}>
          {loading ? "분석중..." : "검색"}
        </button>
        <button
          onClick={handleDownload}
          disabled={!newsItems.length && !keywords.length && !socialItems.length}
        >
          엑셀 다운로드
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[3, 7, 30, 60].map((d) => (
          <button
            key={d}
            onClick={() => setDays(d)}
            style={{
              padding: "6px 10px",
              border: "1px solid #ddd",
              background: days === d ? "#111" : "#fff",
              color: days === d ? "#fff" : "#000",
              borderRadius: 6,
              cursor: "pointer"
            }}
          >
            최근 {d}일
          </button>
        ))}
      </div>

      <section style={{ marginBottom: 28 }}>
        <h2>뉴스 결과</h2>
        {newsItems.map((item, idx) => (
          <div key={idx} style={{ marginBottom: 14 }}>
            <a href={item.link} target="_blank" rel="noreferrer">
              <strong>{item.title}</strong>
            </a>
            <div style={{ fontSize: 13, color: "#555" }}>
              {item.pubDate} / {item.sentiment} / {item.source}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
