import { NextRequest, NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";
import type { NewsItem } from "@/lib/types";

const RSS_URL = "https://news.google.com/rss/search";
const MAX_ITEMS = 10;

export async function GET(request: NextRequest) {
  const keyword = request.nextUrl.searchParams.get("keyword")?.trim();
  if (!keyword) {
    return NextResponse.json(
      { error: "keyword 쿼리 파라미터가 필요합니다." },
      { status: 400 }
    );
  }

  try {
    const q = encodeURIComponent(keyword);
    const url = `${RSS_URL}?q=${q}&hl=ko&gl=KR&ceid=KR:ko`;
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Google News RSS 오류: ${res.status}`);
    }

    const xml = await res.text();
    const parser = new XMLParser({ ignoreAttributes: false });
    const parsed = parser.parse(xml);

    const channel = parsed?.rss?.channel;
    const feed = parsed?.feed;

    let rawItems: unknown[] = [];
    if (channel?.item) {
      rawItems = Array.isArray(channel.item) ? channel.item : [channel.item];
    } else if (feed?.entry) {
      rawItems = Array.isArray(feed.entry) ? feed.entry : [feed.entry];
    }

    const getSource = (s: unknown): string => {
      if (typeof s === "string") return s;
      if (s && typeof s === "object") {
        const t = (s as Record<string, unknown>)["#text"] ?? (s as Record<string, unknown>)["-#text"];
        return String(t ?? "알 수 없음");
      }
      return "알 수 없음";
    };

    const toItem = (item: Record<string, unknown>): NewsItem => {
      const linkVal = item.link;
      const href =
        typeof linkVal === "string"
          ? linkVal
          : linkVal && typeof linkVal === "object" && "@_href" in linkVal
            ? String((linkVal as { "@_href"?: string })["@_href"] ?? "")
            : Array.isArray(linkVal) && linkVal[0] && typeof linkVal[0] === "object" && "@_href" in linkVal
              ? String((linkVal[0] as { "@_href"?: string })["@_href"] ?? "")
              : "";
      const titleVal = item.title;
      const title =
        typeof titleVal === "string" ? titleVal : titleVal && typeof titleVal === "object" && "#text" in titleVal ? String((titleVal as { "#text"?: string })["#text"] ?? "") : String(titleVal ?? "");
      const pub = item.pubDate ?? item.published ?? item.updated ?? "";
      return {
        title,
        link: href,
        source: getSource(item.source),
        publishedAt: String(pub),
      };
    };

    if (!channel && !feed) {
      return NextResponse.json({ news: [], keyword });
    }

    if (rawItems.length === 0) {
      return NextResponse.json({ news: [], keyword });
    }
    const news: NewsItem[] = rawItems
      .slice(0, MAX_ITEMS)
      .map((it) => toItem(it as Record<string, unknown>));

    return NextResponse.json({ news, keyword });
  } catch (e) {
    const message = e instanceof Error ? e.message : "뉴스 검색 중 오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
