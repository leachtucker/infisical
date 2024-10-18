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

type Props = {
  popUp: UsePopUpState<["userSecrets"]>;
  handlePopUpToggle: (popUpName: keyof UsePopUpState<["userSecrets"]>, state?: boolean) => void;
};

const schema = z
  .object({
    name: z.string(),
    type: z.string()
  })
  .required();

export type FormData = z.infer<typeof schema>;

export const UserSecretsModal = ({ popUp, handlePopUpToggle }: Props) => {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      type: ""
    }
  });

  const { mutateAsync: createConsumerSecret } = useCreateConsumerSecret();

  const handleCancelClick = () => {
    handlePopUpToggle("userSecrets", false);
  };

  const onFormSubmit = async (formData: FormData) => {
    try {
      await createConsumerSecret(formData);
      form.reset();
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
        // reset();
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
            defaultValue=""
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
                >
                  {(Object.values(ConsumerSecretType) || []).map((val) => (
                    <SelectItem value={val} key={`st-type-${val}`}>
                      {val}
                    </SelectItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          <div className="mt-7 flex items-center gap-4">
            <Button isLoading={form.formState.isSubmitting} type="submit">
              Create Secret
            </Button>
            <Button
              isLoading={form.formState.isSubmitting}
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
