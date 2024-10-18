import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiRequest } from "@app/config/request";

import { consumerSecretsKeys } from "./queries";
import { TConsumerSecret, TDeleteConsumerSecretDTO } from "./types";

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
