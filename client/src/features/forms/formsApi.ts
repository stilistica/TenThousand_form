import { api } from "../../app/api";
import type { GetFormsQuery } from '../../generated/graphql';
import type { GetFormByIdQuery, GetFormByIdQueryVariables } from '../../generated/graphql';

export const formsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getForms: builder.query<GetFormsQuery, void>({
      query: () => ({
        document: `
          query GetForms {
            forms {
              id
              title
              description
            }
          }
        `,
      }),
    }),
    getFormById: builder.query<GetFormByIdQuery, GetFormByIdQueryVariables>({
      query: (variables) => ({
        document: `
          query GetFormById($id: ID!) {
            form(id: $id) {
              id
              title
              description
              questions {
                id
                title
                type
                options
              }
            }
          }
        `,
        variables,
      }),
    }),
  }),
});

export const { useGetFormsQuery, useGetFormByIdQuery } = formsApi;