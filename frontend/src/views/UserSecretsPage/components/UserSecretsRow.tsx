import React from "react";
import { format } from "date-fns";

import { Td, Tr } from "@app/components/v2";
import { useToggle } from "@app/hooks";
import { ConsumerSecretType, TConsumerSecret } from "@app/hooks/api/consumerSecrets";

import { UserSecretFields } from "./Fields/UserSecretFields";

type UserSecretsRowProps = {
  row: TConsumerSecret;
};

export const UserSecretsRow = ({ row }: UserSecretsRowProps) => {
  const [isFormExpanded, setIsFormExpanded] = useToggle();

  const formattedCreatedAtDate = format(new Date(row.createdAt), "yyyy-MM-dd - HH:mm a");
  return (
    <>
      <Tr onClick={() => setIsFormExpanded.toggle()}>
        <Td>{row.name}</Td>
        <Td>{row.type}</Td>
        <Td>{formattedCreatedAtDate}</Td>
      </Tr>

      {isFormExpanded && (
        <Tr>
          <Td
            colSpan={4}
            className={`bg-bunker-600 px-0 py-0 ${
              isFormExpanded && "border-b-2 border-mineshaft-500"
            }`}
          >
            <div>
              {row.type === ConsumerSecretType.WebLogin && (
                <UserSecretFields type={row.type} secretId={row.id} />
              )}
            </div>
          </Td>
        </Tr>
      )}
    </>
  );
};
