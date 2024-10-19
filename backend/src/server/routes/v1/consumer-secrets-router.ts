import { z } from "zod";

import { ConsumerSecretsAttributesSchema, ConsumerSecretsSchema, ConsumerSecretType } from "@app/db/schemas";
import { EventType } from "@app/ee/services/audit-log/audit-log-types";
import { CONSUMER_SECRETS } from "@app/lib/api-docs";
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
      description: "List consumer secrets",
      security: [
        {
          bearerAuth: []
        }
      ],
      querystring: z.object({
        searchTerm: z.string().trim().toLowerCase().optional(),
        secretType: z.nativeEnum(ConsumerSecretType).optional()
      }),
      response: {
        200: z.object({
          consumerSecrets: ConsumerSecretsSchema.array()
        })
      }
    },
    onRequest: verifyAuth([AuthMode.JWT, AuthMode.IDENTITY_ACCESS_TOKEN]),
    handler: async (req) => {
      const consumerSecrets = await server.services.consumerSecret.getConsumerSecrets({
        actorId: req.permission.id,
        actor: req.permission.type,
        actorAuthMethod: req.permission.authMethod,
        actorOrgId: req.permission.orgId,
        searchTerm: req.query.searchTerm,
        secretType: req.query.secretType
      });

      await server.services.auditLog.createAuditLog({
        ...req.auditLogInfo,
        orgId: req.permission.orgId,
        event: {
          type: EventType.GET_CONSUMER_SECRETS,
          metadata: {
            userId: req.permission.id,
            orgId: req.permission.orgId
          }
        }
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
      description: "Create a consumer secret",
      security: [
        {
          bearerAuth: []
        }
      ],
      body: z.object({
        name: z.string().trim().describe(CONSUMER_SECRETS.CREATE_KEY.name),
        type: z.nativeEnum(ConsumerSecretType).describe(CONSUMER_SECRETS.CREATE_KEY.type),
        attributes: z
          .object({
            key: z.string().trim(),
            value: z.string().trim()
          })
          .array()
          .optional()
          .describe(CONSUMER_SECRETS.CREATE_KEY.attributes)
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

      await server.services.auditLog.createAuditLog({
        ...req.auditLogInfo,
        orgId: req.permission.orgId,
        event: {
          type: EventType.CREATE_CONSUMER_SECRET,
          metadata: {
            userId: req.permission.id,
            orgId: req.permission.orgId,
            secretType: req.body.type,
            secretId: consumerSecret.id,
            secretName: consumerSecret.name
          }
        }
      });

      return { consumerSecret };
    }
  });

  server.route({
    method: "PATCH",
    url: "/:consumerSecretId",
    config: {
      rateLimit: writeLimit
    },
    schema: {
      description: "Update consumer secret",
      security: [
        {
          bearerAuth: []
        }
      ],
      params: z.object({
        consumerSecretId: z.string().trim()
      }),
      body: z.object({
        name: z.string().trim().optional().describe(CONSUMER_SECRETS.UPDATE_KEY.name),
        attributes: z
          .object({
            id: z.string().trim().optional(),
            key: z.string().trim(),
            value: z.string().trim()
          })
          .describe(CONSUMER_SECRETS.UPDATE_KEY.attributes)
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
      const consumerSecret = await server.services.consumerSecret.updateConsumerSecret({
        actorId: req.permission.id,
        actor: req.permission.type,
        actorOrgId: req.permission.orgId,
        actorAuthMethod: req.permission.authMethod,
        id: req.params.consumerSecretId,
        name: req.body.name,
        attributes: req.body.attributes
      });

      await server.services.auditLog.createAuditLog({
        ...req.auditLogInfo,
        orgId: req.permission.orgId,
        event: {
          type: EventType.UPDATE_CONSUMER_SECRET,
          metadata: {
            userId: req.permission.id,
            orgId: req.permission.orgId,
            secretId: consumerSecret.id,
            secretName: consumerSecret.name
          }
        }
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

      await server.services.auditLog.createAuditLog({
        ...req.auditLogInfo,
        orgId: req.permission.orgId,
        event: {
          type: EventType.DELETE_CONSUMER_SECRET,
          metadata: {
            userId: req.permission.id,
            orgId: req.permission.orgId,
            secretId: consumerSecret.id,
            secretName: consumerSecret.name
          }
        }
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
