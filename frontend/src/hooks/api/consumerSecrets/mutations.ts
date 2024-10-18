import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiRequest } from "@app/config/request";

import { consumerSecretsKeys } from "./queries";
import {
  TConsumerSecret,
  TCreateConsumerSecretDTO,
  TDeleteConsumerSecretDTO,
  TUpdateConsumerSecretDTO
} from "./types";

export const useDeleteConsumerSecret = () => {
  const queryClient = useQueryClient();

  return useMutation<{}, {}, TDeleteConsumerSecretDTO>({
    mutationFn: async (dto) => {
      const { data } = await apiRequest.delete<{ consumerSecret: TConsumerSecret }>(
        `/api/v1/consumer-secrets/${dto.id}`
      );
      return data.consumerSecret;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(consumerSecretsKeys.allUserSecrets());
    }
  });
};

export const useUpdateConsumerSecret = () => {
  const queryClient = useQueryClient();

  return useMutation<{}, {}, TUpdateConsumerSecretDTO>({
    mutationFn: async (payload) => {
      const { data } = await apiRequest.patch<{ consumerSecret: TConsumerSecret }>(
        `/api/v1/consumer-secrets/${payload.id}`,
        payload
      );
      return data.consumerSecret;
    },
    onSuccess: (_, payload) => {
      if (payload.name != null) {
        queryClient.invalidateQueries(consumerSecretsKeys.allUserSecrets());
      }
      if (payload.attributes) {
        queryClient.invalidateQueries(consumerSecretsKeys.attributesForSecret(payload.id));
      }
    }
  });
};

export const useCreateConsumerSecret = () => {
  const queryClient = useQueryClient();

  return useMutation<{}, {}, TCreateConsumerSecretDTO>({
    mutationFn: async (dto) => {
      const { data } = await apiRequest.post<{ consumerSecret: TConsumerSecret }>(
        "/api/v1/consumer-secrets",
        dto
      );
      return data.consumerSecret;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(consumerSecretsKeys.allUserSecrets());
    }
  });
};
