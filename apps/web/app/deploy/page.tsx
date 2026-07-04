import { validateDeploymentReadiness } from "@calcom/lib/deployment/readiness";

export const metadata = {
  title: "Deployment Setup",
  description: "Configure environment variables to finish deploying PraxisTermin.",
};

export default function DeploySetupPage() {
  const readiness = validateDeploymentReadiness();
  const missing = readiness.checks.filter((item) => !item.ok);

  return (
    <div className="bg-subtle min-h-screen px-6 py-16">
      <div className="bg-default mx-auto max-w-2xl rounded-xl p-8 shadow-sm">
        <h1 className="font-cal text-emphasis text-3xl">Deployment noch nicht fertig</h1>
        <p className="text-default mt-4 text-sm leading-6">
          Der Build auf Vercel war erfolgreich, aber es fehlen noch Umgebungsvariablen für den
          Live-Betrieb. Trage die folgenden Werte unter{" "}
          <strong>Vercel → Project → Settings → Environment Variables</strong> ein und starte danach
          ein Redeploy.
        </p>

        <ul className="mt-6 space-y-3">
          {missing.map((item) => (
            <li key={item.id} className="border-subtle rounded-lg border p-4">
              <p className="text-emphasis text-sm font-medium">{item.message}</p>
            </li>
          ))}
        </ul>

        <div className="bg-muted mt-8 rounded-lg p-4">
          <p className="text-emphasis text-sm font-medium">Mindest-Konfiguration (Production)</p>
          <pre className="text-default mt-3 overflow-x-auto text-xs leading-6">
{`DATABASE_URL=postgresql://...
DATABASE_DIRECT_URL=postgresql://...
NEXTAUTH_SECRET=<openssl rand -base64 32>
CALENDSO_ENCRYPTION_KEY=<openssl rand -base64 24>
NEXT_PUBLIC_WEBAPP_URL=https://your-app.vercel.app
NEXTAUTH_URL=https://your-app.vercel.app/api/auth`}
          </pre>
        </div>

        <p className="text-default mt-6 text-sm">
          Nach dem Setzen der Variablen: Datenbank migrieren mit{" "}
          <code className="text-xs">yarn db-deploy</code> (lokal gegen Production-DB oder CI).
          Status prüfen: <code className="text-xs">/api/health/deployment</code>
        </p>
      </div>
    </div>
  );
}
