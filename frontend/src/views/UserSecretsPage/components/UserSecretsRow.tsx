import React from "react";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Tag,
  Td,
  Tr
} from "@app/components/v2";
import { useToggle } from "@app/hooks";
import { TConsumerSecret } from "@app/hooks/api/consumerSecrets";

import { formatConsumerSecretTypeName } from "../utils";
import { UserSecretsFields } from "./Fields/UserSecretsFields";

type UserSecretsRowProps = {
  row: TConsumerSecret;
  onDeleteClick: () => void;
};

// todo: Add permission checking for menu actions

export const UserSecretsRow = ({ row, onDeleteClick }: UserSecretsRowProps) => {
  const [isFormExpanded, setIsFormExpanded] = useToggle();

  const formattedCreatedAtDate = format(new Date(row.createdAt), "yyyy-MM-dd - HH:mm a");
  const formattedSecretType = formatConsumerSecretTypeName(row.type);
  return (
    <>
      <Tr className="cursor-pointer" onClick={() => setIsFormExpanded.toggle()}>
        <Td>{row.name}</Td>
        <Td>
          <Tag>{formattedSecretType}</Tag>
        </Td>
        <Td>{formattedCreatedAtDate}</Td>
        <Td>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex justify-center hover:text-primary-400 data-[state=open]:text-primary-400">
                <FontAwesomeIcon size="sm" icon={faEllipsis} />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="p-1">
              <DropdownMenuItem
                className="hover:!bg-red-500 hover:!text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteClick();
                }}
              >
                Delete Secret
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Td>
      </Tr>

      {isFormExpanded && (
        <Tr>
          <Td colSpan={4} className="bg-bunker-600 px-0 py-0">
            <div>
              <UserSecretsFields type={row.type} consumerSecretId={row.id} />
            </div>
          </Td>
        </Tr>
      )}
    </>
  );
};
