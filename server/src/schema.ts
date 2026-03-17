import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
  GraphQLInputObjectType,
} from "graphql";

import { forms, responses } from "./data.js";

const QuestionType = new GraphQLObjectType({
  name: "Question",
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    type: { type: GraphQLString },
    options: { type: new GraphQLList(GraphQLString) },
  },
});

const FormType = new GraphQLObjectType({
  name: "Form",
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    questions: { type: new GraphQLList(QuestionType) },
  },
});

const AnswerType = new GraphQLObjectType({
  name: "Answer",
  fields: {
    questionId: { type: GraphQLID },
    value: { type: GraphQLString },
  },
});

const ResponseType = new GraphQLObjectType({
  name: "Response",
  fields: {
    id: { type: GraphQLID },
    formId: { type: GraphQLID },
    answers: { type: new GraphQLList(AnswerType) },
  },
});

// ObjectType = для response
// InputType = для mutation

const QuestionInput = new GraphQLInputObjectType({
  name: "QuestionInput",
  fields: {
    title: { type: GraphQLString },
    type: { type: GraphQLString },
    options: { type: new GraphQLList(GraphQLString) },
  },
});

const AnswerInput = new GraphQLInputObjectType({
  name: "AnswerInput",
  fields: {
    questionId: { type: GraphQLID },
    value: { type: GraphQLString },
  },
});

const RootQuery = new GraphQLObjectType({
  name: "Query",
  fields: {
    forms: {
      type: new GraphQLList(FormType),
      resolve() {
        return forms;
      },
    },
    form: {
      type: FormType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(_, args) {
        return forms.find((f) => f.id === args.id);
      },
    },
    responses: {
      type: new GraphQLList(ResponseType),
      args: {
        formId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(_, args) {
        return responses.filter((r) => r.formId === args.formId);
      },
    },
  },
});
// мутація
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createForm: {
      type: FormType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        questions: { type: new GraphQLList(QuestionInput) },
      },
      resolve(_, args) {
        const newForm = {
          id: Date.now().toString(),
          title: args.title,
          description: args.description,
          questions: args.questions || [],
        };

        forms.push(newForm);

        return newForm;
      },
    },
    submitResponse: {
      type: ResponseType,
      args: {
        formId: { type: new GraphQLNonNull(GraphQLID) },
        answers: { type: new GraphQLList(AnswerInput) },
      },
      resolve(_, args) {
        const newResponse = {
          id: Date.now().toString(),
          formId: args.formId,
          answers: args.answers || [],
        };

        const formExists = forms.some((f) => f.id === args.formId);

        if (!formExists) {
          throw new Error("Form not found");
        }
				
        responses.push(newResponse);

        return newResponse;
      },
    },
  },
});

export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
