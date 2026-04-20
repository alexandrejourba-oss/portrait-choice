import "@app/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Тест восьми влечений по методу портретных выборов",
  description: "Реализация теста портретных выборов без интерпретации результата",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}