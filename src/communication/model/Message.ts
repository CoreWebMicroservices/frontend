export interface SmsPayload {
  phoneNumber: string;
  message: string;
}

export interface EmailPayload {
  emailType: "txt" | "html";
  cc?: string[];
  bcc?: string[];
  sender?: string;
  senderName?: string;
  subject: string;
  recipient: string;
  body: string;
}

export interface Message {
  uuid: string;
  type: "sms" | "email";
  status: "created" | "enqueued" | "sent" | "failed";
  userId: string;
  createdAt: string;
  payload: SmsPayload | EmailPayload;
}

export interface MessageFilter {
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}
