import "./globals.css";
import Navbar from "./components/Navbar";
import SessionProvider from "./components/SessionProvider";

export const metadata = {
  title: "BinkCity",
  description: "Real Money. Real Players. Real Action. Join The Game.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Navbar />
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
