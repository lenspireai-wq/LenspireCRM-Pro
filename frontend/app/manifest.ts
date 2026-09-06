import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LenspireCRM Pro",
    short_name: "LenspireCRM",
    description: "Photography studio CRM for sales, operations, accounts, and production.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#08101c",
    theme_color: "#7367f0",
    orientation: "portrait",
    categories: ["business", "productivity"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
      { src: "/apple-icon.svg", sizes: "180x180", type: "image/svg+xml", purpose: "any" },
    ],
    shortcuts: [
      {
        name: "New lead",
        short_name: "Lead",
        description: "Add a new lead to your sales pipeline",
        url: "/?action=new-lead&section=Sales",
        icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
      },
      {
        name: "Today's events",
        short_name: "Today",
        description: "See the events scheduled for today",
        url: "/?section=Calendar",
        icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
      },
      {
        name: "Pending payments",
        short_name: "Payments",
        description: "Open the collections dashboard",
        url: "/?section=Accounts",
        icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
      },
      {
        name: "Production board",
        short_name: "Production",
        description: "Check jobs in production",
        url: "/?section=Production",
        icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
      },
    ],
  };
}
