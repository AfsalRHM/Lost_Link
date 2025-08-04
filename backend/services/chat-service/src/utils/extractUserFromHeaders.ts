import { Request } from "express";

const extractUserFromHeaders = (req: Request) => {
  const payload = req.headers["x-user-payload"] as string;
  if (!payload) throw new Error("Missing user payload header");

  let user;
  try {
    user = JSON.parse(payload);
  } catch (err) {
    throw new Error("Invalid user payload format");
  }

  return user;
};

export default extractUserFromHeaders;
