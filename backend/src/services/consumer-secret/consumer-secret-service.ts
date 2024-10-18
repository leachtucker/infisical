import { TPermissionServiceFactory } from "@app/ee/services/permission/permission-service";
import { UnauthorizedError } from "@app/lib/errors";

import { TConsumerSecretDALFactory } from "./consumer-secret-dal";
import {
  TCreateConsumerSecretDTO,
  TDeleteConsumerSecretDTO,
  TGetConsumerSecretsDTO,
  TUpdateConsumerSecretDTO
} from "./consumer-secret-types";

type TConsumerSecretServiceFactoryDep = {
  consumerSecretDAL: TConsumerSecretDALFactory;
  permissionService: Pick<TPermissionServiceFactory, "getUserOrgPermission">;
};

export type TConsumerSecretServiceFactory = ReturnType<typeof consumerSecretServiceFactory>;

// todo: implement permissions

export const consumerSecretServiceFactory = ({ consumerSecretDAL }: TConsumerSecretServiceFactoryDep) => {
  const createConsumerSecret = async ({ actorId, actorOrgId, actorAuthMethod, ...input }: TCreateConsumerSecretDTO) => {
    if (!actorOrgId) throw new UnauthorizedError({ message: "No organization ID provided in request" });

    const consumerSecret = await consumerSecretDAL.create({
      name: input.name,
      type: input.type,
      userId: actorId,
      orgId: actorOrgId
    });

    return consumerSecret;
  };

  const updateConsumerSecret = async ({
    actorId,
    actorOrgId,
    actorAuthMethod,
    id,
    ...input
  }: TUpdateConsumerSecretDTO) => {
    if (!actorOrgId) throw new UnauthorizedError({ message: "No organization ID provided in request" });

    const updatedConsumerSecret = await consumerSecretDAL.update({ id, userId: actorId, orgId: actorOrgId }, input);

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

  const getConsumerSecrets = async ({ actorId, actorOrgId }: TGetConsumerSecretsDTO) => {
    if (!actorOrgId) throw new UnauthorizedError({ message: "No organization ID provided in request" });

    const consumerSecrets = await consumerSecretDAL.getConsumerSecretsForUserAndOrg({
      userId: actorId,
      orgId: actorOrgId
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
