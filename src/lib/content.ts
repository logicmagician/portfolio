/**
 * Values containing these markers are unfinished placeholders. Components show
 * them as disabled instead of linking to a dead address.
 */
const PLACEHOLDER_PATTERN = /YOUR_|example\.com/;

export const isPlaceholder = (value: string): boolean => PLACEHOLDER_PATTERN.test(value);
