import * as XLSX from "xlsx";

export async function POST(req) {
  const body = await req.json();
  const newsItems = Array.isArray(body?.newsItems) ? body.newsItems : [];
  const socialItems = Array.isArray(body?.socialItems) ? body.socialItems : [];
  const keywords = Array.isArray(body?.keywords) ? body.keywords : [];

  const rows = [
    ...newsItems.map((item) => ({
      구분: "뉴스",
      제목: item.title,
      링크: item.link,
      날짜: item.pubDate,
      감정: item.sentiment,
      출처: item.source
    })),
    ...socialItems.map((item) => ({
      구분: item.source,
      제목: item.text,
      링크: "",
      날짜: "",
      감정: item.sentiment,
      출처: item.source
    })),
    ...keywords.map((item) => ({
      구분: "확장키워드",
      제목: item,
      링크: "",
      날짜: "",
      감정: "",
      출처: ""
    }))
  ];

  const ws = XLSX.utils.json_to_sheet(rows);
}
