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
      replies: LINEReply[];
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
export type LINETemplateReply = {
  type: 'template';
  altText: string;
  template: LINETemplate;
};

export type LINETemplate = LINEButtonTemplate;

export type LINEButtonTemplate = {
  type: 'buttons';
  text: string;
  actions: LINEAction[];
};

export type LINEAction = LINEPostbackAction | LINEURIAction;

export type LINEPostbackAction = {
  type: 'postback';
  label: string;
  data: string;
  displayText?: string;
};

export type LINEURIAction = {
  type: 'uri';
  label: string;
  uri: string;
};

/* -------------------------------------------------------------------------- */

export type ResponseDataDTO = {
  message: {
    text: {
      texts: string[];
      replies: LINEReply[];
    }[];
  };
  postback: {
    [key: string]: Record<string, any> & {
      replies: LINEReply[];
    };
  };
};
