import { Knex } from "knex";

import { TDbClient } from "@app/db";
import { TableName } from "@app/db/schemas";
import { ormify, selectAllTableCols } from "@app/lib/knex";

export type TConsumerSecretDALFactory = ReturnType<typeof consumerSecretDALFactory>;

type TGetConsumerSecretsForUserAndOrgParams = {
  userId: string;
  orgId: string;
  searchTerm?: string;
  secretType?: string;
};

export const consumerSecretDALFactory = (db: TDbClient) => {
  const conumserSecretOrm = ormify(db, TableName.ConsumerSecrets);

  const getConsumerSecretsForUserAndOrg = async (
    { userId, orgId, searchTerm, secretType }: TGetConsumerSecretsForUserAndOrgParams,
    tx?: Knex
  ) => {
    let query = (tx || db.replicaNode())(TableName.ConsumerSecrets)
      .select(selectAllTableCols(TableName.ConsumerSecrets))
      .where({ userId, orgId });

    if (searchTerm) {
      query = query.where((qb) => {
        void qb.whereILike("name", `%${searchTerm}%`);
      });
    }

    if (secretType) {
      query = query.where((qb) => {
        void qb.where("type", secretType);
      });
    }

    const secrets = await query.orderBy("createdAt", "desc");
    return secrets;
  };

  return {
    ...conumserSecretOrm,
    getConsumerSecretsForUserAndOrg
  };
};
