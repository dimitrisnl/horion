import type {Database} from "@horionos/db";

import type {ExtractTablesWithRelations} from "drizzle-orm";
import type {NodePgQueryResultHKT} from "drizzle-orm/node-postgres";
import type {PgTransaction} from "drizzle-orm/pg-core";

export type DatabaseConnection =
  | Database
  | PgTransaction<
      NodePgQueryResultHKT,
      Record<string, never>,
      ExtractTablesWithRelations<Record<string, never>>
    >;
