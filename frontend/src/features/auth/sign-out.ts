/**
 * Leaves the app after logging out or deleting the account. A full page load drops every
 * cached learner query and wins over the sign-in redirect that protected pages
 * (RequireAuth) would otherwise start once the session is gone.
 */
export function reloadSignedOut(locale: string): void {
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- intentional full reload
  window.location.assign(`/${locale}`);
}
