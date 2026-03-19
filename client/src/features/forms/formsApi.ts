import { api } from "../../app/api";
import type { GetFormsQuery } from "../../generated/graphql";
import type {
  GetFormByIdQuery,
  GetFormByIdQueryVariables,
  CreateFormMutation,
  CreateFormMutationVariables,
  SubmitResponseMutation,
  SubmitResponseMutationVariables,
  GetResponsesQuery,
  GetResponsesQueryVariables
} from "../../generated/graphql";

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
      providesTags: ["Forms"],
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
    createForm: builder.mutation<
      CreateFormMutation,
      CreateFormMutationVariables
    >({
      query: (variables) => ({
        document: `
  mutation CreateForm(
    $title: String!
    $description: String
    $questions: [QuestionInput!]
  ) {
    createForm(
      title: $title
      description: $description
      questions: $questions
    ) {
      id
      title
      description
    }
  }
`,
        variables,
      }),
      invalidatesTags: ["Forms"],
    }),
    submitResponse: builder.mutation<
      SubmitResponseMutation,
      SubmitResponseMutationVariables
    >({
      query: (variables) => ({
        document: `
      mutation SubmitResponse(
        $formId: ID!
        $answers: [AnswerInput!]
      ) {
        submitResponse(
          formId: $formId
          answers: $answers
        ) {
          formId
        }
      }
    `,
        variables,
      }),
    }),
    getResponses: builder.query<GetResponsesQuery, GetResponsesQueryVariables>({
      query: (variables) => ({
        document: `
      query GetResponses($formId: ID!) {
        responses(formId: $formId) {
          formId
          answers {
            questionId
            value
          }
        }
      }
    `,
        variables,
      }),
    }),
  }),
});

export const {
  useGetFormsQuery,
  useGetFormByIdQuery,
  useCreateFormMutation,
  useSubmitResponseMutation,
  useGetResponsesQuery,
} = formsApi;
