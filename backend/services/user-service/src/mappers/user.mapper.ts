import IuserModel from "../interface/IuserModel";
import { userEntity } from "../entities/user.entity";

import { CreateUserResponseDto } from "../dtos/user/createUser.dto";
import { GetProfileResponseDto } from "../dtos/user/getProfile.dto";
import { LoginUserResponseDto } from "../dtos/auth/loginUser.dto";
import { UpdatePasswordResponseDto } from "../dtos/user/updatePassword.dto";
import { UpdateUserResponseDto } from "../dtos/user/updateUser.dto";
import { GetUserResponseDTO } from "../dtos/user/getUser.dto";
import { GetAllUsersResponseDto } from "../dtos/admin/getAllUsers.dto";
import { AdminGetUserResponseDto } from "../dtos/admin/getUser.dto";

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
      paymentHistory: doc.payment_history.map((p) => ({
        id: p._id,
        type: p.type,
        date: p.date,
        amount: p.amount,
      })),
      tier: doc.current_tier,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  static toCreateUserDTO(entity: userEntity): CreateUserResponseDto {
    return {
      id: entity.id,
      fullName: entity.fullName,
      email: entity.email,
      userName: entity.userName,
      location: entity.location,
    };
  }

  static toLoginUserDTO(entity: userEntity): LoginUserResponseDto {
    return {
      id: entity.id,
      email: entity.email,
      userName: entity.userName,
      fullName: entity.fullName,
      password: entity.password,
      profilePic: entity.profilePic,
      status: entity.status,
    };
  }

  static toUpdatePasswordDTO(entity: userEntity): UpdatePasswordResponseDto {
    return {
      id: entity.id,
      email: entity.email,
      userName: entity.userName,
      fullName: entity.fullName,
      status: entity.status,
    };
  }

  static toGetProfileDto(entity: userEntity): GetProfileResponseDto {
    return {
      id: entity.id,
      email: entity.email,
      userName: entity.userName,
      fullName: entity.fullName,
      profilePic: entity.profilePic,
      phoneNumber: entity.phone ? entity.phone : null,
      points: entity.points,
      requests: entity.requests,
      walletBalance: entity.wallet,
      currentTier: entity.tier,
      completedRequests: entity.completedRequests,
      paymentHistory: entity.paymentHistory,
    };
  }

  static toUpdateUserDto(entity: userEntity): UpdateUserResponseDto {
    return {
      id: entity.id,
      fullName: entity.fullName,
      userName: entity.userName,
      profilePic: entity.profilePic,
      email: entity.email,
      phoneNumber: entity.phone ? entity.phone : null,
    };
  }

  static toGetUserDto(entity: userEntity): GetUserResponseDTO {
    return {
      id: entity.id,
      email: entity.email,
      userName: entity.userName,
      fullName: entity.fullName,
      profilePic: entity.profilePic,
      phoneNumber: entity.phone ? entity.phone : null,
      points: entity.points,
      requests: entity.requests,
      walletBalance: entity.wallet,
      currentTier: entity.tier,
      completedRequests: entity.completedRequests,
      paymentHistory: entity.paymentHistory,
    };
  }

  static toGetAllUsersDto(entity: userEntity): GetAllUsersResponseDto {
    return {
      id: entity.id,
      email: entity.email,
      userName: entity.userName,
      fullName: entity.fullName,
      status: entity.status,
      createdAt: entity.createdAt,
    };
  }

  static toAdminGetUserDto(entity: userEntity): AdminGetUserResponseDto {
    return {
      id: entity.id,
      email: entity.email,
      userName: entity.userName,
      fullName: entity.fullName,
      profilePic: entity.profilePic,
      phoneNumber: entity.phone ? entity.phone : null,
      status: entity.status,
      location: entity.location,
      points: entity.points,
      requests: entity.requests,
      walletBalance: entity.wallet,
      currentTier: entity.tier,
      completedRequests: entity.completedRequests,
      paymentHistory: entity.paymentHistory,
      updatedAt: entity.updatedAt,
      createdAt: entity.createdAt,
    };
  }
}
