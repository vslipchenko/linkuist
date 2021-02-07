// Following describes what tags are used to fetch [metadata]
// [title] - meta name="title" | meta property="og/twitter:site_name" | meta itemprop="name"
// [description] - meta name="description" | meta property="og/twitter:description" | meta itemprop="description"
// [image] - meta property="og/twitter:image" | meta itemprop="image"
// [icon] - link rel="shortcut icon / icon / apple-touch-icon"
export const META_TITLE_REGEXP = /(<title[^>]*>((?!<\/title>).)*<\/title>)|(<meta[^>]*(?=(property=["']((og)|(twitter)):site_name['"])|(name=["']title['"])|(itemprop=["']name['"]))[^>]*)/;
export const META_DESCRIPTION_REGEXP = /<meta[^>]*(?=(property=["']((og)|(twitter)):description['"])|(((itemprop)|(name))=["']description['"]))[^>]*/;
export const META_IMAGE_REGEXP = /<meta[^>]*(?=(property=["']((og)|(twitter)):image['"])|(itemprop=["']image['"]))[^>]*/;
export const META_ICON_REGEXP = /<link[^>]*(?=rel=["'][^"']*icon[^'"]*['"])[^>]*/; // [rel] contains 'icon' phrase
// export const META_ICON_REGEXP = /<link[^>]*(?=rel=["']((shortcut\s*)?(apple-touch-)?icon(-precomposed)?(\s*shortcut)?)['"])[^>]*/;
// export const META_CONTENT_REGEXP = /(?<=content=["'])([^'"]+)(?=['"])/;
// export const META_TITLE_TAG_CONTENT_REGEXP = /(?<=<title[^>]*>).+(?=<\/title>)/;
