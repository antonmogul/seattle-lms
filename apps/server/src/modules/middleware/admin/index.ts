import { MiddlewareFn } from "type-graphql";
import { ContextType } from "../../../types/ContextType";
import prisma from "orm";
import { verifyToken } from "../../services/JWT";

export const AdminAuth: MiddlewareFn<ContextType> = async (
  action,
  next
) => {
  const { context } = action;
  if (!context.req.headers.authorization) {
    throw new Error("Authentication failed");
  }
  try {
    let token =
      context.req.headers.authorization.split(" ")[1];
    let identity = verifyToken<{
      id: string;
      version: number;
      refreshToken: boolean;
      type: string;
    }>(token);

    if (
      identity.type !== "admin" ||
      identity.refreshToken
    ) {
      throw new Error("Authentication failed");
    }

    let admin = await prisma.admin.findUnique({
      where: {
        id: identity.id,
      },
    });

    if (admin) {
      let isRevoked =
        admin.tokenVersion !== identity.version;

      if (isRevoked)
        throw new Error("Authentication failed");

      context.user = identity.id;
      context.userEmail = admin.email;
      return next();
    } else {
      throw new Error("Authentication failed");
    }
  } catch (e) {
    console.log(e);
    throw new Error("Authentication failed");
  }
};
