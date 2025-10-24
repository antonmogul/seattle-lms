import {
  createUploadLink,
  ApolloLink,
  onError,
  ApolloClient,
  from,
  InMemoryCache,
} from "@xatom/apollo-graphql";
import { adminAuth, logoutAdminAuth } from "../auth/admin";
import { publicAuth, logoutPublicAuth } from "../auth/public";
import { GQL_ENDPOINT } from "../config";

const adminHttpLink = createUploadLink({
  credentials: "include",
  uri: GQL_ENDPOINT,
});
const publicHttpLink = createUploadLink({
  credentials: "include",
  uri: GQL_ENDPOINT,
});

const addAdminToken = new ApolloLink(
  (operation, forward) => {
    if (adminAuth.isLoggedIn()) {
      operation.setContext(({ headers = {} }) => ({
        headers: {
          ...headers,
          authorization: `Bearer ${
            adminAuth.getConfig().token
          }`,
        },
      }));
    } else {
      console.log("admin is not logged in", publicAuth);
    }

    return forward(operation);
  }
);

const addPublicToken = new ApolloLink(
  (operation, forward) => {
    if (publicAuth.isLoggedIn()) {
      operation.setContext(({ headers = {} }) => ({
        headers: {
          ...headers,
          authorization: `Bearer ${
            publicAuth.getConfig().token
          }`,
        },
      }));
    } else {
      console.log("user is not logged in", publicAuth);
    }

    return forward(operation);
  }
);

const onAdminError = onError(
  ({ graphQLErrors, forward, operation }) => {
    for (let err of graphQLErrors) {
      console.log(err);
      if (err.message === "Authentication failed") {
        //handle the error
        console.log("handle admin error");
        logoutAdminAuth();
      }
    }
    return forward(operation);
  }
);
const onPublicError = onError(
  ({ graphQLErrors, forward, operation }) => {
    for (let err of graphQLErrors) {
      console.log(err);
      if (err.message === "Authentication failed") {
        //handle the error
        console.log("handle public error");
        logoutPublicAuth();
      }
    }
    return forward(operation);
  }
);

export const adminClient = new ApolloClient({
  link: from([addAdminToken, onAdminError, adminHttpLink]),
  cache: new InMemoryCache(),
});

export const publicClient = new ApolloClient({
  link: from([
    addPublicToken,
    onPublicError,
    publicHttpLink,
  ]),
  cache: new InMemoryCache(),
});
