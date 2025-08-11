import IrequestModel from "../interface/IrequestModel";
import { requestEntity } from "../entities/request.entity";

import { GetRequestResponseDto } from "../dtos/request/getRequest.dto";
import { GetRequestDetailsResponseDto } from "../dtos/request/getRequestDetails.dto";
import { AdminGetAllRequestsResponseDto } from "../dtos/request/getAllRequests.dto";

export class RequestMapper {
  static toEntity(doc: IrequestModel): requestEntity {
    return {
      id: doc._id.toString(),
      userId: doc.user_id.toString(),
      productName: doc.product_name,
      productCategory: doc.product_category,
      lastSeen: doc.last_seen,
      expirationValidity: doc.expiration_validity,
      missingWhile: doc.missing_while,
      missingPlace: doc.missing_place,
      travelMode: doc.mode_of_travel,
      missingRoute: doc.missing_route,
      productImages: doc.product_images,
      missingDate: doc.missing_date,
      expirationDate: doc.expiration_date,
      additionalInfo: doc.additional_information,
      rewardAmount: doc.reward_amount,
      status: doc.status,
      likedUsers: doc.users_liked.map((userId) => userId.toString()),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  static toGetRequestSummaryDto(entity: requestEntity): GetRequestResponseDto {
    return {
      id: entity.id,
      productName: entity.productName,
      status: entity.status,
    };
  }

  static toAdminGetAllRequests(
    entity: requestEntity
  ): AdminGetAllRequestsResponseDto {
    return {
      id: entity.id,
      productName: entity.productName,
      productCategory: entity.productCategory,
      status: entity.status,
      rewardAmount: entity.rewardAmount,
      createdAt: entity.createdAt,
    };
  }

  static toGetRequestDetailsDto(
    entity: requestEntity
  ): GetRequestDetailsResponseDto {
    return {
      id: entity.id,
      userId: entity.userId,
      productName: entity.productName,
      rewardAmount: entity.rewardAmount,
      productCategory: entity.productCategory,
      missingWhile: entity.missingWhile,
      missingPlace: entity.missingPlace,
      travelMode: entity.travelMode,
      missingRoute: entity.missingRoute,
      lastSeen: entity.lastSeen,
      missingDate: entity.missingDate,
      expirationDate: entity.expirationDate,
      expirationValidity: entity.expirationValidity,
      additionalInfo: entity.additionalInfo,
      status: entity.status,
      productImages: entity.productImages,
      likedUsers: entity.likedUsers,
      createdAt: entity.createdAt,
    };
  }
}
