import { faCreditCard, faUser } from "@fortawesome/free-solid-svg-icons";

import { ConsumerSecretType } from "@app/hooks/api/consumerSecrets";

export const formatConsumerSecretTypeName = (type: string) => {
  if (type === ConsumerSecretType.WebLogin) return "Web Login";
  if (type === ConsumerSecretType.CreditCard) return "Credit Card";
  return type;
};

export const getIconForConsumerSecretTypeName = (type: string) => {
  if (type === ConsumerSecretType.WebLogin) return faUser;
  if (type === ConsumerSecretType.CreditCard) return faCreditCard;
  return null;
};

export const UserSecretTypesOptions = Object.values(ConsumerSecretType).map((type) => ({
  label: formatConsumerSecretTypeName(type),
  value: type
}));
