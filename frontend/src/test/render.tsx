import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactElement } from "react";
import en from "@/messages/en.json";
import es from "@/messages/es.json";

const catalogues = { en, es };

/** Renders a component with the same providers the app uses. */
export function renderWithProviders(ui: ReactElement, locale: "en" | "es" = "en") {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <NextIntlClientProvider locale={locale} messages={catalogues[locale]} timeZone="UTC">
        {ui}
      </NextIntlClientProvider>
    </QueryClientProvider>,
  );
}

/** Replaces fetch with a router of canned JSON responses keyed by "METHOD /path". */
export function mockFetch(routes: Record<string, unknown>) {
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(input.toString());
    const key = `${init?.method ?? "GET"} ${url.pathname}`;
    if (!(key in routes)) return new Response(null, { status: 404 });
    return new Response(JSON.stringify(routes[key]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}
