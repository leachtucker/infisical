import { useState } from "react";
import { faKey } from "@fortawesome/free-solid-svg-icons";

import {
  EmptyState,
  Pagination,
  Table,
  TableContainer,
  TableSkeleton,
  TBody,
  Th,
  THead,
  Tr
} from "@app/components/v2";
import { useGetUserConsumerSecrets } from "@app/hooks/api/consumerSecrets";

import { UserSecretsRow } from "./UserSecretsRow";

// todo: Complete pagination
export const UserSecretsTable = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const { isLoading, data } = useGetUserConsumerSecrets();

  return (
    <TableContainer>
      <Table>
        <THead>
          <Tr>
            <Th>Name</Th>
            <Th>Type</Th>
            <Th>Created At</Th>
            <Th aria-label="button" className="w-5" />
          </Tr>
        </THead>
        <TBody>
          {isLoading && <TableSkeleton columns={7} innerKey="user-secrets" />}
          {!isLoading &&
            data?.consumerSecrets?.map((row) => <UserSecretsRow key={row.id} row={row} />)}
        </TBody>
      </Table>
      {!isLoading &&
        data?.consumerSecrets &&
        data?.totalCount >= perPage &&
        data?.totalCount !== undefined && (
          <Pagination
            count={data.totalCount}
            page={page}
            perPage={perPage}
            onChangePage={(newPage) => setPage(newPage)}
            onChangePerPage={(newPerPage) => setPerPage(newPerPage)}
          />
        )}
      {!isLoading && !data?.consumerSecrets?.length && (
        <EmptyState title="No user secrets created yet" icon={faKey} />
      )}
    </TableContainer>
  );
};
