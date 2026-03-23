"use client";
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

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="키워드 입력"
          style={{ width: 220, padding: 8 }}
        />
        <button onClick={handleSearch}>{loading ? "분석중..." : "검색"}</button>
        <button onClick={handleDownload} disabled={!newsItems.length && !keywords.length && !socialItems.length}>
          엑셀 다운로드
        </button>
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

      <section style={{ marginBottom: 28 }}>
        <h2>확장 키워드</h2>
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
      </section>

      <section>
        <h2>SNS / 커뮤니티 트렌드</h2>
        {socialItems.map((item, idx) => (
          <div key={idx} style={{ marginBottom: 10 }}>
            <strong>[{item.source}]</strong> {item.text}
            <div style={{ fontSize: 13, color: "#555" }}>{item.sentiment}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
