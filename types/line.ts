export type WebhookVerification = {
  destination: string;
  events: never[];
};

/* -------------------------------------------------------------------------- */

export type LINEEvent = LINEMessageEvent | LINEPostbackEvent;

export type LINEBaseEvent = {
  type: string;
  webhookEventId: string;
  replyToken: string;
};

export type LINEMessageEvent = LINEBaseEvent & {
  type: 'message';
  message: LINEMessage;
};

export type LINEPostbackEvent = LINEBaseEvent & {
  type: 'postback';
  postback: any;
};

/* -------------------------------------------------------------------------- */

export type LINEMessage = LINETextMessage | LINEStickerMessage;

export type LINEBaseMessage = {
  id: string;
  quoteToken: string;
  text: string;
};

export type LINETextMessage = LINEBaseMessage & {
  type: 'text';
  text: string;
};

export type LINEStickerMessage = LINEBaseMessage & {
  type: 'sticker';
  stickerId: string;
  packageId: string;
  stickerResourceType: 'STATIC' | 'ANIMATION';
  keywords: string[];
};

/* -------------------------------------------------------------------------- */

export type LINEPostback<Postback = any> = Postback;

/* -------------------------------------------------------------------------- */

export type LINEReplyData = {
  message: {
    text: {
      text: string;
      response: LINEReply[];
    }[];
  };
};

export type LINEBaseReply = {
  type: string;
};

export type LINEReply = LINETextReply | LINEImageReply | LINEStickerReply;

export type LINETextReply = LINEBaseReply & {
  type: 'text';
  text: string;
};

export type LINEStickerReply = LINEBaseReply & {
  type: 'sticker';
  packageId: string;
  stickerId: string;
  quoteToken?: string;
};

export type LINEImageReply = LINEBaseReply & {
  type: 'image';
  originalContentUrl: string;
  previewImageUrl: string;
};
