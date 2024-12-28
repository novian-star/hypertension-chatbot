import { VercelRequest, VercelResponse } from '@vercel/node';
import { LINEEvent, LINEMessage, LINEPostback, LINEReply, LINEReplyData, ResponseDataDTO } from '../types/line';
import { parse } from 'yaml';
import fs from 'fs';
import path from 'path';
import QueryString from 'querystring';

export default async (request: VercelRequest, response: VercelResponse) => {
  // Handles LINE webhook event.
  if (request.method === 'POST') {
    const body = request.body;

    // Handles LINE webhook verification.
    if (body.destination && body.events.length === 0) {
      console.log('LINE webhook verified');

      return response.status(200).send(body.destination);
    }
    // Handles LINE events.
    else if (body.destination && body.events.length > 0) {
      const event = body.events[0] as LINEEvent;

      console.log('LINE event:', event);

      // Handles LINE events.
      const replies = await handleLINEEvent(event);

      console.log('LINE replies:', replies);

      // Replies to the LINE event.
      await replyLINEMessage(event.replyToken, replies);
    } else {
      return response.status(200).send('No events found');
    }
  }

  return response.status(200).send('Hypertension Chatbot API');
};

const handleLINEEvent = async (event: LINEEvent) => {
  const responses = await getResponseData();

  switch (event.type) {
    case 'message':
      return handleLINEMessage(event.message, responses.message);
    case 'postback':
      return handleLINEPostback(event.postback, responses.postback);
    default:
      return [
        {
          type: 'text',
          text: 'ขออภัย เรายังไม่รองรับข้อความประเภทนี้ 🥲',
        },
      ] satisfies LINEReply[];
  }
};

const handleLINEMessage = (message: LINEMessage, responses: ResponseDataDTO['message']) => {
  let response = (() => {
    switch (message.type) {
      case 'text':
        return (responses.text.find((response) => {
          return response.texts.includes(message.text);
        })?.replies || []) satisfies LINEReply[];
      default:
        return [
          {
            type: 'text',
            text: 'ขออภัย เรายังไม่รองรับข้อความประเภทนี้ 🥲',
          },
        ] satisfies LINEReply[];
    }
  })();

  if (response.length === 0) {
    response = [
      {
        type: 'text' as const,
        text: 'ขออภัย เราไม่เข้าใจข้อความของคุณ 🥺',
      },
    ] satisfies LINEReply[];
  }

  return response;
};

const handleLINEPostback = (postback: LINEPostback, responses: ResponseDataDTO['postback']) => {
  const data = QueryString.parse(postback.data);

  let response = (() => {
    if (data.question) {
      return (responses.question.find((_q: any) => {
        return _q.questions.includes(data.question);
      })?.replies || []) satisfies LINEReply[];
    }
  })();

  if (response.length === 0) {
    response = [
      {
        type: 'text' as const,
        text: 'ขออภัย เราไม่ได้รองรับข้อมูลของคุณ 🥺',
      },
    ] satisfies LINEReply[];
  }

  return response;
};

/**
 * Fetches response data from a primary URL specified in the environment variable `RESPONSE_DATA_URL`.
 * If the primary URL fetch fails, it falls back to a local file URL `/public/response.yaml`.
 *
 * @returns {Promise<any>} The parsed YAML response data.
 * @throws {Error} If both the primary and fallback URL fetches fail or if the content type is unsupported.
 */
async function getResponseData(): Promise<ResponseDataDTO> {
  const fallbackDataURL = '/public/response.yaml';

  const dataPath = path.join(process.cwd() + fallbackDataURL);

  const file = await fs.promises.readFile(dataPath, 'utf-8');

  return parse(file);
}

async function replyLINEMessage(replyToken: string, replies: LINEReply[]) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
  };

  const body = JSON.stringify({
    replyToken,
    messages: replies,
  });

  const response = await fetch('https://api.line.me/v2/bot/message/reply', {
    method: 'POST',
    headers,
    body,
  });

  if (!response.ok) {
    const body = await response.json();

    console.error('Failed to reply to LINE event:', body);
  }
}
