import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import UserRepository from "../repositories/userRepository";

const userRepository = new UserRepository();

const protoPath = path.join(__dirname, "./proto/user.proto");
const packageDef = protoLoader.loadSync(protoPath);
const proto = grpc.loadPackageDefinition(packageDef) as any;

async function getUserById(call: any, callback: any) {
  const user = await userRepository.findOne({ _id: call.request.userId });
  if (user) {
    callback(null, user);
  } else {
    callback(new Error("User not found"));
  }
  try {
    const user = await userRepository.findOne({ _id: call.request.userId });

    if (!user) {
      return callback(new Error("User not found"), null);
    }

    callback(null, user);
  } catch (err) {
    callback(err, null);
  }
}

export function startGrpcServer() {
  const server = new grpc.Server();
  server.addService(proto.user.UserService.service, {
    GetUserById: getUserById,
  });

  server.bindAsync(
    "0.0.0.0:50051",
    grpc.ServerCredentials.createInsecure(),
    () => {
      console.log("gRPC server running on port 50051");
    }
  );
}
