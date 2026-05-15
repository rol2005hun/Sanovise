import OpenAI from 'openai';
import { createError, readBody, sendStream, setResponseStatus } from 'h3';
import { randomUUID } from 'node:crypto';
import { sendDiscordLog } from '../utils/discordLogger';
import { createSystemPrompt, createUserPrompt, getMissingFields, type AdvicePayload } from '../utils/advicePrompt';

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'OPENAI_API_KEY is not set in environment variables.' });
  }

  return new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey,
    defaultHeaders: {
      'HTTP-Referer': 'https://app.sanovise.ranzak.site',
      'X-Title': 'Sanovise'
    }
  });
}

export default defineEventHandler(async (event) => {
  const startTime = Date.now();
  const requestId = randomUUID();

  try {
    const input = await readBody(event) as AdvicePayload;
    const missingFields = getMissingFields(input);

    if (missingFields.length) {
      await sendDiscordLog(
        `[RequestID: ${requestId}] Missing data in '/advice2' request. Required fields missing: ${missingFields.join(', ')}`,
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

    const model = input.selectedModel || 'openai/gpt-oss-120b:free';
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          await sendDiscordLog(
            `[RequestID: ${requestId}] '/advice2' request started. Model: ${model}. IP: ${event.node.req.socket.remoteAddress || 'unknown'}`,
            'INFO'
          );

          const chatMessages: OpenAI.ChatCompletionMessageParam[] = [
            { role: 'system', content: createSystemPrompt() },
            { role: 'user', content: createUserPrompt(input) },
            ...((input.messages || []) as OpenAI.ChatCompletionMessageParam[])
          ];

          const openai = getOpenAIClient();
          const responseStream = await openai.chat.completions.create({
            model,
            messages: chatMessages,
            stream: true,
            temperature: 0.7,
            top_p: 0.8
          });

          for await (const chunk of responseStream) {
            const content = chunk.choices?.[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }

          controller.close();
          await sendDiscordLog(
            `[RequestID: ${requestId}] '/advice2' request successfully processed. Duration: ${Date.now() - startTime}ms.`,
            'INFO'
          );
        } catch (error: any) {
          console.error('[Sanovise - Error] Error during streaming (/advice2): ', error);
          await sendDiscordLog(
            `[RequestID: ${requestId}] Error during streaming (/advice2): ${error?.message || String(error)}.`,
            'ERROR'
          );
          controller.enqueue(encoder.encode('An error occurred during the response generation. Please try again.\n'));
          controller.close();
        }
      }
    });

    event.node.res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return sendStream(event, stream);
  } catch (error: any) {
    console.error('[Sanovise - Error] /advice2 error: ', error);
    await sendDiscordLog(`[RequestID: ${requestId}] /advice2 handler error: ${error?.message || String(error)}`, 'ERROR');
    throw createError({ statusCode: 500, statusMessage: error?.message || 'Advice generation failed' });
  }
});
