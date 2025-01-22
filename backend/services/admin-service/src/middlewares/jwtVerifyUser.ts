import { Request, Response, NextFunction } from "express";

// import jwtFunctions from "../utils/jwt";
import sendToService from "../rabbitmq/producer";
import { createCorrelationId } from "../utils/correlationId";
import eventEmitter from "../utils/eventEmitter";
import { decodedType } from "../interface/IjwtTypes";

const verifyAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  console.log("Here working");
  try {
    const CURRENT_QUEUE = process.env.ADMIN_QUEUE;
    const AUTH_QUEUE = process.env.AUTH_QUEUE;

    if (!AUTH_QUEUE || !CURRENT_QUEUE) {
      throw new Error("AUTH QUEUE is not available on the middleware");
    }

    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ status: false, message: "Access Denied No Token" });
    }

    const correlationId = createCorrelationId(token);

    sendToService({
      sendingTo: AUTH_QUEUE,
      correlationId,
      source: "Admin Access Token Validator",
      props: { token },
    });

    const decoded: decodedType = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Response timeout"));
      }, 10000);

      eventEmitter.once(correlationId, (data) => {
        clearTimeout(timeout);
        resolve(data);
      });
    });

    if (decoded.status) {
      next();
    } else {
      throw new Error("invalid Access Token");
    }
  } catch (error) {
    console.log("Error on the Access Token Middleware", error);
    res.status(401).json({ status: false, message: "Invalid Token" });
  }
};

export default verifyAccessToken;

// to access the Admin Tokens after the tokens created
export function gettingAdminAccessTokenVerifyResult(
  correlationId: string,
  params: any
) {
  eventEmitter.emit(correlationId, params);
}
