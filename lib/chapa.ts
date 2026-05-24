export const CHAPA_BASE_URL = "https://api.chapa.co/v1";

export interface ChapaInitializeResponse {
  message: string;
  status: string;
  data: {
    checkout_url: string;
  };
}

export interface ChapaVerifyResponse {
  message: string;
  status: string;
  data: {
    first_name: string;
    last_name: string;
    email: string;
    currency: string;
    amount: string;
    charge: string;
    mode: string;
    method: string;
    type: string;
    status: string;
    reference: string;
    tx_ref: string;
    customization: {
      title: string;
      description: string;
    };
    meta: Record<string, string>;
    created_at: string;
    updated_at: string;
  };
}

export async function initializePayment({
  amount,
  currency = "ETB",
  email,
  firstName,
  lastName,
  txRef,
  callbackUrl,
  returnUrl,
  title,
  description,
  meta,
}: {
  amount: number;
  currency?: string;
  email: string;
  firstName: string;
  lastName: string;
  txRef: string;
  callbackUrl: string;
  returnUrl: string;
  title: string;
  description: string;
  meta?: Record<string, string>;
}): Promise<ChapaInitializeResponse> {
  const response = await fetch(`${CHAPA_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: amount.toString(),
      currency,
      email,
      first_name: firstName,
      last_name: lastName,
      tx_ref: txRef,
      callback_url: callbackUrl,
      return_url: returnUrl,
      "customization[title]": title,
      "customization[description]": description,
      meta,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message ?? "Chapa initialization failed");
  }

  return response.json();
}

export async function verifyPayment(txRef: string): Promise<ChapaVerifyResponse> {
  const response = await fetch(`${CHAPA_BASE_URL}/transaction/verify/${txRef}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message ?? "Chapa verification failed");
  }

  return response.json();
}

export function generateTxRef(userId: string, courseId: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `xybersec-${userId.slice(-6)}-${courseId.slice(-6)}-${timestamp}-${random}`;
}
