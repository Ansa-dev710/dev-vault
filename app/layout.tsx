import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "sonner"; // Step 1: Import Toaster

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        {children}
        {/* Step 2: Add Toaster here */}
        <Toaster 
          position="bottom-right" 
          richColors 
          expand={false}
          theme="system" // Ye auto-detect karega light/dark mode
        />
      </body>
    </html>
  );
}