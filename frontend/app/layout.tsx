import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./studio-light.css";
import "./studio-dark-modules.css";
import "./studio-dark.css";
import "./event-columns.css";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { QueryProvider } from "@/components/QueryProvider";
import { ThemeProvider } from "@/components/ThemeToggle";
import { GlobalErrorBoundary } from "@/components/GlobalErrorBoundary";

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
    if (stored === 'light' || stored === 'dark') {
      document.documentElement.dataset.theme = stored;
      document.documentElement.style.colorScheme = stored;
      return;
    }
    const host = window.location.hostname;
    const theme = host === 'crm.lenspireai.com' ? 'light' : 'dark';
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
        <GlobalErrorBoundary>
          <QueryProvider>
            <ThemeProvider>
              <ServiceWorkerRegister />
              {children}
            </ThemeProvider>
          </QueryProvider>
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}
