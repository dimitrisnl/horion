import type {Context, Next} from "hono";
import {rateLimiter} from "hono-rate-limiter";

// Create different rate limiters for different endpoint types
const authRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5, // 5 requests per 15 minutes for auth endpoints
  standardHeaders: "draft-6",
  keyGenerator: (ctx) => {
    return (
      ctx.req.header("x-forwarded-for") ||
      ctx.req.header("x-real-ip") ||
      "unknown"
    );
  },
});

const generalRateLimiter = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  limit: 100, // 100 requests per minute for general endpoints
  standardHeaders: "draft-6",
  keyGenerator: (ctx) => {
    return (
      ctx.req.header("x-forwarded-for") ||
      ctx.req.header("x-real-ip") ||
      "unknown"
    );
  },
});

export function setupRateLimiting() {
  return async (ctx: Context, next: Next) => {
    const path = ctx.req.path;

    // Choose appropriate rate limiter based on endpoint
    if (path.includes("/auth")) {
      return authRateLimiter(ctx, next);
    } else {
      return generalRateLimiter(ctx, next);
    }
  };
}
