import {pinoLogger} from "hono-pino";

import {pino} from "pino";

import {envVars} from "~/config/env";

const logger = pino({
  level: envVars.BUN_ENVIRONMENT === "development" ? "debug" : "info",
  base: null, // Remove pid, hostname from logs
  timestamp: pino.stdTimeFunctions.unixTime, // Use unix timestamp
  formatters: {
    level: (label) => {
      return {level: label};
    },
  },
  transport:
    envVars.BUN_ENVIRONMENT === "development"
      ? {
          target: "hono-pino/debug-log",
          options: {
            colorEnabled: true,
            messageKey: "msg",
            requestKey: "req",
            responseKey: "res",
            levelLabelMap: {
              10: "TRACE",
              20: "DEBUG",
              30: "INFO",
              40: "WARN",
              50: "ERROR",
              60: "FATAL",
            },
            normalLogFormat: "[{time}] {levelLabel} - {msg}",
            httpLogFormat:
              "[{time}] {reqId} {req.method} {req.url} {res.status} ({responseTime}ms) - {msg} {bindings}",
          },
        }
      : undefined, // Use default JSON format in production
});

export function setupLogger() {
  return pinoLogger({pino: logger});
}

export {logger};
