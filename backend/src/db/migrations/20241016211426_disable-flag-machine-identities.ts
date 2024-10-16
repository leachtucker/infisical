import { Knex } from "knex";

import { TableName } from "../schemas";

export async function up(knex: Knex): Promise<void> {
  // add disabled flag for machine identities
  if (await knex.schema.hasTable(TableName.Identity)) {
    const hasIsDisabledCol = await knex.schema.hasColumn(TableName.Identity, "isDisabled");

    if (!hasIsDisabledCol) {
      await knex.schema.alterTable(TableName.Identity, (tb) => {
        tb.boolean("isDisabled").notNullable().defaultTo(false);
      });
    }
  }
}

export async function down(knex: Knex): Promise<void> {
  // add disabled flag for machine identities
  if (await knex.schema.hasTable(TableName.Identity)) {
    const hasIsDisabledCol = await knex.schema.hasColumn(TableName.Identity, "isDisabled");

    if (!hasIsDisabledCol) {
      await knex.schema.alterTable(TableName.Identity, (tb) => {
        tb.dropColumn("isDisabled");
      });
    }
  }
}
