import { Skeleton } from "@app/components/v2";
import { ConsumerSecretType, useGetAttributesForSecret } from "@app/hooks/api/consumerSecrets";

import { UserSecretsLoginFields } from "./UserSecretsLoginFields";

type UserSecretsFieldsProps = {
  type: ConsumerSecretType;
  secretId: string;
};

export const UserSecretsFields = ({ type, secretId }: UserSecretsFieldsProps) => {
  const { data, isLoading } = useGetAttributesForSecret(secretId);

  console.log({ data });

  return (
    <div className="px-6 py-4">
      {isLoading && <Skeleton className="h-16" />}

      {!isLoading && data && type === ConsumerSecretType.WebLogin && (
        <UserSecretsLoginFields attributes={data.consumerSecretAttributes} />
      )}
    </div>
  );
};
