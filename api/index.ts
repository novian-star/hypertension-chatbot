import { VercelRequest, VercelResponse } from '@vercel/node';
import { LINEEvent, LINEMessage, LINEPostback, LINEReplyData } from '../types/line';
import { parse } from 'yaml';

/**
 * LINE messaging API token.
 *
 * API token can be found in LINE Developer > `channel-name` > Messaging API > Channel Access Token
 */
const LINE_MESSAGING_API_TOKEN = (() => {
  const TOKEN = process.env.LINE_MESSAGING_API_TOKEN;

  if (!TOKEN) {
    throw new Error('LINE_MESSAGING_API_TOKEN was not provided.');
  }

  return TOKEN;
})();

const REPLY_DATA_URL = (() => {
  const URL = process.env.REPLY_DATA_URL;

  if (!URL) {
    throw new Error('REPLY_DATA_URL was not provided.');
  }

  return URL;
})();

export default async function handler(request: VercelRequest, response: VercelResponse) {
  try {
    if (request.method === 'POST') {
      const { body } = request as { body: { destination: string; events: LINEEvent[] } };

      // Webhook verification.
      if (body.events.length === 0) {
        console.log('Webhook verification success.');

        return response.status(200).send('Webhook verification success.');
      }

      // Handles event.
      const event = body.events[0];

      let reply = null;

      // Message event
      if (event.type === 'message') {
        reply = await handleMessageEvent(event.message);
      }
      // Postback event
      else if (event.type === 'postback') {
        const result = handlePostbackEvent(event.postback);
      }

      console.log();

      await replyLINE(event.replyToken, reply?.response || []);
    }

    return response.status(200).send('Hello');
  } catch (error) {
    console.error(error);

    return response.status(500).send('Internal server error.');
  }
}

/**
 * Handles LINE message event.
 */
async function handleMessageEvent(message: LINEMessage) {
  const replies = await getReplyData();

  // Handles text message.
  if (message.type === 'text') {
    const textMessageReplies = replies.message.text;

    return textMessageReplies.find((reply) => reply.text === message.text);
  }
  // Handles sticker message.
  else if (message.type === 'sticker') {
    console.log(message);
  }
}

/**
 * Handles LINE postback event.
 */
function handlePostbackEvent(postback: LINEPostback) {
  console.log(postback);
}

async function replyLINE(token: string, messages: any[]) {
  const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message';

  const LINE_HEADER = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${LINE_MESSAGING_API_TOKEN}`,
  };

  const response = await fetch(`${LINE_MESSAGING_API}/reply`, {
    headers: {
      ...LINE_HEADER,
    },

    method: 'POST',

    body: JSON.stringify({
      replyToken: token,
      messages,
    }),
  });

  const jsonData = await response.json();

  if (!response.ok) console.error(jsonData);

  console.log(response);

  return { success: response.ok, response: jsonData };
}

async function getReplyData(): Promise<LINEReplyData> {
  const response = await fetch(REPLY_DATA_URL);

  const blob = await response.blob();

  const text = await blob.text();

  const replies = parse(text);

  return replies;
}
