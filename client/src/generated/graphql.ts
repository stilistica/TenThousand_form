export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Answer = {
  __typename?: 'Answer';
  questionId?: Maybe<Scalars['ID']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type AnswerInput = {
  questionId?: InputMaybe<Scalars['ID']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type Form = {
  __typename?: 'Form';
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  questions?: Maybe<Array<Maybe<Question>>>;
  title?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createForm?: Maybe<Form>;
  submitResponse?: Maybe<Response>;
};


export type MutationCreateFormArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  questions?: InputMaybe<Array<InputMaybe<QuestionInput>>>;
  title: Scalars['String']['input'];
};


export type MutationSubmitResponseArgs = {
  answers?: InputMaybe<Array<InputMaybe<AnswerInput>>>;
  formId: Scalars['ID']['input'];
};

export type Query = {
  __typename?: 'Query';
  form?: Maybe<Form>;
  forms?: Maybe<Array<Maybe<Form>>>;
  responses?: Maybe<Array<Maybe<Response>>>;
};


export type QueryFormArgs = {
  id: Scalars['ID']['input'];
};


export type QueryResponsesArgs = {
  formId: Scalars['ID']['input'];
};

export type Question = {
  __typename?: 'Question';
  id?: Maybe<Scalars['ID']['output']>;
  options?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type QuestionInput = {
  options?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type Response = {
  __typename?: 'Response';
  answers?: Maybe<Array<Maybe<Answer>>>;
  formId?: Maybe<Scalars['ID']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type CreateFormMutationVariables = Exact<{
  title: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  questions?: InputMaybe<Array<QuestionInput> | QuestionInput>;
}>;


export type CreateFormMutation = { __typename?: 'Mutation', createForm?: { __typename?: 'Form', id?: string | null, title?: string | null, description?: string | null } | null };

export type GetFormByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetFormByIdQuery = { __typename?: 'Query', form?: { __typename?: 'Form', id?: string | null, title?: string | null, description?: string | null, questions?: Array<{ __typename?: 'Question', id?: string | null, title?: string | null, type?: string | null, options?: Array<string | null> | null } | null> | null } | null };

export type GetFormsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFormsQuery = { __typename?: 'Query', forms?: Array<{ __typename?: 'Form', id?: string | null, title?: string | null, description?: string | null } | null> | null };

export type GetResponsesQueryVariables = Exact<{
  formId: Scalars['ID']['input'];
}>;


export type GetResponsesQuery = { __typename?: 'Query', responses?: Array<{ __typename?: 'Response', id?: string | null, formId?: string | null, answers?: Array<{ __typename?: 'Answer', questionId?: string | null, value?: string | null } | null> | null } | null> | null };

export type SubmitResponseMutationVariables = Exact<{
  formId: Scalars['ID']['input'];
  answers?: InputMaybe<Array<AnswerInput> | AnswerInput>;
}>;


export type SubmitResponseMutation = { __typename?: 'Mutation', submitResponse?: { __typename?: 'Response', formId?: string | null } | null };
