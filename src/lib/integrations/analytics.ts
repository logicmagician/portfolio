// Provider-independent analytics configuration. Analytics stays off unless an ID is set, and the
// ID is public by design (it is sent to the browser). Add a privacy notice before enabling it.

export const analyticsId: string = (process.env.NEXT_PUBLIC_ANALYTICS_ID ?? "").trim();

/** Google Analytics 4 measurement IDs look like G-XXXXXXXXXX. */
export const isValidGa4Id = (value: string): boolean => /^G-[A-Z0-9]{4,20}$/.test(value);

export const isAnalyticsEnabled = (id: string = analyticsId): boolean => isValidGa4Id(id);
