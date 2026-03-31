import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "sonner"; 

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        {children}
        
        <Toaster 
          position="bottom-right" 
          richColors 
          expand={false}
          theme="system" 
        />
      </body>
    </html>
  );
}