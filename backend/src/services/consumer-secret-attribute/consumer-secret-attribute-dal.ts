import { TDbClient } from "@app/db";
import { TableName } from "@app/db/schemas";
import { ormify, selectAllTableCols } from "@app/lib/knex";

export type TConsumerSecretAttributeDALFactory = ReturnType<typeof consumerSecretAttributeDALFactory>;

type TFindBySecretAndUserParams = { consumerSecretId: string; userId: string; orgId: string };

export const consumerSecretAttributeDALFactory = (db: TDbClient) => {
  const consumerSecretsAttributeOrm = ormify(db, TableName.ConsumerSecretsAttributes);

  const findBySecretAndUser = async ({ consumerSecretId, userId, orgId }: TFindBySecretAndUserParams) => {
    const attributes = await db
      .replicaNode()(TableName.ConsumerSecretsAttributes)
      .where({ consumerSecretId })
      .join(
        TableName.ConsumerSecrets,
        `${TableName.ConsumerSecrets}.id`,
        `${TableName.ConsumerSecretsAttributes}.consumerSecretId`
      )
      .where({ userId, orgId })
      .select(selectAllTableCols(TableName.ConsumerSecretsAttributes));

    return attributes;
  };

  return {
    ...consumerSecretsAttributeOrm,
    findBySecretAndUser
  };
};
