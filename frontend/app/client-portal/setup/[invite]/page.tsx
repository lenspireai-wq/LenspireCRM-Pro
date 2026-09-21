import type { Metadata } from "next";
import ClientSetupForm from "./ClientSetupForm";

type SetupPageProps = {
  searchParams: Promise<{ studio?: string | string[] }>;
};

export async function generateMetadata({ searchParams }: SetupPageProps): Promise<Metadata> {
  const studio = (await searchParams).studio;
  const studioName = (Array.isArray(studio) ? studio[0] : studio)?.trim() || "Studio";

  return {
    title: `${studioName} Client Portal`,
    description: `Secure client access provided by ${studioName}.`,
    applicationName: `${studioName} Client Portal`,
  };
}

export default function ClientSetupPage() {
  return <ClientSetupForm />;
}
