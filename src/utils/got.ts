import ky, { KyInstance } from 'ky';
import Bottleneck from 'bottleneck';
import { ValidatedOptions } from '../types';

export const getInstance = (
  apiUrl: string,
  options: ValidatedOptions,
  userAgent: string | undefined,
  rateLimiter: Bottleneck | undefined,
): KyInstance => {
  return ky.extend({
    hooks: {
      beforeRequest: [
        async request => {
          if (rateLimiter) {
            await rateLimiter.schedule(() => Promise.resolve(true));
          }

          if (options.debug) {
            console.log(`${request.method} ${request.url}`);
          }
        },
      ],
      beforeError: [
        error => {
          if (options.debug) {
            console.error(error);
          }
          return error;
        },
      ],
    },
    prefixUrl: apiUrl,
    // responseType: 'json',
    // http2: options.http2,
    headers: {
      project_id: options.projectId,
      'User-Agent': userAgent,
    },
    // retry: options.retrySettings,
    timeout: options.requestTimeout,
    // https://github.com/sindresorhus/got/blob/main/documentation/2-options.md
    // ...options.gotOptions,
  });
};
