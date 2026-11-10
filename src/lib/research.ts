/** Format checks for research identifiers. These validate shape only; they do not confirm that a record exists. */

export const isValidDoi = (value: string): boolean => /^10\.\d{4,9}\/\S+$/.test(value);

export const isValidOrcid = (value: string): boolean => /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(value);

export const doiUrl = (doi: string): string => `https://doi.org/${doi}`;

export const orcidUrl = (orcid: string): string => `https://orcid.org/${orcid}`;

export const isHttpsUrl = (value: string): boolean => /^https:\/\/\S+$/.test(value);
