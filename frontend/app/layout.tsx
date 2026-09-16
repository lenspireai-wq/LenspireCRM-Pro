import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./studio-light.css";
import "./studio-dark-modules.css";
import "./studio-dark.css";
import "./event-columns.css";
import "./mobile-scroll.css";
import "./studio-neon.css";
import "./studio-blush.css";
import { QueryProvider } from "@/components/QueryProvider";
import { ThemeProvider } from "@/components/ThemeToggle";
import { GlobalErrorBoundary } from "@/components/GlobalErrorBoundary";

export const metadata: Metadata = {
  title: "Ankit Studios",
  description: "Ankit Studios workspace, powered by LenspireCRM.",
  applicationName: "Ankit Studios",
  appleWebApp: { capable: true, title: "Ankit Studios", statusBarStyle: "black-translucent" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
};

const themeBootstrap = `(() => {
  try {
    const stored = localStorage.getItem('lenspire-theme');
    if (stored === 'light' || stored === 'dark' || stored === 'blush' || stored === 'neon') {
      document.documentElement.dataset.theme = stored;
      document.documentElement.style.colorScheme = stored === 'light' || stored === 'blush' ? 'light' : 'dark';
      return;
    }
    document.documentElement.dataset.theme = 'light';
    document.documentElement.style.colorScheme = 'light';
  } catch (e) {
    document.documentElement.dataset.theme = 'light';
    document.documentElement.style.colorScheme = 'light';
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
              {children}
            </ThemeProvider>
          </QueryProvider>
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}
