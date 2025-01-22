import { Request, Response, NextFunction } from "express";

import jwtFunctions from "../utils/jwt";
import { createCorrelationId } from "../utils/correlationId";
import sendToService from "../rabbitmq/producer";
import eventEmitter from "../utils/eventEmitter";

interface decodedType {
  status: boolean;
  message: string;
  data: any;
}

const verifyAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const CURRENT_QUEUE = process.env.REQUEST_QUEUE;
    const AUTH_QUEUE = process.env.AUTH_QUEUE;

    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ status: false, message: "Access Denied No Token" });
    }

    if (!AUTH_QUEUE || !CURRENT_QUEUE) {
      throw new Error("AUTH QUEUE is not available on the middleware");
    }

    const correlationId = createCorrelationId(token);

    sendToService({
      sendingTo: AUTH_QUEUE,
      correlationId,
      source: "Access Token Validator",
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
    res.status(401).json({ status: false, message: "Invalid Token" });
  }
};

export default verifyAccessToken;

export const verifyAdminAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const CURRENT_QUEUE = process.env.REQUEST_QUEUE;
    const AUTH_QUEUE = process.env.AUTH_QUEUE;

    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ status: false, message: "Access Denied No Token" });
    }

    if (!AUTH_QUEUE || !CURRENT_QUEUE) {
      throw new Error("AUTH QUEUE is not available on the middleware");
    }

    const correlationId = createCorrelationId(token);

    sendToService({
      sendingTo: AUTH_QUEUE,
      correlationId,
      source: "Access Token Validator",
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
    res.status(401).json({ status: false, message: "Invalid Token" });
  }
};
