// Sandbox https://regex101.com/r/NBX4JK/1
export const META_TITLE_REGEXP = /((?<=<title[^>]*>).+(?=<\/title>))|((?<=<meta(?=.*((property="(og|twitter):(title|site_name)")|name="title")).*)(?<=content=")[^"]+)/;
// export const HTML_FAVICON_TAG = /(?=.*?<link)(?=.*rel=".*icon.*")(?=.*?href=".+")[^>]*>/;
// export const META_ICON = /(?<=<link(?=.*rel=".*icon.*").*)(?<=href=")[^"]+/;
export const META_ICON_REGEXP = /(?<=<link(?=.*rel="(?:.*\W)?icon(?:\W.*)?").*)(?<=href=")[^"]+/;
export const META_IMAGE_REGEXP = /(?<=<meta(?=.*property="(og|twitter):image").*)(?<=content=")[^"]+/;
export const META_DESCRIPTION_REGEXP = /(?<=<meta(?=.*((property="(og|twitter):description")|name="description")).*)(?<=content=")[^"]+/;
// export const META_DESCRIPTION_REGEXP = /(?<=<meta(?=.*(property="og:description"|name="description")).*)(?<=content=")[^"]+/;
