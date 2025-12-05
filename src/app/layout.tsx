// src/app/layout.tsx
import "../styles/globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions as any);

  return (
    <html lang="en">
      <body>
        <Providers>
          {/* Only show navbar when NOT logged in */}
          {!session && <Navbar />}
          {children}
        </Providers>
      </body>
    </html>
  );
}
