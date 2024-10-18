import { FaEye, FaEyeSlash } from "react-icons/fa";

import { IconButton, Input, Tooltip } from "@app/components/v2";
import { useToggle } from "@app/hooks";

type ConcealedFieldProps = { value: string };

export const ConcealedField = ({ value }: ConcealedFieldProps) => {
  const [isConcealed, setIsConcealed] = useToggle(true);

  return (
    <Input
      readOnly
      disabled
      value={value}
      type={isConcealed ? "password" : "text"}
      rightIcon={
        <Tooltip content={isConcealed ? "Reveal" : "Conceal"}>
          <IconButton
            variant="plain"
            ariaLabel={isConcealed ? "Reveal" : "Conceal"}
            onClick={setIsConcealed.toggle}
          >
            {isConcealed ? <FaEyeSlash /> : <FaEye />}
          </IconButton>
        </Tooltip>
      }
    />
  );
};
