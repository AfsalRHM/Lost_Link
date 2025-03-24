import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

const protoPath = path.join(__dirname, "./proto/user.proto");
const packageDef = protoLoader.loadSync(protoPath);
const proto = grpc.loadPackageDefinition(packageDef) as any;

const client = new proto.user.UserService(
  "user-service:50051",
  grpc.credentials.createInsecure()
);

export function getUserById(userId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    client.GetUserById({ userId }, (err: any, response: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
}
