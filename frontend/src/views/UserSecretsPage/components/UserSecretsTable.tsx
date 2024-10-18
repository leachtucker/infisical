import { faKey } from "@fortawesome/free-solid-svg-icons";

import { createNotification } from "@app/components/notifications";
import {
  DeleteActionModal,
  EmptyState,
  Table,
  TableContainer,
  TableSkeleton,
  TBody,
  Th,
  THead,
  Tr
} from "@app/components/v2";
import { usePopUp } from "@app/hooks";
import { useDeleteConsumerSecret, useGetUserConsumerSecrets } from "@app/hooks/api/consumerSecrets";

import { UserSecretsRow } from "./UserSecretsRow";

// todo: Implement pagination & searching
export const UserSecretsTable = () => {
  const { isLoading, data } = useGetUserConsumerSecrets();

  const { popUp, handlePopUpOpen, handlePopUpClose, handlePopUpToggle } = usePopUp([
    "deleteUserSecret"
  ] as const);

  const { mutateAsync: deleteMutateAsync } = useDeleteConsumerSecret();

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

  return (
    <>
      <TableContainer>
        <Table>
          <THead>
            <Tr>
              <Th className="w-56">Name</Th>
              <Th className="w-24">Type</Th>
              <Th className="w-48">Created At</Th>
              <Th aria-label="button" className="w-5" />
            </Tr>
          </THead>
          <TBody>
            {isLoading && <TableSkeleton columns={7} innerKey="user-secrets" />}
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
