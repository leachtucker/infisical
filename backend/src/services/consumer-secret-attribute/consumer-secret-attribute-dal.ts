import { TDbClient } from "@app/db";
import { TableName } from "@app/db/schemas";
import { ormify } from "@app/lib/knex";

export type TConsumerSecretAttributeDALFactory = ReturnType<typeof consumerSecretAttributeDALFactory>;

export const consumerSecretAttributeDALFactory = (db: TDbClient) => {
  const consumerSecretsAttributeOrm = ormify(db, TableName.ConsumerSecretsAttributes);

  return {
    ...consumerSecretsAttributeOrm
  };
};
