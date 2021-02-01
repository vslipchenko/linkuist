import {get as httpsGet, RequestOptions} from 'https';
import {get as httpGet, IncomingMessage} from 'http';
import {parseUrl} from './validators';

enum MetadataElements {
  'hostname',
  'title',
  'description',
  'image'
}

type Metadata = Record<keyof typeof MetadataElements, string>;

type FetchMetadataOptions = Required<Pick<RequestOptions, 'headers' | 'timeout'>>;

type FetchedMetadata = Metadata | Partial<Metadata>;

const fetchUrlMetadata = (url: string): Promise<FetchedMetadata> => {
  let redirectCounter = 0;
  const metadata: FetchedMetadata = {};
  const requestTimeout = 1000; // Milliseconds
  const responseTimeout = 1000; // Milliseconds
  const userAgents = [
    'Twitterbot/1.0', // https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/getting-started
    'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', // https://developers.facebook.com/docs/sharing/webmasters/crawler/
    'PostmanRuntime/7.26.8', // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent#library_and_net_tool_ua_strings
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)', // https://developers.google.com/search/docs/advanced/crawling/overview-google-crawlers
  ];
  const maxRedirectCount = userAgents.length * 20; // 20 redirects per UA https://stackoverflow.com/questions/9384474/in-chrome-how-many-redirects-are-too-many

  const fulfillMetadata = (data: string) => {
    // TODO implement meta parser
    console.log('parse ', data.length);
  };

  const isMetadataFulfilled = (metadata: FetchedMetadata): boolean => {
    return Object.keys(metadata).length === Object.keys(MetadataElements).length;
  };

  const isSupportedProtocol = (protocol: string): boolean => {
    return protocol === 'http:' || protocol === 'https:';
  };

  const isValidRequest = (url: URL): boolean => {
    return url && isSupportedProtocol(url.protocol);
  };

  const isRelativeUrl = (url: string): boolean => {
    return url.indexOf('://') === -1;
  };

  const removeW3 = (hostname: string): string => {
    const w3Notation = 'www.';
    if (hostname.indexOf(w3Notation) === 0) {
      return hostname.replace(w3Notation, '');
    }
    return hostname;
  };

  const fetchMetadata = (url: string, options: FetchMetadataOptions, resolve: (value: FetchedMetadata) => void, recentUserAgent?: string): void => {
    let Url = parseUrl(url);

    if (!isValidRequest(Url as URL)) return resolve(metadata); // Might be validated on the client

    if (Url?.hostname) metadata.hostname = removeW3(Url.hostname); // Prettify

    const userAgent = recentUserAgent || userAgents.pop();

    if (!userAgent) return resolve(metadata); // Out of user agents

    options.headers['Host'] = Url?.host;
    options.headers['User-Agent'] = userAgent;

    let responseData: string;
    const get = Url?.protocol === 'http:' ? httpGet : httpsGet;

    const request = get(url, options, (response: IncomingMessage): void => {
      response.on('error', () => {}); // delegate further instructions to request 'close' event

      let redirectLocation = response.headers.location; // can contain relative or absolute url

      if (redirectLocation) {
        redirectCounter += 1;

        request.removeAllListeners(); // prevent request 'close' event emission
        response.destroy();

        if (redirectCounter > maxRedirectCount) {
          return resolve(metadata);
        }

        redirectLocation = isRelativeUrl(redirectLocation) ? Url?.origin + redirectLocation : redirectLocation;

        return fetchMetadata(redirectLocation, options, resolve, userAgent); // no need to switch user agent on redirect
      }

      response.socket.setTimeout(responseTimeout); // response timeout
      response.socket.on('timeout', () => response.destroy());

      response.setEncoding('utf-8');

      response.on('data', (chunk: string) => {
        responseData += chunk;

        if (responseData.indexOf('</head>') > -1) {
          return response.destroy(); // force close once <head> is fetched
        }
      });
    });

    request
      .on('error', () => {}) // delegate further instructions to 'close' event
      .on('timeout', () => request.destroy())
      .on('close', () => { // closed before connection established or request is fulfilled
        if (responseData) {
          fulfillMetadata(responseData);
        }

        if (!isMetadataFulfilled(metadata)) {
          return fetchMetadata(url, options, resolve);
        }

        return resolve(metadata);
      });
  };

  return new Promise<FetchedMetadata>((resolve) => {
    return fetchMetadata(url,
      {
        headers: {'Accept': 'text/html, text/plain'},
        timeout: requestTimeout // connection timeout
      },
      resolve
    );
  });
};

fetchUrlMetadata('https://www.amazon.com')
  .then(v => console.log('FS ', v))
  .catch(e => console.error('FE ', e));
