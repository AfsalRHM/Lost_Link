import { CreateUserResponseDto } from "../dtos/user/createUser.dto";
import { userEntity } from "../entities/user.entity";
import IuserModel from "../interface/IuserModel";

export class UserMapper {
  static toEntity(doc: IuserModel): userEntity {
    return {
      id: doc._id.toString(),
      profilePic: doc.profile_pic,
      fullName: doc.full_name,
      userName: doc.user_name,
      location: doc.location,
      email: doc.email,
      wallet: doc.wallet,
      phone: doc.phone ?? null,
      status: doc.status,
      password: doc.password,
      requests: doc.requests,
      completedRequests: doc.completed_requests.map((r) => ({
        requestId: r.request_id,
        completedAt: r.completed_at,
        pointsEarned: r.points_earned,
      })),
      points: doc.points,
      paymentHistory: doc.payment_history,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  static toResponseDTO(entity: userEntity): CreateUserResponseDto {
    return {
      id: entity.id,
      fullName: entity.fullName,
      email: entity.email,
      userName: entity.userName,
      location: entity.location,
    };
  }
}
