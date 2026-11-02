import { Montserrat } from "next/font/google";

export const metadata = {
  title: "Parxel: Pixel Art Creator"
}

const montserrat = Montserrat({
  weight: ["200", "300", "400", "500", "600", "700"]
});

export default function RootLayout({ children }) {
  return (
    <html>
      <body className={montserrat.className}>
        {children}
      </body>
    </html>
  );
}