import { faCopy, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { createNotification } from "@app/components/notifications";
import { IconButton, Input, InputProps, Tooltip } from "@app/components/v2";
import { useToggle } from "@app/hooks";

type Props = Omit<InputProps, "rightIcon" | "type"> & { forceShow?: boolean };

export const ConcealedField = ({ value, forceShow, ...props }: Props) => {
  const [isConcealed, setIsConcealed] = useToggle(true);

  const handleCopyToClipboard = async () => {
    if (value) {
      try {
        await window.navigator.clipboard.writeText(String(value));
        createNotification({ type: "success", text: "Copied to clipboard" });
      } catch (error) {
        console.log(error);
        createNotification({ type: "error", text: "Failed to copy secret to clipboard" });
      }
    }
  };

  const isVisible = !isConcealed || forceShow;
  return (
    <Input
      autoComplete="off"
      {...props}
      value={value}
      type={isVisible ? "text" : "password"}
      rightIcon={
        value ? (
          <div className="flex gap-[1px]">
            <Tooltip content="Copy">
              <IconButton
                ariaLabel="copy-value"
                onClick={handleCopyToClipboard}
                variant="plain"
                className="h-full"
              >
                <FontAwesomeIcon icon={faCopy} />
              </IconButton>
            </Tooltip>
            {!forceShow && (
              <Tooltip content={isConcealed ? "Reveal" : "Conceal"}>
                <IconButton
                  variant="plain"
                  ariaLabel={isConcealed ? "Reveal" : "Conceal"}
                  onClick={setIsConcealed.toggle}
                >
                  {isConcealed ? (
                    <FontAwesomeIcon icon={faEyeSlash} />
                  ) : (
                    <FontAwesomeIcon icon={faEye} />
                  )}
                </IconButton>
              </Tooltip>
            )}
          </div>
        ) : null
      }
    />
  );
};
