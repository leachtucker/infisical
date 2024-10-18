import { useQuery } from "@tanstack/react-query";

import { apiRequest } from "@app/config/request";

import { TConsumerSecret, TConsumerSecretAttribute } from "./types";

export const consumerSecretsKeys = {
  allUserSecrets: () => ["consumerSecrets"] as const,
  attributesForSecret: (secretId: string) => ["consumerSecretsAttributes", { secretId }]
};

export const useGetUserConsumerSecrets = () => {
  return useQuery({
    queryKey: consumerSecretsKeys.allUserSecrets(),
    queryFn: async () => {
      const { data } = await apiRequest.get<{
        consumerSecrets: TConsumerSecret[];
        totalCount: number;
      }>("/api/v1/consumer-secrets");

      return data;
    }
  });
};

export const useGetAttributesForSecret = (secretId: string) => {
  return useQuery({
    queryKey: consumerSecretsKeys.attributesForSecret(secretId),
    queryFn: async () => {
      const { data } = await apiRequest.get<{
        consumerSecretAttributes: TConsumerSecretAttribute[];
        totalCount: number;
      }>(`/api/v1/consumer-secrets/${secretId}/attributes`);

      return data;
    }
  });
};
