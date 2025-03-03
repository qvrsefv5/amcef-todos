import Axios from "axios";
import endpoints from "./endpoints";
import isFunction from "lodash/isFunction";

export interface EndpointsArgs extends RequestArgs {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
}

export interface RequestArgs {
  urlParams?: Record<string, string | number>;
  params?: Record<string, string | number>;
  data?: Record<string, unknown>;
  headers?: Record<string, string>;
}

export interface ResponseArgs {
  status: number;
  data: unknown;
}

const axios = Axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const useApi = () => {
  const getLiveResponse = async (args: Record<string, unknown>) => {
    return await axios({
      ...args,
      url: isFunction(args.url) ? args.url(args.urlParams) : args.url,
    });
  };

  const handleRequest =
    (
      id: keyof typeof endpoints,
      { url, method, ...endpointsArgs }: EndpointsArgs
    ) =>
    async (requestArgs: RequestArgs): Promise<any> => {
      console.debug(`[API] ${id}: ${method} ${url}`, {
        ...endpointsArgs,
        ...requestArgs,
      });

      const args = {
        ...endpointsArgs,
        ...requestArgs,
        id,
        url,
        method,
      };

      return await getLiveResponse(args);
    };

  return Object.fromEntries(
    Object.entries(endpoints).map(([id, args]) => [
      id,
      handleRequest(id as keyof typeof endpoints, args as EndpointsArgs),
    ])
  ) as Record<
    keyof typeof endpoints,
    (requestArgs?: RequestArgs) => Promise<ResponseArgs>
  >;
};
