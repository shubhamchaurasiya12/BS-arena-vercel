import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "BS Arena",
  description: "IITM BS Study Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen  text-gray-900">
        <AuthProvider>
          {/* Navbar always visible */}
          {/* <Navbar /> */}

          {/* Page content */}
          <main className="pt-5">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}