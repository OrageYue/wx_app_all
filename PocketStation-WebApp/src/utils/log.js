export function log(...msg) {
  console.log(...msg);
}

export function warn(...msg) {
  console.warn(...msg);
}

export function error(...msg) {
  console.error(...msg);
}

log("!!Change Log to log4js!! -- Carl Zhang");

export default {
  log, warn, error
}