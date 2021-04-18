import {get as httpsGet, RequestOptions} from 'https';
import {get as httpGet, IncomingMessage} from 'http';
import {parseUrl} from './parsers';
import {
  BASE_TAG_REGEXP,
  META_DESCRIPTION_REGEXP,
  META_ICON_REGEXP,
  META_IMAGE_REGEXP,
  META_SITE_NAME_REGEXP,
  META_TITLE_REGEXP,
} from '../constants/regexps';
import {forEachMatch} from './processors';

enum MetadataElements {
  'hostname',
  'sitename',
  'title',
  'description',
  'image',
  'icon',
}

type Metadata = Record<keyof typeof MetadataElements, string>;

export type IgnoreMetadataProperties = Array<keyof typeof MetadataElements>;

type FetchMetadataOptions = Required<Pick<RequestOptions, 'headers' | 'timeout'>>;

export type FetchedMetadata = Partial<Metadata>;

type ResponseResults = Array<{url: URL; data: string}>;

export const fetchUrlMetadata = (sourceUrl: string): Promise<FetchedMetadata> => {
  // possible return values: {} | {hostname} | Metadata; can contain broken image links as well (validated on the client)
  let redirectCounter = 0;
  // const metadata: FetchedMetadata = {};
  const rawMetadata: Array<FetchedMetadata> = [];
  const responseResults: ResponseResults = [];
  const requestTimeout = 1500; // Milliseconds
  const responseTimeout = 1500; // Milliseconds
  const userAgents = [
    // 'Twitterbot/1.0', // https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/getting-started
    // 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', // https://developers.facebook.com/docs/sharing/webmasters/crawler/
    'PostmanRuntime/7.26.8', // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent#library_and_net_tool_ua_strings
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)', // https://developers.google.com/search/docs/advanced/crawling/overview-google-crawlers
  ];
  const maxRedirectCountPerUserAgent = 20; // 20 redirects per UA https://stackoverflow.com/questions/9384474/in-chrome-how-many-redirects-are-too-many

  const resolveAmbiguousHref = (url: string, origin: string | undefined): URL['href'] => {
    return new URL(url, origin).href;
  };

  const fulfillMetadata = (results: ResponseResults): FetchedMetadata => {
    // check whether tag content is not clipped
    const isCompleteContent = (sliceEndIndex: number): boolean => {
      return sliceEndIndex > -1;
    };

    const getAttributeContent = (attribute: string, match: string): string => {
      const attributeFragment = attribute + '=';
      //const attributeRegExp = RegExp(`${attributeFragment}["']`); // both ' and " is valid
      const attributeStartIndex = match.indexOf(attributeFragment);
      const quoteIndex = attributeStartIndex + attributeFragment.length;
      const quote = match[quoteIndex];

      const sliceStartIndex = quoteIndex + 1;
      const sliceEndIndex = match.indexOf(quote, sliceStartIndex);

      if (isCompleteContent(sliceEndIndex)) {
        return match.slice(sliceStartIndex, sliceEndIndex).trim();
      }

      return '';
    };

    const fetchTitle = (match: string): string => {
      let title: string;

      const isTitleTag = match.indexOf('<title') === 0;

      if (isTitleTag) {
        const sliceStartIndex = match.indexOf('>') + 1;
        const sliceEndIndex = match.indexOf('</title>');

        if (isCompleteContent(sliceEndIndex)) {
          title = match.slice(sliceStartIndex, sliceEndIndex).trim();
        } else {
          title = '';
        }
      } else {
        // <meta> tag otherwise
        title = getAttributeContent('content', match);
      }

      return title;
    };

    const fetchBaseUrl = (match: string): string | null => {
      const baseMatch = BASE_TAG_REGEXP.exec(match);
      return baseMatch ? getAttributeContent('href', baseMatch[0]) : null;
    };

    const pickMostCompleteMetadata = (rawMetadata: Array<FetchedMetadata>): FetchedMetadata => {
      let maxPropertyCount = 0;
      let metadata: FetchedMetadata = {};

      for (let i = rawMetadata.length - 1; i > -1; i--) {
        const rawMetadataItem = rawMetadata[i];
        const propertyCount = Object.keys(rawMetadata).length;
        // console.log('rawMetadataItem ', rawMetadataItem);

        if (propertyCount > maxPropertyCount) {
          maxPropertyCount = propertyCount;
          metadata = rawMetadataItem;
        }
      }

      return metadata;
    };

    const replaceExcessiveIndents = (input: string): string => {
      return input.replace(/[\r\n\t]|(\s\s+)/g, ' ');
    };

    for (let i = results.length - 1; i > -1; i--) {
      const rawMetadataItem: FetchedMetadata = {};
      const result = results[i];
      const {url} = result;
      const data = replaceExcessiveIndents(result.data);
      let baseUrl = fetchBaseUrl(data);

      // if (!ignoreMetadataProperties?.includes('hostname')) {
      rawMetadataItem.hostname = url.hostname;
      // }

      if (baseUrl) {
        baseUrl = resolveAmbiguousHref(baseUrl, url.href);
      }
      // fetch titles
      // if (!metadata.title) {
      // if (!ignoreMetadataProperties?.includes('title')) {
      forEachMatch(data, META_TITLE_REGEXP, (match) => {
        if (rawMetadataItem.title) {
          return false;
        } else {
          const title = fetchTitle(match);

          if (title) {
            rawMetadataItem.title = title;
            return false; // break loop
          }
        }
      });
      // }

      // }

      // parse site_name
      // if (!metadata.sitename) {
      // if (!ignoreMetadataProperties?.includes('sitename')) {
      forEachMatch(data, META_SITE_NAME_REGEXP, (match) => {
        if (rawMetadataItem.sitename) {
          return false;
        } else {
          const sitename = getAttributeContent('content', match);

          if (sitename) {
            rawMetadataItem.sitename = sitename;
            return false; // break loop
          }
        }
      });
      // }
      // }

      // fetch descriptions
      // if (!metadata.description) {
      // if (!ignoreMetadataProperties?.includes('description')) {
      forEachMatch(data, META_DESCRIPTION_REGEXP, (match) => {
        if (rawMetadataItem.description) {
          return false;
        } else {
          const description = getAttributeContent('content', match);

          if (description) {
            rawMetadataItem.description = description;
            return false; // break loop
          }
        }
      });
      // }
      // }

      // fetch images
      // if (!metadata.image) {
      // if (!ignoreMetadataProperties?.includes('image')) {
      forEachMatch(data, META_IMAGE_REGEXP, (match) => {
        if (rawMetadataItem.image) {
          return false;
        } else {
          let imageUrl: string | null = getAttributeContent('content', match);
          imageUrl = resolveAmbiguousHref(imageUrl, baseUrl || url.href);

          if (imageUrl) {
            rawMetadataItem.image = imageUrl; // !!! can be broken link; let client to handle it in order to save resources
            return false;
          }
        }
      });
      // }
      // }

      // fetch icons
      // if (!metadata.icon) {
      // if (!ignoreMetadataProperties?.includes('icon')) {
      forEachMatch(data, META_ICON_REGEXP, (match) => {
        if (rawMetadataItem.icon) {
          return false;
        } else {
          let iconUrl: string | null = getAttributeContent('href', match);
          iconUrl = resolveAmbiguousHref(iconUrl, baseUrl || url.href);

          if (iconUrl) {
            rawMetadataItem.icon = iconUrl; // !!! can be broken link;
            return false;
          }
        }
      });
      // }

      if (Object.keys(rawMetadataItem).length) {
        rawMetadata.push(rawMetadataItem);
      }
      // }
    }

    return pickMostCompleteMetadata(rawMetadata);
  };

  // const isSupportedProtocol = (protocol: string): boolean => {
  //   return protocol === 'http:' || protocol === 'https:';
  // };

  const isValidRequest = (url: URL): boolean => {
    // return url && isSupportedProtocol(url.protocol);
    return Boolean(url) && (url.protocol === 'http:' || url.protocol === 'https:');
  };

  // const isRelativeUrl = (url: string): boolean => {
  //   return url.search(/https?:\/\//) !== 0;
  // };

  // const removeW3 = (hostname: string): string => {
  //   const w3Notation = 'www.';
  //   if (hostname.indexOf(w3Notation) === 0) {
  //     return hostname.replace(w3Notation, '');
  //   }
  //   return hostname;
  // };

  const fetchMetadata = (
    url: string,
    options: FetchMetadataOptions,
    resolve: (_: FetchedMetadata) => void,
    recentUserAgent?: string,
  ): void => {
    const Url = parseUrl(url);
    const userAgent = recentUserAgent || userAgents.pop();

    // at this point hostname can be set already, therefore metadata.hostname
    // can contain stale data; omit it with {} return value
    // looks like malicious request and UI validation was ignored
    if (!isValidRequest(Url as URL) || !userAgent) {
      return resolve(fulfillMetadata(responseResults));
    }

    // if (Url?.hostname) metadata.hostname = Url.hostname; // Prettify

    //if (!userAgent) return resolve(fulfillMetadata(responseData)); // Out of user-profile agents

    options.headers['Host'] = Url?.host;
    options.headers['User-Agent'] = userAgent;

    const get = Url?.protocol === 'http:' ? httpGet : httpsGet;

    let responseData = '';

    const request = get(url, options, (response: IncomingMessage): void => {
      response.on('error', () => {}); // delegate further instructions to request 'close' event

      let redirectLocation = response.headers.location; // can contain relative or absolute url

      if (redirectLocation) {
        redirectCounter += 1;

        request.removeAllListeners(); // dont want request 'close' event emission at this point;
        response.destroy();

        if (redirectCounter > maxRedirectCountPerUserAgent) {
          return fetchMetadata(sourceUrl, options, resolve); // try to fetch with another user-profile agent
        }

        // redirectLocation = isRelativeUrl(redirectLocation) ? resolveAmbiguousHref(redirectLocation, Url?.origin) : redirectLocation;
        redirectLocation = resolveAmbiguousHref(redirectLocation, Url?.origin); // the second argument is ignored if redirectLocation is an absolute url

        return fetchMetadata(redirectLocation, options, resolve, userAgent); // no need to switch user-profile agent on redirect
      }
      // reset counter
      redirectCounter = 0;

      response.socket.setTimeout(responseTimeout); // response timeout
      response.socket.on('timeout', () => response.destroy());

      response.setEncoding('utf-8');

      response.on('data', (chunk: string) => {
        responseData += chunk;

        if (chunk.indexOf('</head>') > -1) {
          return response.destroy(); // force close once <head> is fetched
        }
      });
    });

    request
      .on('error', () => {}) // delegate further instructions to 'close' event
      .on('timeout', () => request.destroy())
      .on('close', () => {
        if (responseData) {
          responseResults.push({url: Url as URL, data: responseData});
        }

        fetchMetadata(url, options, resolve); // at this point url - valid redirectLocation or sourceUrl
      }); // try to fetch recursively; close event can be emitted before connection established or request was fulfilled
  };

  return new Promise<FetchedMetadata>((resolve) => {
    return fetchMetadata(
      sourceUrl,
      {
        headers: {Accept: 'text/html, text/plain'},
        timeout: requestTimeout, // connection timeout
      },
      resolve,
    );
  });
};
// TODO
// decode html chars, e.g. take a look at response https://stackoverflow.com/questions/11592033/regex-match-text-between-tags
// x make collections instead of the flat array, finally resolve the most complete one
// !x provide simple html decoding technique for self-descriptive html entities and most common ones / try to replace unknown with emoji
// x improve <base tag url resolution strategy for relative urls resolveUrl()
// x improve regexes to check content integrity as well
// !x push images and icons into array -> leave the first one that responds 200 OK
// !x cut off everything after the </head> tag
// x check with encoded uris
// fetchUrlMetadata(
//   'http://twitter.com/Twitter?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor',
// )
//   .then((v) => console.log('FS ', v))
//   .catch((e) => console.error('FE ', e));
