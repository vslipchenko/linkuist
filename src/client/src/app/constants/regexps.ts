export const USERNAME_MAXLENGTH = 33; // excluding @ char
export const EMAIL_MAXLENGTH = 254;
export const PASSWORD_MINLENGTH = 8;
export const PASSWORD_MAXLENGTH = 50;
/* @angular/forms/esm2015/src/validators.js EMAIL_REGEXP */
export const EMAIL_REGEXP =
  /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
export const USERNAME_SEPARATORS = '-._';
// Alphanumeric with .- separators in between
export const USERNAME_REGEXP = RegExp(`^[a-z0-9]+([${USERNAME_SEPARATORS}]?[a-z0-9]+)*$`);
// 2 <= username length <= 34 (including @ char)
export const URL_USERNAME_REGEXP = RegExp(
  `(?=.{2,${USERNAME_MAXLENGTH + 1}}$)@[a-z0-9]+([${USERNAME_SEPARATORS}]?[a-z0-9]+)*`,
);
export const PASSWORD_SPECIAL_CHARS_POOL = '&$#!@_^%+-';
// Should have at least one number and one letter https://regex101.com/r/Pmzmuj/3
export const PASSWORD_REGEXP = RegExp(
  `^(?=.*[0-9])(?=.*[A-Za-z])[0-9A-Za-z${PASSWORD_SPECIAL_CHARS_POOL}]*$`,
);
export const LINKARD_TAG_LETTER_REGEXP = /[a-zA-Z0-9]/; // TODO russian tags
