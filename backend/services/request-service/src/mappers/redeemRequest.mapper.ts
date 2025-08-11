import IredeemRequestModel from "../interface/IredeemRequestModel";
import { redeemRequestEntity } from "../entities/redeemRequest.entity";

import {
  AdminGetRedeemRequestResponseDto,
  AdminGetRedeemRequestSummaryResponseDto,
  getRedeemRequestResponseDto,
} from "../dtos/redeemRequest/getRedeemRequestDetails.dto";
import {
  adminGetAllRedeemRequestsResponseDto,
  getAllRedeemRequestResponseDto,
} from "../dtos/redeemRequest/getAllRedeemRequests.dto";

export class RedeemRequestMapper {
  static toEntity(doc: IredeemRequestModel): redeemRequestEntity {
    return {
      id: doc._id.toString(),
      userId: doc.user_id.toString(),
      requestId: doc.request_id.toString(),
      requestName: doc.request_name,
      rewardAmount: doc.reward_amount,
      expirationValidity: doc.request_expiration_validity,
      itemCategory: doc.request_item_category,
      foundLocation: doc.found_location,
      foundDate: doc.found_date,
      damageIssues: doc.damage_issues,
      mobileNumber: doc.mobile_number,
      bankName: doc.bank_name,
      accountNumber: doc.account_number,
      ifscCode: doc.ifsc_code,
      accountHolder: doc.account_holder_name,
      images: doc.images,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  static toGetRedeemRequestSummaryDto(
    entity: redeemRequestEntity
  ): AdminGetRedeemRequestSummaryResponseDto {
    return {
      id: entity.id,
      requestName: entity.requestName,
    };
  }

  static toGetAllRedeemRequestsDto(
    entity: redeemRequestEntity
  ): getAllRedeemRequestResponseDto {
    return {
      id: entity.id,
      requestId: entity.requestId,
      userId: entity.userId,
      requestName: entity.requestName,
      status: entity.status,
      createdAt: entity.createdAt,
    };
  }

  static toGetRedeemRequestDetailsDto(
    entity: redeemRequestEntity
  ): getRedeemRequestResponseDto {
    return {
      id: entity.id,
      requestId: entity.requestId,
      userId: entity.userId,
      requestName: entity.requestName,
      rewardAmount: entity.rewardAmount,
      expirationValidity: entity.expirationValidity,
      itemCategory: entity.itemCategory,
      foundLocation: entity.foundLocation,
      foundDate: entity.foundDate,
      damageIssues: entity.damageIssues,
      mobileNumber: entity.mobileNumber,
      bankName: entity.bankName,
      accountNumber: entity.accountNumber,
      ifscCode: entity.ifscCode,
      accountHolder: entity.accountHolder,
      images: entity.images,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toAdminGetAllRedeemRequestsDto(
    entity: redeemRequestEntity
  ): adminGetAllRedeemRequestsResponseDto {
    return {
      id: entity.id,
      requestName: entity.requestName,
      status: entity.status,
      mobileNumber: entity.mobileNumber,
      createdAt: entity.createdAt,
    };
  }

  static toAdminGetRedeemRequestDetailsDto(
    entity: redeemRequestEntity
  ): AdminGetRedeemRequestResponseDto {
    return {
      id: entity.id,
      requestId: entity.requestId,
      userId: entity.userId,
      requestName: entity.requestName,
      rewardAmount: entity.rewardAmount,
      expirationValidity: entity.expirationValidity,
      itemCategory: entity.itemCategory,
      foundLocation: entity.foundLocation,
      foundDate: entity.foundDate,
      damageIssues: entity.damageIssues,
      mobileNumber: entity.mobileNumber,
      bankName: entity.bankName,
      accountNumber: entity.accountNumber,
      ifscCode: entity.ifscCode,
      accountHolder: entity.accountHolder,
      images: entity.images,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
