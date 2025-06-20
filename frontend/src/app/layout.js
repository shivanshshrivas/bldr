import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { Sidebar } from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";
import { Toaster } from "@/components/ui/sonner";


export const metadata = {
  title: "Bldr",
  description: "Flagship Schedule Builder",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en"> 
      <body className={` antialiased`}>
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster />
      </body>
    </html>
  );
}
