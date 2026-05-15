import { createError, readBody, sendStream, setResponseStatus } from 'h3';
import { randomUUID } from 'node:crypto';
import { sendDiscordLog } from '../utils/discordLogger';
import { getMissingFields, type AdvicePayload } from '../utils/advicePrompt';

export default defineEventHandler(async (event) => {
  const startTime = Date.now();
  const requestId = randomUUID();

  try {
    const input = await readBody(event) as AdvicePayload;
    const missingFields = getMissingFields(input);

    if (missingFields.length) {
      await sendDiscordLog(
        `[RequestID: ${requestId}] Missing data in '/advice' request. Required fields missing: ${missingFields.join(', ')}`,
        'WARNING'
      );
      setResponseStatus(event, 400);
      return {
        success: false,
        error: 'Missing fields! Please provide all required data.',
        missingFields: {
          birthDate: input.birthDate,
          gender: input.gender,
          height: input.height,
          weight: input.weight,
          language: input.language
        }
      };
    }

    const encoder = new TextEncoder();

    await sendDiscordLog(
      `[RequestID: ${requestId}] '/advice' request started. IP: ${event.node.req.socket.remoteAddress || 'unknown'}`,
      'INFO'
    );

    const stream = new ReadableStream({
      async start(controller) {
        try {
          controller.enqueue(encoder.encode('The local AI model has been removed.'));
          controller.close();

          await sendDiscordLog(
            `[RequestID: ${requestId}] '/advice' request successfully processed. Duration: ${Date.now() - startTime}ms.`,
            'INFO'
          );
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          await sendDiscordLog(
            `[RequestID: ${requestId}] Error during streaming (/advice): ${errorMessage}.`,
            'ERROR'
          );
          controller.enqueue(encoder.encode('An error occurred during the process. Please try again.\n'));
          controller.close();
        }
      }
    });

    event.node.res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return sendStream(event, stream);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    await sendDiscordLog(`[RequestID: ${requestId}] /advice handler error: ${errorMessage}`, 'ERROR');
    throw createError({ statusCode: 500, statusMessage: errorMessage || 'Advice generation failed' });
  }
});