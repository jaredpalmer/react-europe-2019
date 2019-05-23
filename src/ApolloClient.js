import { print } from 'graphql/language/printer';
import ApolloClient from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';

let fakeRequestTime = 1000;
let onProgress = () => true;

export function setFakeRequestTime(val) {
  fakeRequestTime = val;
}

export function setProgressHandler(handler) {
  onProgress = handler;
}

export function setPauseNewRequests(value) {
  shouldPauseNewRequests = value;
}

let shouldPauseNewRequests = false;
let notifiers = {};
let isPausedUrl = {};

export function setPaused(url, isPaused) {
  const wasPaused = isPausedUrl[url];
  isPausedUrl[url] = isPaused;
  if (isPaused !== wasPaused) {
    notifiers[url]();
  }
}

export class MyApolloClient extends ApolloClient {
  async query(opts) {
    const data = await super.query(opts);
    const prettyQuery = print(opts.query);
    return makeFakeAPICall(
      prettyQuery.slice(0, prettyQuery.indexOf('(')) +
        ' ' +
        JSON.stringify(opts.variables),
      data
    );
  }

  watchQuery(opts) {
    const query = super.initQueryManager().watchQuery(opts);
    const prettyQuery = print(opts.query);
    try {
      super.readQuery(opts);
    } catch (e) {
      makeFakeAPICall(
        prettyQuery.slice(0, prettyQuery.indexOf('(')) +
          ' ' +
          JSON.stringify(opts.variables),
        query.currentResult()
      );
    }

    return query;
  }
}

export const Client = new MyApolloClient({
  uri: 'https://api.github.com/graphql',
  headers: {
    Authorization: `Bearer ${process.env.REACT_APP_GH_TOKEN}`,
  },
  cache: new InMemoryCache(),
});

function makeFakeAPICall(url, result) {
  let i = 1;
  return new Promise(resolve => {
    isPausedUrl[url] = shouldPauseNewRequests;
    function notify() {
      if (!isPausedUrl[url]) {
        i++;
      }
      onProgress(url, i, isPausedUrl[url]);
      if (isPausedUrl[url]) {
        return;
      }
      if (i === 100) {
        resolve(result);
      } else {
        setTimeout(notify, fakeRequestTime / 100);
      }
    }
    notifiers[url] = notify;
    notify();
  });
}
