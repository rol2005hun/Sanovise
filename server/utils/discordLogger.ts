import { Webhook } from 'discord-webhook-node';
import 'dotenv/config';

const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
const hook = discordWebhookUrl ? new Webhook(discordWebhookUrl) : null;

export const sendDiscordLog = async (message: string, type: 'INFO' | 'WARNING' | 'ERROR' = 'INFO') => {
    if (hook) {
        let prefix = '';
        let color = '';

        switch (type) {
            case 'INFO':
                prefix = '🔵 [INFORMATION]';
                color = '#007bff';
                break;
            case 'WARNING':
                prefix = '🟠 [WARNING]';
                color = '#ffc107';
                break;
            case 'ERROR':
                prefix = '🔴 [ERROR]';
                color = '#dc3545';
                break;
            default:
                prefix = '[LOG]';
                color = '#6c757d';
                break;
        }

        const finalMessage = `${prefix} ${new Date().toLocaleString('hu-HU', { timeZone: 'Europe/Budapest' })}: ${message}`;

        try {
            await hook.send(finalMessage);

            console.log(`[Discord Logger] Message sent to Discord (${type}).`);
        } catch (discordError) {
            console.error('[Discord Logger] Error while sending message to Discord:', discordError);
        }
    } else {
        console.warn('[Discord Logger] The Discord Webhook URL is bad configured. No log sent.');
    }
};