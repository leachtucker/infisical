import { Knex } from "knex";

import { TDbClient } from "@app/db";
import { TableName } from "@app/db/schemas";
import { ormify, selectAllTableCols } from "@app/lib/knex";

export type TConsumerSecretDALFactory = ReturnType<typeof consumerSecretDALFactory>;

type TGetConsumerSecretsForUserAndOrgParams = { userId: string; orgId: string };

export const consumerSecretDALFactory = (db: TDbClient) => {
  const conumserSecretOrm = ormify(db, TableName.ConsumerSecrets);

  const getConsumerSecretsForUserAndOrg = async (
    { userId, orgId }: TGetConsumerSecretsForUserAndOrgParams,
    tx?: Knex
  ) => {
    const consumerSecrets = await (tx || db.replicaNode())(TableName.ConsumerSecrets)
      .select(selectAllTableCols(TableName.ConsumerSecrets))
      .where({ userId, orgId })
      .orderBy("createdAt", "desc")
      .groupBy(`${TableName.ConsumerSecrets}.id`);

    return consumerSecrets;
  };

  return {
    ...conumserSecretOrm,
    getConsumerSecretsForUserAndOrg
  };
};
