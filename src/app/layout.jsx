import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import GlobalProvider from "@/components/Application/GlobalProvider";

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Assistant:wght@200..800&display=swap" rel="stylesheet" />
      </head>
      <body className={`antialiased`}>
        <GlobalProvider>
          {children}
          <Toaster />
        </GlobalProvider>
      </body>
    </html>
  );
}
