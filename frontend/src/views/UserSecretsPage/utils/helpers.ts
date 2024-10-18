import { ConsumerSecretType } from "@app/hooks/api/consumerSecrets";

export const formatConsumerSecretTypeName = (type: string) => {
  if (type === ConsumerSecretType.WebLogin) return "Web Login";
  if (type === ConsumerSecretType.CreditCard) return "Credit Card";
  return type;
};
