import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

const protoPath = path.join(__dirname, "./proto/user.proto");
const packageDef = protoLoader.loadSync(protoPath);
const proto = grpc.loadPackageDefinition(packageDef) as any;

const GRPC_URL =
  process.env.NODE_ENV == "Development"
    ? process.env.GRPC_USER_URL_DEV
    : process.env.GRPC_USER_URL;

if (!GRPC_URL) {
  throw new Error(
    "GRPC_URL is not defined. Please set it in your environment variables."
  );
}

const userClient = new proto.user.UserService(
  GRPC_URL,
  grpc.credentials.createInsecure()
);

export function getUserById(userId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    userClient.GetUserById({ userId }, (err: any, response: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
}
