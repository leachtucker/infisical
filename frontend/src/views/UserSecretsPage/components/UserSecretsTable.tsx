import { useState } from "react";
import { faCheckCircle, faKey, faList, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { twMerge } from "tailwind-merge";

import { createNotification } from "@app/components/notifications";
import {
  DeleteActionModal,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  EmptyState,
  IconButton,
  Input,
  Table,
  TableContainer,
  TableSkeleton,
  TBody,
  Th,
  THead,
  Tooltip,
  Tr
} from "@app/components/v2";
import { useDebounce, usePopUp } from "@app/hooks";
import {
  ConsumerSecretType,
  useDeleteConsumerSecret,
  useGetUserConsumerSecrets
} from "@app/hooks/api/consumerSecrets";

import { getIconForConsumerSecretTypeName, UserSecretTypesOptions } from "../utils";
import { UserSecretsRow } from "./UserSecretsRow";

// todo: Implement pagination & searching
export const UserSecretsTable = () => {
  const { popUp, handlePopUpOpen, handlePopUpClose, handlePopUpToggle } = usePopUp([
    "deleteUserSecret"
  ] as const);

  const { mutateAsync: deleteMutateAsync } = useDeleteConsumerSecret();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm);

  const [filteredSecretType, setFilteredSecretType] = useState<ConsumerSecretType | undefined>();

  const { isLoading, data } = useGetUserConsumerSecrets({
    searchTerm: debouncedSearchTerm,
    secretType: filteredSecretType
  });

  const onDeleteSecretSubmit = async (secretId: string) => {
    try {
      await deleteMutateAsync({
        id: secretId
      });

      createNotification({
        text: "Successfully deleted secret",
        type: "success"
      });

      handlePopUpClose("deleteUserSecret");
    } catch (err) {
      console.error(err);
      const error = err as any;
      const text = error?.response?.data?.message ?? "Failed to delete secret";

      createNotification({
        text,
        type: "error"
      });
    }
  };

  const handleRowDeleteClick = (id: string, name: string) => {
    handlePopUpOpen("deleteUserSecret", {
      secretId: id,
      name
    });
  };

  const isFilteringByType = Boolean(filteredSecretType);

  return (
    <>
      <div className="flex gap-2">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
          placeholder="Search secrets..."
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <IconButton
              ariaLabel="Environments"
              variant="plain"
              size="sm"
              className={twMerge(
                "flex h-10 w-11 items-center justify-center overflow-hidden border border-mineshaft-600 bg-mineshaft-800 p-0 transition-all hover:border-primary/60 hover:bg-primary/10",
                isFilteringByType && "border-primary/50 text-primary"
              )}
            >
              <Tooltip content="Choose user secret types" className="mb-2">
                <FontAwesomeIcon icon={faList} />
              </Tooltip>
            </IconButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Choose visible user secret types</DropdownMenuLabel>
            {UserSecretTypesOptions.map((option) => {
              const isSelected = filteredSecretType === option.value;
              return (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    if (!isSelected) {
                      setFilteredSecretType(option.value);
                    } else {
                      setFilteredSecretType(undefined);
                    }
                  }}
                  key={option.value}
                  icon={
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className={`${isSelected && "text-primary-500"}`}
                    />
                  }
                  iconPos="right"
                >
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={getIconForConsumerSecretTypeName(option.value)!}
                      className="w-3"
                    />
                    {option.label}
                  </div>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <TableContainer className="mt-4">
        <Table>
          <THead>
            <Tr>
              <Th className="w-44">Name</Th>
              <Th className="w-44">Type</Th>
              <Th className="w-24">Created</Th>
              <Th aria-label="button" className="w-5" />
            </Tr>
          </THead>
          <TBody>
            {isLoading && <TableSkeleton columns={4} innerKey="user-secrets" />}
            {!isLoading &&
              data?.consumerSecrets?.map((row) => (
                <UserSecretsRow
                  key={row.id}
                  row={row}
                  onDeleteClick={() => handleRowDeleteClick(row.id, row.name)}
                />
              ))}
          </TBody>
        </Table>
        {!isLoading && !data?.consumerSecrets?.length && (
          <EmptyState title="No user secrets created yet" icon={faKey} />
        )}
      </TableContainer>
      <DeleteActionModal
        isOpen={popUp.deleteUserSecret.isOpen}
        title={`Are you sure want to delete ${
          (popUp?.deleteUserSecret?.data as { name: string })?.name || ""
        }?`}
        onChange={(isOpen) => handlePopUpToggle("deleteUserSecret", isOpen)}
        deleteKey="confirm"
        onDeleteApproved={() =>
          onDeleteSecretSubmit((popUp?.deleteUserSecret?.data as { secretId: string })?.secretId)
        }
      />
    </>
  );
};
