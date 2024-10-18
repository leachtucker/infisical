import { Skeleton } from "@app/components/v2";
import { ConsumerSecretType, useGetAttributesForSecret } from "@app/hooks/api/consumerSecrets";

import { CreditCardFields } from "./CreditCardFields";
import { WebLoginFields } from "./WebLoginFields";

type UserSecretsFieldsProps = {
  type: ConsumerSecretType;
  consumerSecretId: string;
};

export const UserSecretsFields = ({ type, consumerSecretId }: UserSecretsFieldsProps) => {
  const { data, isLoading } = useGetAttributesForSecret(consumerSecretId);

  console.log({ data });

  return (
    <div className="p-6">
      {isLoading && <Skeleton className="h-[58px]" />}

      {!isLoading && data && type === ConsumerSecretType.WebLogin && (
        <WebLoginFields
          consumerSecretId={consumerSecretId}
          attributes={data.consumerSecretAttributes}
        />
      )}

      {!isLoading && data && type === ConsumerSecretType.CreditCard && (
        <CreditCardFields
          consumerSecretId={consumerSecretId}
          attributes={data.consumerSecretAttributes}
        />
      )}
    </div>
  );
};
