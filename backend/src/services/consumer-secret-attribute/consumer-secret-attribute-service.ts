import { TPermissionServiceFactory } from "@app/ee/services/permission/permission-service";
import { UnauthorizedError } from "@app/lib/errors";

import { TKmsServiceFactory } from "../kms/kms-service";
import { KmsDataKey } from "../kms/kms-types";
import { TConsumerSecretAttributeDALFactory } from "./consumer-secret-attribute-dal";
import { TGetConsumerSecretAttributesForSecretDTO } from "./consumer-secret-attribute-types";
import { decryptAttributes } from "./consumer-secret-fns";

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
  const getConsumerSecretAttributesForSecret = async ({
    actorOrgId,
    actorId,
    consumerSecretId
  }: TGetConsumerSecretAttributesForSecretDTO) => {
    if (!actorOrgId) throw new UnauthorizedError({ message: "No organization ID provided in request" });

    const attributes = await consumerSecretAttributeDAL.findBySecretAndUser({
      consumerSecretId,
      orgId: actorOrgId,
      userId: actorId
    });

    const { decryptor: secretManagerDecryptor } = await kmsService.createCipherPairWithDataKey({
      type: KmsDataKey.Organization,
      orgId: actorOrgId
    });

    const decryptor = (encrypted: Buffer) => secretManagerDecryptor({ cipherTextBlob: encrypted });
    const decryptedAttributes = await decryptAttributes({ attributes, decryptor });

    return decryptedAttributes;
  };

  return {
    getConsumerSecretAttributesForSecret
  };
};
