import express from "express";
import {
    CORS_CONFIG,
    GRAPHQL_URL,
} from "../../config/global";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { buildSchema } from "orm";
import AdminAuthResolver from "../../modules/graphql/admin/auth";
import PublicAuthResolver from "../../modules/graphql/public/auth";
import PublicSettingsResolver from "../graphql/public/settings";
import PublicCourseResolver from "../graphql/public/course";
import { GraphQLUpload, graphqlUploadExpress } from "graphql-upload";
import AdminUserResolver from "../graphql/admin/users";
import AdminCourseResolver from "../graphql/admin/courses";
import ReportsResolver from "../graphql/admin/reports";
import AdminAnalyticsResolver from "../graphql/admin/analytics";

const apolloServer = (app: express.Application) => {
    return new Promise((resolve, reject) => {
        buildSchema({
            resolvers: [
                AdminAuthResolver,
                PublicAuthResolver,
                PublicSettingsResolver,
                PublicCourseResolver,
                AdminUserResolver,
                AdminCourseResolver,
                ReportsResolver,
                AdminAnalyticsResolver
            ],
            validate: false
        })
            .then((schema) => {
                const server = new ApolloServer({
                    schema,
                    resolvers: {
                        Upload: GraphQLUpload,
                    },
                    context({ res, req }) {
                        return { res, req };
                    },
                    plugins: [
                        ApolloServerPluginLandingPageGraphQLPlayground,
                    ],
                });

                server
                    .start()
                    .then(() => {
                        app.use(GRAPHQL_URL, graphqlUploadExpress());
                        server.applyMiddleware({
                            app,
                            path: GRAPHQL_URL,
                            cors: CORS_CONFIG,
                        });
                        resolve(true);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export default apolloServer;
