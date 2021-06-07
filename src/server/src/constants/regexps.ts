// Most of these rules relies on the client's validation regexps
export const EMAIL_REGEXP =
  /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
// Alphanumeric with .- separators in between
export const USERNAME_REGEXP = /^(?=.{1,33}$)[a-z0-9]+([-._]?[a-z0-9]+)*$/;
// e.g. 5f8e142df79fbc499cc71775
export const USER_ID_REGEXP = /^[a-fA-F0-9]{24}$/;
// Should have at least one number and one letter
export const PASSWORD_REGEXP = /^(?=.{8,50}$)(?=.*[0-9])(?=.*[A-Za-z])[0-9A-Za-z&$#!@_^%+-]*$/;
// export const EMAIL_MAXLENGTH = 254;
export const LINKARD_TAG_LETTER_REGEXP = /[a-zA-Z0-9]/;

// Following describes what tags are used to fetch [metadata]
// [title] - meta name="title" | meta property="og/twitter:site_name" | meta itemprop="name"
// [description] - meta name="description" | meta property="og/twitter:description" | meta itemprop="description"
// [image] - meta property="og/twitter:image" | meta itemprop="image"
// [icon] - link rel="shortcut icon / icon / apple-touch-icon"
export const BASE_TAG_REGEXP = /<base[^>]*(?=[^>]*href=(?!("")|('')))[^>]*/; // https://regex101.com/r/hhEm2A/1
export const META_TITLE_REGEXP =
  /(<title[^>]*>((?!<\/title>).)+<\/title>)|(<meta[^>]*(?=[^>]*((property=["']((og)|(twitter)):title['"])|(name=["']title['"])))(?=[^>]*content=(?!("")|('')))[^>]*)/; // https://regex101.com/r/hAJqSN/1
export const META_SITE_NAME_REGEXP =
  /<meta[^>]*(?=[^>]*property=["']og:site_name['"])(?=[^>]*content=(?!("")|('')))[^>]*/; // https://regex101.com/r/bVRPXa/1
export const META_DESCRIPTION_REGEXP =
  /<meta[^>]*(?=[^>]*((property=["']((og)|(twitter)):description['"])|(name=["']description['"])))(?=[^>]*content=(?!("")|('')))[^>]*/; // https://regex101.com/r/J7MBnB/1
export const META_IMAGE_REGEXP =
  /<meta[^>]*(?=[^>]*(property=["']((og)|(twitter)):image['"]))(?=[^>]*content=(?!("")|('')))[^>]*/; // https://regex101.com/r/5JaKVk/1
export const META_ICON_REGEXP =
  /<link[^>]*(?=[^>]*rel=["'][^"']*icon[^'"]*['"])(?=[^>]*href=(?!("")|('')))[^>]*/; // https://regex101.com/r/PqbREv/1
// export const META_ICON_REGEXP = /<link[^>]*(?=rel=["']((shortcut\s*)?(apple-touch-)?icon(-precomposed)?(\s*shortcut)?)['"])[^>]*/;
// export const META_CONTENT_REGEXP = /(?<=content=["'])([^'"]+)(?=['"])/;
// export const META_TITLE_TAG_CONTENT_REGEXP = /(?<=<title[^>]*>).+(?=<\/title>)/;
