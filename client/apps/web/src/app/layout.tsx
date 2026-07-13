import { Lato, Space_Grotesk } from "next/font/google";

import { Providers } from "./providers";

const spaceGrotest = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-space-grotesk",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
  variable: "--font-lato",
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotest.variable} ${lato.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
