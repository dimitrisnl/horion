import type {Context, Next} from "hono";

const clientHints = [
  "Sec-CH-UA",
  "Sec-CH-UA-Mobile",
  "Sec-CH-UA-Platform",
  "Sec-CH-UA-Platform-Version",
  "Sec-CH-UA-Arch",
  "Sec-CH-UA-Model",
  "Sec-CH-UA-Bitness",
];

const criticalHints = ["Sec-CH-UA", "Sec-CH-UA-Mobile", "Sec-CH-UA-Platform"];

export function setupClientHints() {
  return async (ctx: Context, next: Next) => {
    ctx.header("Accept-CH", clientHints.join(", "));
    ctx.header("Critical-CH", criticalHints.join(", "));
    await next();
  };
}
