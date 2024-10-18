import { z } from "zod";

import { ConsumerSecretsAttributesSchema } from "@app/db/schemas";
import { writeLimit } from "@app/server/config/rateLimiter";
import { verifyAuth } from "@app/server/plugins/auth/verify-auth";
import { AuthMode } from "@app/services/auth/auth-type";

export const registerConsumerSecretsAttributesRouter = async (server: FastifyZodProvider) => {
  server.route({
    method: "POST",
    url: "/",
    config: {
      rateLimit: writeLimit
    },
    schema: {
      body: z.object({
        consumerSecretId: z.string(),
        key: z.string(),
        value: z.string()
      }),
      response: {
        200: z.object({
          consumerSecretAttribute: ConsumerSecretsAttributesSchema
        })
      }
    },
    onRequest: verifyAuth([AuthMode.JWT, AuthMode.IDENTITY_ACCESS_TOKEN]),
    handler: async (req) => {
      const consumerSecretAttribute = await server.services.consumerSecretAttribute.createConsumerSecretAttribute({
        actorId: req.permission.id,
        actor: req.permission.type,
        actorOrgId: req.permission.orgId,
        actorAuthMethod: req.permission.authMethod,
        consumerSecretId: req.body.consumerSecretId,
        key: req.body.key,
        value: req.body.value
      });

      return { consumerSecretAttribute };
    }
  });
};
