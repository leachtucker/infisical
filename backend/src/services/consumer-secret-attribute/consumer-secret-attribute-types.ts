import { TGenericPermission } from "@app/lib/types";

export type CreateConsumerSecretAttributeDTO = {
  consumerSecretId: string;
  key: string;
  value: string;
} & TGenericPermission;

export type UpdateConsumerSecretAttributeDTO = {
  consumerSecretId: string;
  key: string;
  value: string;
} & TGenericPermission;

export type DeleteConsumerSecretAttributeDTO = {
  attributeId: string;
} & TGenericPermission;
