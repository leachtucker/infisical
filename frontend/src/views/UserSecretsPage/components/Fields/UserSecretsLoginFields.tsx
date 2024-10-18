import { FormLabel, Input } from "@app/components/v2";
import { TConsumerSecretAttribute } from "@app/hooks/api/consumerSecrets";

import { ConcealedField } from "./ConcealedField";

type UserSecretsLoginFieldsProps = { attributes: TConsumerSecretAttribute[] };

export const UserSecretsLoginFields = ({ attributes }: UserSecretsLoginFieldsProps) => {
  const username = attributes.find((attr) => attr.key === "username")?.value ?? "";
  const password = attributes.find((attr) => attr.key === "password")?.value ?? "";

  return (
    <div className="flex w-full gap-8">
      <div className="flex-grow">
        <FormLabel label="Username" />
        <Input readOnly disabled value={username} />
      </div>
      <div className="flex-grow">
        <FormLabel label="Password" />
        <ConcealedField value={password} />
      </div>
    </div>
  );
};
