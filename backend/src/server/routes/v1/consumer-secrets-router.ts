import { z } from "zod";

import { ConsumerSecretsAttributesSchema, ConsumerSecretsSchema, ConsumerSecretType } from "@app/db/schemas";
import { readLimit, writeLimit } from "@app/server/config/rateLimiter";
import { verifyAuth } from "@app/server/plugins/auth/verify-auth";
import { AuthMode } from "@app/services/auth/auth-type";

export const registerConsumerSecretsRouter = async (server: FastifyZodProvider) => {
  server.route({
    method: "GET",
    url: "/",
    config: {
      rateLimit: readLimit
    },
    schema: {
      // params: z.object({
      //   orgId: z.string().trim()
      // }),
      response: {
        // 200: z.object({
        //   consumerSecrets: ConsumerSecretsEnriched.array()
        // })
      }
    },
    onRequest: verifyAuth([AuthMode.JWT, AuthMode.IDENTITY_ACCESS_TOKEN]),
    handler: async (req) => {
      // todo: Decide on orgId param or org attached to auth

      const consumerSecrets = await server.services.consumerSecret.getConsumerSecrets({
        actorId: req.permission.id,
        actor: req.permission.type,
        actorAuthMethod: req.permission.authMethod,
        actorOrgId: req.permission.orgId
      });

      return { consumerSecrets };
    }
  });

  server.route({
    method: "POST",
    url: "/",
    config: {
      rateLimit: writeLimit
    },
    schema: {
      body: z.object({
        name: z.string(),
        type: z.nativeEnum(ConsumerSecretType),
        attributes: z
          .object({
            key: z.string(),
            value: z.string()
          })
          .array()
          .optional()
      }),
      response: {
        200: z.object({
          consumerSecret: ConsumerSecretsSchema
        })
      }
    },
    onRequest: verifyAuth([AuthMode.JWT, AuthMode.IDENTITY_ACCESS_TOKEN]),
    handler: async (req) => {
      const consumerSecret = await server.services.consumerSecret.createConsumerSecret({
        actorId: req.permission.id,
        actor: req.permission.type,
        actorOrgId: req.permission.orgId,
        actorAuthMethod: req.permission.authMethod,
        name: req.body.name,
        type: req.body.type,
        attributes: req.body.attributes
      });

      return { consumerSecret };
    }
  });

  server.route({
    method: "DELETE",
    url: "/:consumerSecretId",
    config: {
      rateLimit: writeLimit
    },
    schema: {
      params: z.object({
        consumerSecretId: z.string().trim()
      }),
      response: {
        200: z.object({
          consumerSecret: ConsumerSecretsSchema
        })
      }
    },
    onRequest: verifyAuth([AuthMode.JWT, AuthMode.IDENTITY_ACCESS_TOKEN]),
    handler: async (req) => {
      const consumerSecret = await server.services.consumerSecret.deleteConsumerSecret({
        actorId: req.permission.id,
        actor: req.permission.type,
        actorOrgId: req.permission.orgId,
        actorAuthMethod: req.permission.authMethod,
        id: req.params.consumerSecretId
      });

      return { consumerSecret };
    }
  });

  server.route({
    method: "GET",
    url: "/:consumerSecretId/attributes",
    config: {
      rateLimit: readLimit
    },
    schema: {
      params: z.object({
        consumerSecretId: z.string().trim()
      }),
      response: {
        200: z.object({
          consumerSecretAttributes: ConsumerSecretsAttributesSchema.extend({
            value: z.string()
          })
            .omit({ encryptedValue: true })
            .array(),
          totalCount: z.number()
        })
      }
    },
    onRequest: verifyAuth([AuthMode.JWT, AuthMode.IDENTITY_ACCESS_TOKEN]),
    handler: async (req) => {
      const consumerSecretAttributes =
        await server.services.consumerSecretAttribute.getConsumerSecretAttributesForSecret({
          actorId: req.permission.id,
          actor: req.permission.type,
          actorOrgId: req.permission.orgId,
          actorAuthMethod: req.permission.authMethod,
          consumerSecretId: req.params.consumerSecretId
        });

      return { consumerSecretAttributes, totalCount: consumerSecretAttributes.length };
    }
  });
};
