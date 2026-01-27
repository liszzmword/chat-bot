export interface NewsItem {
  title: string;
  link: string;
  source: string;
  publishedAt: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
