import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Boulder Hranice",
  description: "Boulder Hranice",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
