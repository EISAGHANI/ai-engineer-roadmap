import type { Locale } from "./config";
import en, { type Messages } from "./messages/en";
import de from "./messages/de";

const MESSAGES: Record<Locale, Messages> = { en, de };

export function getMessages(locale: Locale): Messages {
  return MESSAGES[locale];
}

export type { Messages };
export * from "./config";
