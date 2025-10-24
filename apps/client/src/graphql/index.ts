import { adminClient, publicClient } from "../apollo";
import { GraphQLClient } from "@xatom/apollo-graphql";

export const adminQL = new GraphQLClient(adminClient);
export const publicQL = new GraphQLClient(publicClient);
