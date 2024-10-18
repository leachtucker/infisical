import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { createNotification } from "@app/components/notifications";
import {
  Button,
  FormControl,
  Input,
  Modal,
  ModalContent,
  Select,
  SelectItem
} from "@app/components/v2";
import { ConsumerSecretType, useCreateConsumerSecret } from "@app/hooks/api/consumerSecrets";
import { UsePopUpState } from "@app/hooks/usePopUp";

import { formatConsumerSecretTypeName } from "../utils";

type Props = {
  popUp: UsePopUpState<["userSecrets"]>;
  handlePopUpToggle: (popUpName: keyof UsePopUpState<["userSecrets"]>, state?: boolean) => void;
};

const schema = z
  .object({
    name: z.string().trim().min(1, "Enter a name"),
    type: z.string().min(1, "Select a type")
  })
  .required();

export type FormData = z.infer<typeof schema>;

const defaultValues = {
  name: "",
  type: ""
};

const formattedTypesOptions = Object.values(ConsumerSecretType).map((type) => ({
  label: formatConsumerSecretTypeName(type),
  value: type
}));

export const UserSecretsModal = ({ popUp, handlePopUpToggle }: Props) => {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues
  });

  const { mutateAsync: createConsumerSecret } = useCreateConsumerSecret();

  const handleCancelClick = () => {
    handlePopUpToggle("userSecrets", false);
  };

  const onFormSubmit = async (formData: FormData) => {
    try {
      await createConsumerSecret(formData);
      form.reset(defaultValues);
      handlePopUpToggle("userSecrets", false);
      createNotification({ type: "success", text: "Successfully created secret!" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal
      isOpen={popUp?.userSecrets?.isOpen}
      onOpenChange={(isOpen) => {
        handlePopUpToggle("userSecrets", isOpen);
      }}
    >
      <ModalContent title="Create User Secret">
        <form onSubmit={form.handleSubmit(onFormSubmit)}>
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState: { error } }) => (
              <FormControl
                label="Name"
                isError={Boolean(error)}
                errorText={error?.message}
                isRequired
              >
                <Input {...field} placeholder="My Login" />
              </FormControl>
            )}
          />

          <Controller
            control={form.control}
            name="type"
            render={({ field: { onChange, ...field }, fieldState: { error } }) => (
              <FormControl
                label="Type"
                errorText={error?.message}
                isError={Boolean(error)}
                className="mt-4"
                isRequired
              >
                <Select
                  defaultValue={field.value}
                  {...field}
                  onValueChange={(e) => onChange(e)}
                  className="w-full"
                  position="popper"
                  placeholder="Select"
                >
                  {formattedTypesOptions.map((opt) => (
                    <SelectItem value={opt.value} key={`st-type-${opt.value}`}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          <div className="mt-7 flex items-center gap-4">
            <Button
              isLoading={form.formState.isSubmitting}
              isDisabled={!form.formState.isDirty}
              type="submit"
            >
              Create Secret
            </Button>
            <Button
              isDisabled={form.formState.isSubmitting}
              onClick={handleCancelClick}
              variant="plain"
              colorSchema="secondary"
            >
              Cancel
            </Button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  );
};
