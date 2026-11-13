import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bài tập của tôi | IELTS Master",
  description: "Danh sách bài tập của học viên",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
