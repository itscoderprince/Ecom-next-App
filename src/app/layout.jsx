import "./globals.css";
import { Assistant } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import GlobalProvider from "@/components/Application/GlobalProvider";

const assistant = Assistant({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/"),
  title: {
    default: "Panda Bees | Premium Online Shopping",
    template: "%s | Panda Bees"
  },
  description: "Welcome to Panda Bees, your one-stop destination for premium products. Shop the latest trends with confidence and enjoy exclusive deals.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${assistant.className} antialiased`}>
        <GlobalProvider>
          {children}
          <Toaster />
        </GlobalProvider>
      </body>
    </html>
  );
}
