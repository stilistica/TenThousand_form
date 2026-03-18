import { createApi } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { request } from "graphql-request";

const graphqlBaseQuery =
  (): BaseQueryFn<
    { document: string; variables?: Record<string, unknown> },
    unknown,
    unknown
  > =>
  async ({ document, variables }) => {
    try {
      const result = await request(
        "http://localhost:4000/graphql",
        document,
        variables,
      );
      return { data: result };
    } catch (error) {
      return { error };
    }
  };

export const api = createApi({
  reducerPath: "api",
  baseQuery: graphqlBaseQuery(),
  tagTypes: ["Forms"],
  endpoints: () => ({}),
});
