import { TGenericPermission } from "@app/lib/types";

export type TCreateConsumerSecretDTO = {
  name: string;
  type: string;
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
