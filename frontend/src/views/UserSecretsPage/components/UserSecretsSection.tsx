import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Button } from "@app/components/v2";

import { UserSecretsTable } from "./UserSecretsTable";

export const UserSecretsSection = () => {
  return (
    <div className="mb-6 rounded-lg border border-mineshaft-600 bg-mineshaft-900 p-4">
      <div className="mb-4 flex justify-between">
        <p className="text-xl font-semibold text-mineshaft-100">Your Secrets</p>
        <Button
          colorSchema="primary"
          leftIcon={<FontAwesomeIcon icon={faPlus} />}
          onClick={() => {
            // handlePopUpOpen("createSharedSecret");
          }}
        >
          Create Secret
        </Button>
      </div>

      <UserSecretsTable />
    </div>
  );
};
