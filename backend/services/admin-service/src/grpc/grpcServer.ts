import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import AdminRepository from "../repositories/adminRepository";

const adminRepository = new AdminRepository();

const protoPath = path.join(__dirname, "./proto/admin.proto");
const packageDef = protoLoader.loadSync(protoPath, {
  keepCase: true,
});
const grpcObject = grpc.loadPackageDefinition(packageDef) as any;

async function getAdminById(call: any, callback: any) {
  try {
    const admin = await adminRepository.findOne({ _id: call.request.adminId });

    if (!admin) {
      return callback(new Error("Admin not found"), null);
    }

    const adminData = {
      adminId: admin._id.toString(),
      name: admin.name,
      email: admin.email,
      role: admin.role,
      status: admin.status,
    };

    console.log(adminData, "This is the admin data")

    callback(null, adminData);
  } catch (err) {
    callback(err, null);
  }
}

export function startGrpcServer() {
  const server = new grpc.Server();
  server.addService(grpcObject.admin.AdminService.service, {
    GetAdminById: getAdminById,
  });

  server.bindAsync(
    "0.0.0.0:50052",
    grpc.ServerCredentials.createInsecure(),
    () => {
      console.log("Admin gRPC server running on port 50052");
    }
  );
}
