export default function Home() {
  return (
    <main style={{fontFamily:'Inter, system-ui, Arial', padding: 24, lineHeight: 1.5}}>
      <h1>WhatsApp AI Agent</h1>
      <p>Backend is running. Use this URL as your WhatsApp Webhook:</p>
      <pre style={{background:'#f5f5f5', padding:12, borderRadius:8}}>{`https://agentic-bc9ae822.vercel.app/api/webhook`}</pre>
      <h2>Env vars</h2>
      <ul>
        <li><code>META_WHATSAPP_TOKEN</code></li>
        <li><code>META_VERIFY_TOKEN</code></li>
        <li><code>META_PHONE_NUMBER_ID</code></li>
        <li><code>OPENAI_API_KEY</code> (optional)</li>
        <li><code>UPSTASH_REDIS_REST_URL</code> (optional)</li>
        <li><code>UPSTASH_REDIS_REST_TOKEN</code> (optional)</li>
      </ul>
    </main>
  );
}
