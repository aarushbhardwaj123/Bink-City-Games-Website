import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "BinkCity",
  description: "Real Money. Real Players. Real Action. Join The Game.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
