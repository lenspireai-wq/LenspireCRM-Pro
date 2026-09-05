import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { QueryProvider } from "@/components/QueryProvider";
import { ThemeProvider } from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "LenspireCRM Pro",
  description: "Photography studio CRM for sales, operations, accounts, and production.",
  applicationName: "LenspireCRM Pro",
  appleWebApp: { capable: true, title: "LenspireCRM", statusBarStyle: "black-translucent" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#7367f0",
  width: "device-width",
  initialScale: 1,
};

const themeBootstrap = `(() => {
  try {
    const stored = localStorage.getItem('lenspire-theme');
    const theme = stored === 'light' || stored === 'dark' ? stored : 'dark';
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch (e) {
    document.documentElement.dataset.theme = 'dark';
  }
})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body suppressHydrationWarning>
        <QueryProvider>
          <ThemeProvider>
            <ServiceWorkerRegister />
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
