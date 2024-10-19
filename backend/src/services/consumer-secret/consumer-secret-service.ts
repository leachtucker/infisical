import { TPermissionServiceFactory } from "@app/ee/services/permission/permission-service";
import { UnauthorizedError } from "@app/lib/errors";
import { TConsumerSecretAttributeDALFactory } from "@app/services/consumer-secret-attribute/consumer-secret-attribute-dal";

import { TKmsServiceFactory } from "../kms/kms-service";
import { KmsDataKey } from "../kms/kms-types";
import { TConsumerSecretDALFactory } from "./consumer-secret-dal";
import {
  TCreateConsumerSecretDTO,
  TDeleteConsumerSecretDTO,
  TGetConsumerSecretsDTO,
  TUpdateConsumerSecretDTO
} from "./consumer-secret-types";

type TConsumerSecretServiceFactoryDep = {
  consumerSecretDAL: TConsumerSecretDALFactory;
  consumerSecretAttributeDAL: TConsumerSecretAttributeDALFactory;
  kmsService: TKmsServiceFactory;
  permissionService: Pick<TPermissionServiceFactory, "getUserOrgPermission">;
};

export type TConsumerSecretServiceFactory = ReturnType<typeof consumerSecretServiceFactory>;

// todo: implement permissions
export const consumerSecretServiceFactory = ({
  consumerSecretDAL,
  consumerSecretAttributeDAL,
  kmsService
}: TConsumerSecretServiceFactoryDep) => {
  const createConsumerSecret = async ({
    actorId,
    actorOrgId,
    actorAuthMethod,
    attributes,
    ...input
  }: TCreateConsumerSecretDTO) => {
    if (!actorOrgId) throw new UnauthorizedError({ message: "No organization ID provided in request" });

    const consumerSecret = await consumerSecretDAL.transaction(async (tx) => {
      const newSecret = await consumerSecretDAL.create(
        {
          name: input.name,
          type: input.type,
          userId: actorId,
          orgId: actorOrgId
        },
        tx
      );

      if (attributes && attributes.length > 0) {
        const { encryptor: secretManagerEncryptor } = await kmsService.createCipherPairWithDataKey(
          {
            type: KmsDataKey.Organization,
            orgId: actorOrgId
          },
          tx
        );

        const enrichedAttrs = attributes.map((attr) => ({
          key: attr.key,
          consumerSecretId: newSecret.id,
          encryptedValue: attr.value
            ? secretManagerEncryptor({ plainText: Buffer.from(attr.value) }).cipherTextBlob
            : undefined
        }));

        await consumerSecretAttributeDAL.batchInsert(enrichedAttrs, tx);
      }

      return newSecret;
    });

    return consumerSecret;
  };

  const updateConsumerSecret = async ({ actorId, actorOrgId, id, name, attributes }: TUpdateConsumerSecretDTO) => {
    if (!actorOrgId) throw new UnauthorizedError({ message: "No organization ID provided in request" });

    const updatedConsumerSecret = await consumerSecretDAL.transaction(async (tx) => {
      if (name) {
        await consumerSecretDAL.update({ id, userId: actorId, orgId: actorOrgId }, { name }, tx);
      }

      if (attributes && attributes.length > 0) {
        const { encryptor: secretManagerEncryptor } = await kmsService.createCipherPairWithDataKey(
          {
            type: KmsDataKey.Organization,
            orgId: actorOrgId
          },
          tx
        );

        const enrichedAttrs = attributes.map((attr) => ({
          id: attr.id,
          key: attr.key,
          consumerSecretId: id,
          encryptedValue: attr.value
            ? secretManagerEncryptor({ plainText: Buffer.from(attr.value) }).cipherTextBlob
            : undefined
        }));

        await consumerSecretAttributeDAL.upsert(enrichedAttrs, "id", tx);
      }

      const updated = await consumerSecretDAL.findById(id, tx);
      return updated;
    });

    return updatedConsumerSecret;
  };

  const deleteConsumerSecret = async ({ actorId, actorOrgId, id }: TDeleteConsumerSecretDTO) => {
    if (!actorOrgId) throw new UnauthorizedError({ message: "No organization ID provided in request" });

    const [deletedConsumerSecret] = await consumerSecretDAL.delete({
      id,
      userId: actorId,
      orgId: actorOrgId
    });

    return deletedConsumerSecret;
  };

  const getConsumerSecrets = async ({ actorId, actorOrgId, searchTerm }: TGetConsumerSecretsDTO) => {
    if (!actorOrgId) throw new UnauthorizedError({ message: "No organization ID provided in request" });
    console.log({ searchTerm });

    const consumerSecrets = await consumerSecretDAL.getConsumerSecretsForUserAndOrg({
      userId: actorId,
      orgId: actorOrgId,
      searchTerm
    });

    return consumerSecrets;
  };

  return {
    createConsumerSecret,
    updateConsumerSecret,
    deleteConsumerSecret,
    getConsumerSecrets
  };
};
