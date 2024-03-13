import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthProvider from "@/lib/SessionProvider";
import { ThemeProvider } from "@/lib/ThemesProvider";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bonsai | Task Manager",
  description: "A tree-based task manager for your productivity needs",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const session = await getServerSession(authOptions);
  return (
      <html lang="en" suppressHydrationWarning>
        <body className={"flex flex-col min-h-screen h-screen " + inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <AuthProvider>
              <Navbar />
              {children}
              <Toaster />
            </AuthProvider>
          </ThemeProvider>
        </body>
      </html>
    
  );
}
