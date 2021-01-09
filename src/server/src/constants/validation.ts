// Most of these rules relies on the client's validation.ts
export const EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
// Alphanumeric with .- separators in between
export const USERNAME_REGEXP = /^(?=.{1,33}$)[a-z0-9]+([.-]?[a-z0-9]+)*$/;
// Should have at least one number and one letter
export const PASSWORD_REGEXP = /^(?=.{8,50}$)(?=.*[0-9])(?=.*[A-Za-z])[0-9A-Za-z&$#!@_^%+-]*$/;
// export const EMAIL_MAXLENGTH = 254;
export const BOOKMARK_TAG_LETTER_REGEXP = /[a-zA-Z0-9]/; // TODO russian tags
