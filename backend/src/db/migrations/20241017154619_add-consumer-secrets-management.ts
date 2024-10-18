import { Knex } from "knex";

import { TableName } from "../schemas";

export async function up(knex: Knex): Promise<void> {
  const doesConsumerSecretsTableExist = await knex.schema.hasTable(TableName.ConsumerSecrets);

  if (!doesConsumerSecretsTableExist) {
    await knex.schema.createTable(TableName.ConsumerSecrets, (tb) => {
      tb.uuid("id", { primaryKey: true }).defaultTo(knex.fn.uuid());
      tb.uuid("userId").notNullable();
      tb.foreign("userId").references("id").inTable(TableName.Users).onDelete("CASCADE");
      tb.uuid("orgId").notNullable();
      tb.foreign("orgId").references("id").inTable(TableName.Organization).onDelete("CASCADE");
      tb.string("name").notNullable();
      tb.string("type");
      tb.timestamps(true, true, true);
      tb.index(["userId", "type"]);
    });
  }

  const doesConsumerSecretsAttributesTableExist = await knex.schema.hasTable(TableName.ConsumerSecretsAttributes);

  if (!doesConsumerSecretsAttributesTableExist) {
    await knex.schema.createTable(TableName.ConsumerSecretsAttributes, (tb) => {
      tb.uuid("id", { primaryKey: true }).defaultTo(knex.fn.uuid());
      tb.uuid("consumerSecretId").notNullable();
      tb.foreign("consumerSecretId").references("id").inTable(TableName.ConsumerSecrets).onDelete("CASCADE");
      tb.string("key").notNullable();
      tb.binary("encryptedValue");
      tb.unique(["consumerSecretId", "key"], {
        indexName: "secret_key_composite_uniqe",
        deferrable: "deferred"
      });
      tb.index("consumerSecretId");
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(TableName.ConsumerSecretsAttributes);
  await knex.schema.dropTableIfExists(TableName.ConsumerSecrets);
}
