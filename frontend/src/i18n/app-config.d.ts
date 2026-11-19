import type messages from "@/messages/en.json";
import type { routing } from "./routing";

// Types useLocale() and every translation key against the English catalogue
// (messages.test.ts keeps the Spanish one in sync).
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
