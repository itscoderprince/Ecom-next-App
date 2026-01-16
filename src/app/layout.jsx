import { Toaster } from "@/components/ui/sonner"

import { Assistant } from "next/font/google";
import "./globals.css";
import GlobalProvider from "@/components/Application/GlobalProvider";

const assistantFont = Assistant({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "Panda Bees | Premium Online Shopping",
    template: "%s | Panda Bees"
  },
  description: "Welcome to Panda Bees, your one-stop destination for premium products. Shop the latest trends with confidence and enjoy exclusive deals.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${assistantFont.variable} antialiased`}>
        <GlobalProvider>
          {children}
          <Toaster />
        </GlobalProvider>
      </body>
    </html>
  );
}
