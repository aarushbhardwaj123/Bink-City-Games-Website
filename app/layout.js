import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "Bink City",
  description: "Automated transactions powered by Bink City",
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
