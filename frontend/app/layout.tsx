import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./studio-light.css";
import "./studio-dark-modules.css";
import "./studio-dark.css";
import "./event-columns.css";
import "./mobile-scroll.css";
import "./studio-neon.css";
import "./studio-blush.css";
import "./mobile-audit.css";
import { QueryProvider } from "@/components/QueryProvider";
import { ThemeProvider } from "@/components/ThemeToggle";
import { GlobalErrorBoundary } from "@/components/GlobalErrorBoundary";

export const metadata: Metadata = {
  title: "Studio Workspace",
  description: "Secure studio workspace.",
  applicationName: "Studio Workspace",
  appleWebApp: { capable: true, title: "Studio Workspace", statusBarStyle: "black-translucent" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
};

const themeBootstrap = `(() => {
  try {
    const stored = localStorage.getItem('lenspire-theme-mode');
    const legacy = localStorage.getItem('lenspire-theme');
    const mode = stored === 'light' || stored === 'dark' || stored === 'system'
      ? stored : (legacy === 'dark' || legacy === 'neon' ? 'dark' : 'light');
    const theme = mode === 'system' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : mode;
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.themeMode = mode;
    document.documentElement.dataset.accent = localStorage.getItem('lenspire-theme-accent') || 'violet';
    document.documentElement.style.colorScheme = theme;
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
