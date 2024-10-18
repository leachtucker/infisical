import { Skeleton } from "@app/components/v2";
import { ConsumerSecretType, useGetAttributesForSecret } from "@app/hooks/api/consumerSecrets";

import { UserSecretsLoginFields } from "./UserSecretsLoginFields";

type UserSecretsFieldsProps = {
  type: ConsumerSecretType;
  consumerSecretId: string;
};

export const UserSecretsFields = ({ type, consumerSecretId }: UserSecretsFieldsProps) => {
  const { data, isLoading } = useGetAttributesForSecret(consumerSecretId);

  console.log({ data });

  return (
    <div className="p-6">
      {isLoading && <Skeleton className="h-16" />}

      {!isLoading && data && type === ConsumerSecretType.WebLogin && (
        <UserSecretsLoginFields
          consumerSecretId={consumerSecretId}
          attributes={data.consumerSecretAttributes}
        />
      )}
    </div>
  );
};
