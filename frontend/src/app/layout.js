import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { Sidebar } from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";



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
      </body>
    </html>
  );
}
