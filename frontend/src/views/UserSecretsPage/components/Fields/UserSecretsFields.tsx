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

  return (
    <div className="py-8 px-14">
      {type === ConsumerSecretType.WebLogin &&
        (isLoading || !data ? (
          <Skeleton className="h-[58px]" />
        ) : (
          <WebLoginFields
            consumerSecretId={consumerSecretId}
            attributes={data.consumerSecretAttributes}
          />
        ))}

      {type === ConsumerSecretType.CreditCard &&
        (isLoading || !data ? (
          <Skeleton className="h-[142px]" />
        ) : (
          <CreditCardFields
            consumerSecretId={consumerSecretId}
            attributes={data.consumerSecretAttributes}
          />
        ))}
    </div>
  );
};
