import { TGenericPermission } from "@app/lib/types";

export type CreateConsumerSecretAttributeDTO = {
  secretId: string;
  key: string;
  value: string;
} & TGenericPermission;

export type UpdateConsumerSecretAttributeDTO = {
  secretId: string;
  key: string;
  value: string;
} & TGenericPermission;

export type DeleteConsumerSecretAttributeDTO = {
  attributeId: string;
} & TGenericPermission;
