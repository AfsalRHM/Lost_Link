import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

const USER_GRPC_URL =
  process.env.NODE_ENV == "Development"
    ? process.env.USER_GRPC_URL_DEV
    : process.env.USER_GRPC_URL;

const ADMIN_GRPC_URL =
  process.env.NODE_ENV == "Development"
    ? process.env.ADMIN_GRPC_URL_DEV
    : process.env.ADMIN_GRPC_URL;

// User Client
const userProtoPath = path.join(__dirname, "./proto/user.proto");
const userPackageDef = protoLoader.loadSync(userProtoPath);
const userProto = grpc.loadPackageDefinition(userPackageDef) as any;

if (!USER_GRPC_URL) {
  throw new Error(
    "USER_GRPC_URL is not defined. Please set it in your environment variables."
  );
}

const userClient = new userProto.user.UserService(
  USER_GRPC_URL,
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

// Admin Client
const adminProtoPath = path.join(__dirname, "./proto/admin.proto");
const adminPackageDef = protoLoader.loadSync(adminProtoPath);
const adminProto = grpc.loadPackageDefinition(adminPackageDef) as any;

if (!ADMIN_GRPC_URL) {
  throw new Error(
    "ADMIN_GRPC_URL is not defined. Please set it in your environment variables."
  );
}

const adminClient = new adminProto.admin.AdminService(
  ADMIN_GRPC_URL,
  grpc.credentials.createInsecure()
);

export function getAdminById(adminId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    adminClient.GetAdminById({ adminId }, (err: any, response: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
}
