import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

const protoPath = path.join(__dirname, "./proto/admin.proto");
const packageDef = protoLoader.loadSync(protoPath);
const proto = grpc.loadPackageDefinition(packageDef) as any;

const adminClient = new proto.admin.AdminService(
  "localhost:50052",
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
