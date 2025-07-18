import type {rpcRouter} from "@horionos/api";

import {createIsomorphicFn} from "@tanstack/react-start";
import {getWebRequest} from "@tanstack/react-start/server";

import {createORPCClient} from "@orpc/client";
import {RPCLink} from "@orpc/client/fetch";
import type {RouterClient} from "@orpc/server";
import {createTanstackQueryUtils} from "@orpc/tanstack-query";

const API_URL = import.meta.env.VITE_API_URL;

const getClientLink = createIsomorphicFn()
  .client(
    () =>
      new RPCLink({
        url: `${API_URL}/rpc`,
        fetch(url, options) {
          return fetch(url, {
            ...options,
            credentials: "include",
          });
        },
      }),
  )
  .server(() => {
    return new RPCLink({
      url: `${API_URL}/rpc`,
      fetch(url, options) {
        const request = getWebRequest();
        const cookie = request.headers.get("cookie");

        return fetch(url, {
          ...options,
          credentials: "include",
          headers: {
            cookie: cookie || "",
          },
        });
      },
    });
  });

export const client: RouterClient<typeof rpcRouter> =
  createORPCClient(getClientLink());

export const orpc = createTanstackQueryUtils(client);
