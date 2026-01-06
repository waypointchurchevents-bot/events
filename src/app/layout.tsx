import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events Redirect",
  description: "Waypoint Church Events Redirect Service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
