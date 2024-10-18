import { TGenericPermission } from "@app/lib/types";

import { CreateConsumerSecretAttributeDTO } from "../consumer-secret-attribute/consumer-secret-attribute-types";

export type TCreateConsumerSecretDTO = {
  name: string;
  type: string;
  attributes?: Omit<CreateConsumerSecretAttributeDTO, "consumerSecretId" | keyof TGenericPermission>[];
} & TGenericPermission;

export type TUpdateConsumerSecretDTO = {
  id: string;
  name: string;
  type: string;
} & TGenericPermission;

export type TDeleteConsumerSecretDTO = {
  id: string;
} & TGenericPermission;

export type TGetConsumerSecretsDTO = TGenericPermission;
