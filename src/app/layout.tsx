import type { Metadata } from "next";
import { Be_Vietnam_Pro, JetBrains_Mono, Lora } from "next/font/google";
import "./globals.css";

const display = Lora({
  variable: "--font-lora",
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const body = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

const code = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "QA Academy — Sổ tay Automation Tester",
  description: "Học automation test web với Java, Selenium và Cucumber từ con số 0, bằng tiếng Việt.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${display.variable} ${body.variable} ${code.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
