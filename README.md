# Horion

This is a [Bun](https://bun.sh/) monorepo, using [Turborepo](https://turborepo.com/), with the following two apps:

- **Dashboard**, using [TanStack Start](https://tanstack.com/start/latest)
- **API**, using [Hono](https://hono.dev/)

And a few helper packages:

- **Emails**, a dedicated directory for [react email](https://react.email/) as I don't want the bundled Next.js server anywhere near my apps.
- **UI**, a component library using [RadixUI](https://www.radix-ui.com/primitives) [^2]
- **Icons**, re-exporting some icons from [Lucide Icons](https://lucide.dev/icons/)

## Motivation

I want to try some technologies, form opinions, and maybe blog about them. It's a fun playground.

## Testing

I'm using `bun:test` as test runner, with in-memory `PGlite` from `@electric-sql/pglite`. I've only written tests for the **API** package so far.

## Communication and type-safety

To bridge the gap between them and share types, I'm using [ORPC](https://orpc.unnoq.com/)[^1]. I particularly like its integration with [TanStack Query](https://tanstack.com/query/latest). Here's an example:

I can pass the query I want to use using `queryOptions`, without the need to set up query keys:

```tsx
const {
  data: {memberships},
} = useSuspenseQuery(
  orpc.membership.getAll.queryOptions({
    staleTime: minutes(5),
  }),
);
```

And invalidate it, again without passing query keys:

```tsx
queryClient.invalidateQueries(orpc.membership.getAll.queryOptions());
```

There are many benefits to using any RPC library, and I'm probably under-selling it, but it works well, and I'm happy. Even when I move the TanStack Start, which has its own RPC-like functionality, I'll keep using it.

## Authentication

I'm using a simple magic-link flow. Yes, I hand roll my own authentication.

1. Creating a session
2. Saving the session token in a secure cookie
3. Passing the cookie around

Previously I was using [BetterAuth](https://www.better-auth.com/) but it was too opinionated for my taste.

## Styling

I love [Catalyst UI](https://tailwindcss.com/plus/ui-kit), and I think it's the prettiest and most well-crafted component library.Unfortunately, it has a limited license, and since this is an open-source project that can act as a template, I can't use it here. For this reason, I just picked ShadcnUI, which doesn't excites me.

I will update the styles for a less monochrome look and feel and move on to BaseUI soonish.

## Linting and Formatting

I tried [Biome](https://biomejs.dev/) for its excellent monorepo support, but I found it lacking. I have a very detailed typescript eslint config that I really enjoy, so I removed Biome and used Eslint & Prettier. I'll revisit it in the future.

## Deployment

I'm using Bun. This means that some serverless providers who run their own JavaScript runtimes have failed me spectacularly, and I can't be bothered to debug the issues.
A long-lived server from [Fly.io](https://fly.io/) works wonders for the Hono backend.

The dashboard is now under Netlify, but as I move on to the TanStack Start, I'll move it to Fly.io as well for better performance.

## Next-up

I'm considering the following:

- [TipTap](https://tiptap.dev/)
- [Permix](https://permix.letstri.dev/)
- An [Astro](https://astro.build/) landing page

[^1]: I'm planning to test Hono RPC

[^2]: I'm also planning to migrate this to [BaseUI](https://base-ui.com/)
