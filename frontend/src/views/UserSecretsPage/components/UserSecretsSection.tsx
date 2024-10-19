import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Button } from "@app/components/v2";
import { usePopUp } from "@app/hooks";

import { UserSecretsModal } from "./UserSecretsModal";
import { UserSecretsTable } from "./UserSecretsTable";

export const UserSecretsSection = () => {
  const { popUp, handlePopUpOpen, handlePopUpToggle } = usePopUp(["userSecrets"] as const);

  const handleCreateSecretClick = () => {
    handlePopUpOpen("userSecrets");
  };

  return (
    <div className="mb-6 rounded-lg border border-mineshaft-600 bg-mineshaft-900 p-4">
      <div className="mb-4 flex justify-between">
        <p className="text-xl font-semibold text-mineshaft-100">Your Secrets</p>
        <Button
          colorSchema="primary"
          leftIcon={<FontAwesomeIcon icon={faPlus} />}
          onClick={handleCreateSecretClick}
        >
          Create Secret
        </Button>
      </div>

      <UserSecretsTable />
      <UserSecretsModal popUp={popUp} handlePopUpToggle={handlePopUpToggle} />
    </div>
  );
};
