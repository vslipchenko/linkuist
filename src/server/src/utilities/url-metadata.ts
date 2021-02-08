import {get as httpsGet, RequestOptions} from 'https';
import {get as httpGet, IncomingMessage} from 'http';
import {parseUrl} from './validators';

enum MetadataElements {
  'hostname',
  'icon',
  'title',
  'description',
  'image'
}

type Metadata = Record<keyof typeof MetadataElements, string>;

type FetchMetadataOptions = Required<Pick<RequestOptions, 'headers' | 'timeout'>>;

type FetchedMetadata = Metadata | Partial<Metadata>;

type ResponseResults = Array<{url: URL, data: string}>;

export const fetchUrlMetadata = (sourceUrl: string): Promise<FetchedMetadata> => { // possible return values: {} | {hostname} | Metadata
  let redirectCounter = 0;
  // const metadata: FetchedMetadata = {};
  const rawMetadata: FetchedMetadata[] = [];
  const responseResults: ResponseResults = [];
  const requestTimeout = 1000; // Milliseconds
  const responseTimeout = 1000; // Milliseconds
  const userAgents = [
    'Twitterbot/1.0', // https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/getting-started
    'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', // https://developers.facebook.com/docs/sharing/webmasters/crawler/
    'PostmanRuntime/7.26.8', // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent#library_and_net_tool_ua_strings
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)', // https://developers.google.com/search/docs/advanced/crawling/overview-google-crawlers
  ];
  const maxRedirectCount = userAgents.length * 20; // 20 redirects per UA https://stackoverflow.com/questions/9384474/in-chrome-how-many-redirects-are-too-many

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
        const sliceEndIndex = match.lastIndexOf('<');

        if (isCompleteContent(sliceEndIndex)) {
          title = match.slice(sliceStartIndex, sliceEndIndex).trim();
        } else {
          title = '';
        }
      } else { // <meta> tag otherwise
        title = getAttributeContent('content', match);
      }

      return title;
    };

    const fetchBaseUrl = (match: string): string | null => {
      const baseMatch = match.match(BASE_TAG_REGEXP);
      return baseMatch ? getAttributeContent('href', baseMatch[0]) : null;
    };

    const pickMostCompleteMetadata = (rawMetadata: FetchedMetadata[]): FetchedMetadata => {
      let maxPropertyCount = 0;
      let metadata: FetchedMetadata = {};

      for (let i = rawMetadata.length - 1; (i > - 1); i--) {
        const rawMetadataItem = rawMetadata[i];
        const propertyCount = Object.keys(rawMetadata).length;

        if (propertyCount > maxPropertyCount) {
          maxPropertyCount = propertyCount;
          metadata = rawMetadataItem;
        }
      }

      return metadata;
    };

    for (let i = results.length - 1; (i > - 1); i--) {
      const rawMetadataItem: FetchedMetadata = {};
      const result = results[i];
      const {url} = result;
      const data = replaceExcessiveIndents(result.data, ' ');
      let baseUrl = fetchBaseUrl(data);

      rawMetadataItem.hostname = url.hostname;

      if (baseUrl) {
        baseUrl = resolveAmbiguousHref(baseUrl, url.href);
      }
      // fetch titles
      // if (!metadata.title) {
        forEachMatch(data, META_TITLE_REGEXP, (match) => {
          const title = fetchTitle(match);

          if (title) {
            rawMetadataItem.title = title;
            return false; // break loop
          }
        });
      // }

      // parse site_name
      // if (!metadata.siteName) {
        forEachMatch(data, META_SITE_NAME_REGEXP, (match) => {
            const siteName = getAttributeContent('content', match);

            if (siteName) {
              rawMetadataItem.siteName = siteName;
              return false; // break loop
            }
        });
      // }

      // fetch descriptions
      // if (!metadata.description) {
        forEachMatch(data, META_DESCRIPTION_REGEXP, (match) => {

          const description = getAttributeContent('content', match);

          if (description) {
            rawMetadataItem.description = description;
            return false; // break loop
          }
        });
      // }

      // fetch images
      // if (!metadata.image) {
        forEachMatch(data, META_IMAGE_REGEXP, (match) => {
          let imageUrl: string | null = getAttributeContent('content', match);
          imageUrl = resolveAmbiguousHref(imageUrl, baseUrl || url.href);

          if (imageUrl) {
            rawMetadataItem.image = imageUrl; // !!! can be broken link; let client to handle it in order to save resources
            return false;
          }
        });
      // }

      // fetch icons
      // if (!metadata.icon) {
        forEachMatch(data, META_ICON_REGEXP, (match) => {
          let iconUrl: string | null = getAttributeContent('href', match);
          iconUrl = resolveAmbiguousHref(iconUrl, baseUrl || url.href);

          if (iconUrl) {
            rawMetadataItem.icon = iconUrl; // !!! can be broken link;
            return false;
          }
        });

        rawMetadata.push(rawMetadataItem);
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

  const fetchMetadata = (url: string, options: FetchMetadataOptions, resolve: (_: FetchedMetadata) => void, recentUserAgent?: string): void => {
    const Url = parseUrl(url);
    const userAgent = recentUserAgent || userAgents.pop();

    // at this point hostname can be set already, therefore metadata.hostname
    // can contain stale data; omit it with {} return value
    // looks like malicious request and UI validation was ignored
    if (!isValidRequest(Url as URL) || !userAgent)  return resolve(fulfillMetadata(responseResults));

    // if (Url?.hostname) metadata.hostname = Url.hostname; // Prettify

    //if (!userAgent) return resolve(fulfillMetadata(responseData)); // Out of user agents

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
        // TODO implement personal redirect counter per each UA (up to 20)
        if (redirectCounter > maxRedirectCount) {
          return fetchMetadata(sourceUrl, options, resolve); // try to fetch with another user agent
        }

        // redirectLocation = isRelativeUrl(redirectLocation) ? resolveAmbiguousHref(redirectLocation, Url?.origin) : redirectLocation;
        redirectLocation = resolveAmbiguousHref(redirectLocation, Url?.origin); // the second argument is ignored if redirectLocation is an absolute url

        return fetchMetadata(redirectLocation, options, resolve, userAgent); // no need to switch user agent on redirect
      }

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
    return fetchMetadata(sourceUrl,
      {
        headers: {'Accept': 'text/html, text/plain'},
        timeout: requestTimeout // connection timeout
      },
      resolve
    );
  });
};

// fetchUrlMetadata('https://www.amazon.com')
//   .then(v => console.log('FS ', v))
//   .catch(e => console.error('FE ', e));
