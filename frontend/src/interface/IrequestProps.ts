import { ValidationErrorData } from "../validations/loginDetails";

export interface InputElementProps {
  item: string;
  placeHolder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorData: { content: string; display: boolean };
}

export interface DropdownElementProps {
  item: string;
  placeHolder: string;
  options: string[];
  onChange: (value: string) => void;
  errorData: { content: string; display: boolean };
}

export interface ImagesElementProps {
  onChange: (uploadedImages: File[]) => void;
  errorData: { content: string; display: boolean };
}

export interface DescriptionElementProps {
  onChange: (value: string) => void;
}

export interface LocationElementProps {
  setData: React.Dispatch<React.SetStateAction<RequestProps>>;
  missingPlaceErrorData: { content: string; display: boolean };
  modeOfTravelErrorData: { content: string; display: boolean };
  missingRouteErrorData: { content: string; display: boolean };
}

export interface RequestProps {
  productName: string;
  requestReward: number;
  productCategory: string;
  travelMode: string;
  travelRoutes: string[];
  missingPlace: string;
  missingDate: string;
  expirationLimit: string;
  images: File[];
  additionalInfo: string;
}

export interface Errors {
  productName?: ValidationErrorData;
  requestReward?: ValidationErrorData;
  productCategory?: ValidationErrorData;
  travelMode?: ValidationErrorData;
  travelRoutes?: ValidationErrorData;
  missingPlace?: ValidationErrorData;
  missingDate?: ValidationErrorData;
  expirationLimit?: ValidationErrorData;
  images?: ValidationErrorData;
  additionalInfo?: ValidationErrorData;
}
