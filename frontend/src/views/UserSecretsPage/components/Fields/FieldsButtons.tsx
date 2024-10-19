import { faCheck, faEdit, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { IconButton, Tooltip } from "@app/components/v2";

type Props = {
  isEditMode: boolean;
  onCancelClick: () => void;
  onEditClick: () => void;
};

export const FieldsButtons = ({ isEditMode, onCancelClick, onEditClick }: Props) => {
  return isEditMode ? (
    <>
      <Tooltip content="Cancel">
        <IconButton
          key="cancel-btn"
          size="lg"
          onClick={onCancelClick}
          variant="plain"
          ariaLabel="Save"
        >
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      </Tooltip>
      <Tooltip content="Save">
        <IconButton key="save-btn" size="lg" type="submit" variant="plain" ariaLabel="Save">
          <FontAwesomeIcon icon={faCheck} />
        </IconButton>
      </Tooltip>
    </>
  ) : (
    <Tooltip content="Edit">
      <IconButton key="edit-btn" size="lg" onClick={onEditClick} variant="plain" ariaLabel="Edit">
        <FontAwesomeIcon icon={faEdit} />
      </IconButton>
    </Tooltip>
  );
};
