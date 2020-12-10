import fetch from 'dva/fetch';

// const host = 'http://192.168.0.105:5000';
// const host = 'http://192.168.2.138:5000';
// const host = 'https://pocketstation.cn:8010';
// const host = 'http://39.104.82.180:8020';

// const host = 'http://47.102.223.5:8080';
const host = 'http://localhost:5000';

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request_new(url, options={'mode': 'no-cors'}) {
  
  const headers = {
    'Accept': 'application/json',
    "Content-Type": "application/json"
  };
  options.headers = Object.assign(options.headers||{}, headers);
  options.json && (options.body = JSON.stringify(options.json));
  console.log("Api-Req: ", options)
  return fetch(host+url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then(data => {
      console.log("Api-Res:kkkk", data);
      return{ data }
    })
    .catch(err => {
      console.warn("Api-Res:", err);
      return { err }
    });
}
