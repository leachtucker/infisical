import { Skeleton } from "@app/components/v2";
import { ConsumerSecretType, useGetAttributesForSecret } from "@app/hooks/api/consumerSecrets";

import { UserSecretLoginFields } from "../UserSecretLoginFields";

type UserSecretFieldsProps = {
  type: ConsumerSecretType;
  secretId: string;
};

export const UserSecretFields = ({ type, secretId }: UserSecretFieldsProps) => {
  const { data, isLoading } = useGetAttributesForSecret(secretId);

  console.log({ data });

  return (
    <div className="px-6 py-4">
      {isLoading && <Skeleton className="h-16" />}

      {!isLoading && data && type === ConsumerSecretType.WebLogin && (
        <UserSecretLoginFields attributes={data.consumerSecretAttributes} />
      )}
    </div>
  );
};
