import { pipeline, env, TextStreamer } from '@huggingface/transformers';
import { createError, readBody, sendStream, setResponseStatus } from 'h3';
import { randomUUID } from 'node:crypto';
import { sendDiscordLog } from '../utils/discordLogger';
import { createSystemPrompt, createUserPrompt, getMissingFields, type AdvicePayload } from '../utils/advicePrompt';

let pipePromise: Promise<any> | null = null;

function getPipe() {
  if (!pipePromise) {
    env.cacheDir = './.cache';
    pipePromise = pipeline('text-generation', 'zeeshaan-ai/Medical-Summary-Notes-ONNX');
  }
  return pipePromise;
}

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

    const pipe = await getPipe();
    const encoder = new TextEncoder();

    await sendDiscordLog(
      `[RequestID: ${requestId}] '/advice' request started. IP: ${event.node.req.socket.remoteAddress || 'unknown'}`,
      'INFO'
    );

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const chatMessages = [
            { role: 'system', content: createSystemPrompt() },
            { role: 'user', content: createUserPrompt(input) },
            ...((input.messages || []) as any[])
          ];

          const streamer = new TextStreamer(pipe.tokenizer, {
            skip_prompt: true,
            callback_function: (token: string) => {
              controller.enqueue(encoder.encode(token));
            }
          });

          await pipe(chatMessages, {
            max_new_tokens: 512,
            temperature: 0.7,
            top_k: 100,
            top_p: 0.8,
            do_sample: true,
            streamer
          });

          controller.close();
          await sendDiscordLog(
            `[RequestID: ${requestId}] '/advice' request successfully processed. Duration: ${Date.now() - startTime}ms.`,
            'INFO'
          );
        } catch (error: any) {
          console.error('[Sanovise - Error] Error during streaming (/advice): ', error);
          await sendDiscordLog(
            `[RequestID: ${requestId}] Error during streaming (/advice): ${error?.message || String(error)}.`,
            'ERROR'
          );
          controller.enqueue(encoder.encode('An error occurred during the process. Please try again.\n'));
          controller.close();
        }
      }
    });

    event.node.res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return sendStream(event, stream);
  } catch (error: any) {
    console.error('[Sanovise - Error] /advice error: ', error);
    await sendDiscordLog(`[RequestID: ${requestId}] /advice handler error: ${error?.message || String(error)}`, 'ERROR');
    throw createError({ statusCode: 500, statusMessage: error?.message || 'Advice generation failed' });
  }
});
