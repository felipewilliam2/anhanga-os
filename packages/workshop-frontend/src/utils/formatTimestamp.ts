// Timestamp formatting for chat UI tooltips.
//
// Pinned to 'pt-BR' rather than the browser's preferred locale: the UI language is fixed to
// Portuguese (not locale-dependent), so a browser-locale date/time next to fixed Portuguese prose
// would read as inconsistent (e.g. pt-BR text next to an en-US "5/11/26, 5:09 PM" date). This also
// matches actual pt-BR convention, which is near-universally 24h — there's no meaningful "respect
// the visitor's own locale" case left once the surrounding text no longer varies by locale either.
//
// The formatter instance is cached at module scope because constructing `Intl.DateTimeFormat` is
// surprisingly expensive and a chat view can render hundreds of timestamps.

let fullTimestampFormatter: Intl.DateTimeFormat | null = null;

function getFullTimestampFormatter(): Intl.DateTimeFormat {
  if (fullTimestampFormatter === null) {
    fullTimestampFormatter = new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }
  return fullTimestampFormatter;
}

/**
 * Format a date as a short pt-BR date + time, e.g. "11/05/2026, 17:09". Intended for chat
 * timestamp tooltips that need to disambiguate which day a message belongs to.
 */
export function formatFullTimestamp(date: Date): string {
  return getFullTimestampFormatter().format(date);
}
