"use client";

import { useState } from "react";

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [result, setResult] = useState("");

  const handleSearch = async () => {
    const res = await fetch(`/api/search?q=${keyword}`);
    const data = await res.json();
    setResult(data.result);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>🔥 Trend Radar</h1>

      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="키워드 입력"
      />

      <button onClick={handleSearch}>검색</button>

      <pre>{result}</pre>
    </div>
  );
}
