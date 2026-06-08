import "./globals.css";
import Navbar from "@/src/components/Navbar";

export const metadata = {
  title: "Barker",
  description: "Simple Twitter/X clone",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-black text-white">
        <div className="min-h-screen flex justify-center">
          <div className="w-full max-w-4xl border-x border-zinc-800">
            <Navbar />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
