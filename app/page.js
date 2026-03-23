"use client";

import { useState } from "react";

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [days, setDays] = useState(7);
  const [newsItems, setNewsItems] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [socialItems, setSocialItems] = useState([]);
  const [copies, setCopies] = useState([]);
  const [copyCategory, setCopyCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const runSearch = async (searchKeyword, searchDays) => {
    const [newsRes, socialRes] = await Promise.all([
      fetch(`/api/search?q=${encodeURIComponent(searchKeyword)}&days=${searchDays}`),
      fetch(`/api/social?q=${encodeURIComponent(searchKeyword)}&days=${searchDays}`)
    ]);

    const newsData = await newsRes.json();
    const socialData = await socialRes.json();

    setNewsItems(newsData.items || []);
    setKeywords(newsData.keywords || []);
    setSocialItems(socialData.items || []);

    try {
      const copyRes = await fetch("/api/copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword: searchKeyword,
          keywords: newsData.keywords || []
        })
      });

      const copyData = await copyRes.json();
      setCopies(copyData.copies || []);
      setCopyCategory(copyData.category || "");
    } catch (copyError) {
      console.error("광고 카피 생성 실패:", copyError);
      setCopies([]);
      setCopyCategory("");
    }
  };

  const handleSearch = async () => {
    if (!keyword.trim()) return;

    setLoading(true);
    try {
      await runSearch(keyword, days);
    } catch (error) {
      console.error("검색 실패:", error);
      setNewsItems([]);
      setKeywords([]);
      setSocialItems([]);
      setCopies([]);
      setCopyCategory("");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeDays = async (newDays) => {
    setDays(newDays);

    if (!keyword.trim()) return;

    setLoading(true);
    try {
      await runSearch(keyword, newDays);
    } catch (error) {
      console.error("기간 변경 검색 실패:", error);
      setNewsItems([]);
      setKeywords([]);
      setSocialItems([]);
      setCopies([]);
      setCopyCategory("");
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

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
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

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {[3, 7, 30, 60].map((d) => (
          <button
            key={d}
            onClick={() => handleChangeDays(d)}
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

      <div style={{ marginBottom: 16, fontSize: 14, color: "#555" }}>
        현재 선택 기간: 최근 {days}일
      </div>

      <section style={{ marginBottom: 28 }}>
        <h2>뉴스 결과</h2>
        {newsItems.length === 0 ? (
          <div style={{ color: "#666", fontSize: 14 }}>표시할 뉴스가 없습니다.</div>
        ) : (
          newsItems.map((item, idx) => (
            <div key={idx} style={{ marginBottom: 14 }}>
              <a href={item.link} target="_blank" rel="noreferrer">
                <strong>{item.title}</strong>
              </a>
              <div style={{ fontSize: 13, color: "#555" }}>
                {item.pubDate} / {item.sentiment} / {item.source}
              </div>
            </div>
          ))
        )}
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2>확장 키워드</h2>
        {keywords.length === 0 ? (
          <div style={{ color: "#666", fontSize: 14 }}>표시할 확장 키워드가 없습니다.</div>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {keywords.map((item, idx) => (
              <span
                key={idx}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 20,
                  padding: "6px 10px",
                  fontSize: 13
                }}
              >
                {item}
              </span>
            ))}
          </div>
        )}
      </section>

     <section style={{ marginBottom: 28 }}>
  <h2>SNS / 커뮤니티 트렌드</h2>
  {socialItems.length === 0 ? (
    <div style={{ color: "#666", fontSize: 14 }}>표시할 SNS/커뮤니티 데이터가 없습니다.</div>
  ) : (
    socialItems.map((item, idx) => (
      <div key={idx} style={{ marginBottom: 12 }}>
        <strong>[{item.source}]</strong>{" "}
        {item.link ? (
          <a href={item.link} target="_blank" rel="noreferrer">
            {item.text}
          </a>
        ) : (
          item.text
        )}
        <div style={{ fontSize: 13, color: "#555" }}>{item.sentiment}</div>
      </div>
    ))
  )}
</section>
    </div>
  );
}
