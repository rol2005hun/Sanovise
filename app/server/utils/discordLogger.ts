const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

export async function sendDiscordLog(message: string, type: 'INFO' | 'WARNING' | 'ERROR' = 'INFO') {
  if (!discordWebhookUrl) return;

  let prefix = '';
  switch (type) {
    case 'INFO':
      prefix = '🔵 [INFORMATION]';
      break;
    case 'WARNING':
      prefix = '🟠 [WARNING]';
      break;
    case 'ERROR':
      prefix = '🔴 [ERROR]';
      break;
    default:
      prefix = '[LOG]';
      break;
  }

  const finalMessage = `${prefix} ${new Date().toLocaleString('hu-HU', { timeZone: 'Europe/Budapest' })}: ${message}`;

  try {
    await fetch(discordWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: finalMessage })
    });
  } catch (discordError) {
    console.error('[Discord Logger] Error while sending message to Discord:', discordError);
  }
}
