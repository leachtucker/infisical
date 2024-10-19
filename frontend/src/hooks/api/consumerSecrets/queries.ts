import { useQuery } from "@tanstack/react-query";

import { apiRequest } from "@app/config/request";

import { ConsumerSecretType, TConsumerSecret, TConsumerSecretAttribute } from "./types";

export const consumerSecretsKeys = {
  allUserSecrets: () => ["consumerSecrets"] as const,
  userSecretsBySearchTerm: (params: { searchTerm?: string; secretType?: ConsumerSecretType }) => [
    ...consumerSecretsKeys.allUserSecrets(),
    { params }
  ],
  attributesForSecret: (secretId: string) => ["consumerSecretsAttributes", { secretId }]
};

type UseGetUserConsumerSecretsParams = { searchTerm?: string; secretType?: ConsumerSecretType };

export const useGetUserConsumerSecrets = (params: UseGetUserConsumerSecretsParams) => {
  return useQuery({
    queryKey: consumerSecretsKeys.userSecretsBySearchTerm(params),
    queryFn: async () => {
      const encodedParams = new URLSearchParams(params);

      const { data } = await apiRequest.get<{
        consumerSecrets: TConsumerSecret[];
        totalCount: number;
      }>("/api/v1/consumer-secrets", { params: encodedParams });

      return data;
    }
  });
};

export const useGetAttributesForSecret = (consumerSecretId: string) => {
  return useQuery({
    queryKey: consumerSecretsKeys.attributesForSecret(consumerSecretId),
    queryFn: async () => {
      const { data } = await apiRequest.get<{
        consumerSecretAttributes: TConsumerSecretAttribute[];
        totalCount: number;
      }>(`/api/v1/consumer-secrets/${consumerSecretId}/attributes`);

      return data;
    }
  });
};
