export const metadata = {
  title: "Refreshing LenspireCRM",
  robots: { index: false, follow: false },
};

export default function ResetMobileCachePage() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#171614", color: "#fff7ea", fontFamily: "Arial, sans-serif", textAlign: "center" }}>
      <meta httpEquiv="refresh" content="3;url=/" />
      <section>
        <h1 style={{ margin: "0 0 12px" }}>Refreshing your CRM</h1>
        <p style={{ margin: 0, color: "#d8cbb7" }}>Old offline files have been cleared. Returning you to the secure sign-in page…</p>
      </section>
    </main>
  );
}
