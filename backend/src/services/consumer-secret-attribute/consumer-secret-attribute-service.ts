import { TPermissionServiceFactory } from "@app/ee/services/permission/permission-service";
import { UnauthorizedError } from "@app/lib/errors";
import { TGenericPermission } from "@app/lib/types";

import { TKmsServiceFactory } from "../kms/kms-service";
import { KmsDataKey } from "../kms/kms-types";
import { TConsumerSecretAttributeDALFactory } from "./consumer-secret-attribute-dal";
import {
  CreateConsumerSecretAttributeDTO,
  DeleteConsumerSecretAttributeDTO,
  UpdateConsumerSecretAttributeDTO
} from "./consumer-secret-attribute-types";

type TConsumerSecretAttributeServiceFactoryDep = {
  consumerSecretAttributeDAL: TConsumerSecretAttributeDALFactory;
  kmsService: TKmsServiceFactory;
  permissionService: Pick<TPermissionServiceFactory, "getUserOrgPermission">;
};

export type TConsumerSecretAttributeServiceFactory = ReturnType<typeof consumerSecretAttributeServiceFactory>;

export const consumerSecretAttributeServiceFactory = ({
  consumerSecretAttributeDAL,
  kmsService
}: TConsumerSecretAttributeServiceFactoryDep) => {
  const createConsumerSecretAttribute = async ({ actorOrgId, ...input }: CreateConsumerSecretAttributeDTO) => {
    if (!actorOrgId) throw new UnauthorizedError({ message: "No organization ID provided in request" });

    const { encryptor: secretManagerEncryptor } = await kmsService.createCipherPairWithDataKey({
      type: KmsDataKey.Organization,
      orgId: actorOrgId
    });

    const encryptedValue = input.value
      ? secretManagerEncryptor({ plainText: Buffer.from(input.value) }).cipherTextBlob
      : undefined;

    const createdAttribute = await consumerSecretAttributeDAL.create({
      consumerSecretId: input.secretId,
      key: input.key,
      encryptedValue
    });

    return createdAttribute;
  };

  const updateConsumerSecretAttribute = async ({
    actorOrgId,
    secretId,
    ...input
  }: UpdateConsumerSecretAttributeDTO) => {
    if (!actorOrgId) throw new UnauthorizedError({ message: "No organization ID provided in request" });

    const updatedAttribute = await consumerSecretAttributeDAL.update(
      {
        consumerSecretId: secretId
      },
      { ...input }
    );

    return updatedAttribute;
  };

  const deleteConsumerSecretAttribute = async ({ actorOrgId, ...input }: DeleteConsumerSecretAttributeDTO) => {
    if (!actorOrgId) throw new UnauthorizedError({ message: "No organization ID provided in request" });

    // todo: check for user ownership to attr or parent secret
    const deletedAttribute = consumerSecretAttributeDAL.delete({
      id: input.attributeId
    });

    return deletedAttribute;
  };

  const getConsumerSecretAttributesForSecret = async ({
    actorOrgId,
    ...input
  }: TGetConsumerSecretAttributesForSecretDTO) => {
    if (!actorOrgId) throw new UnauthorizedError({ message: "No organization ID provided in request" });

    const attributes = await consumerSecretAttributeDAL.find({
      consumerSecretId: input.consumerSecretId
    });

    const { decryptor: secretManagerDecryptor } = await kmsService.createCipherPairWithDataKey({
      type: KmsDataKey.Organization,
      orgId: actorOrgId
    });

    const decryptedAttributes = attributes.map((attr) => ({
      ...attr,
      value: attr.encryptedValue ? secretManagerDecryptor({ cipherTextBlob: attr.encryptedValue }).toString() : ""
    }));

    return decryptedAttributes;
  };

  return {
    createConsumerSecretAttribute,
    updateConsumerSecretAttribute,
    deleteConsumerSecretAttribute,
    getConsumerSecretAttributesForSecret
  };
};

type TGetConsumerSecretAttributesForSecretDTO = {
  consumerSecretId: string;
} & TGenericPermission;
