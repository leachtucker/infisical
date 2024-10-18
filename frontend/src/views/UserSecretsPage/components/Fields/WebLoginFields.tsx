import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { createNotification } from "@app/components/notifications";
import { FormControl } from "@app/components/v2";
import { useToggle } from "@app/hooks";
import {
  ConsumerSecretsAttributesKey,
  TConsumerSecretAttribute,
  useUpdateConsumerSecret
} from "@app/hooks/api/consumerSecrets";

import { ConcealedField } from "./ConcealedField";
import { FieldsButtons } from "./FieldsButtons";

type Props = { consumerSecretId: string; attributes: TConsumerSecretAttribute[] };

const schema = z
  .object({
    username: z.string(),
    password: z.string()
  })
  .required();

export type FormData = z.infer<typeof schema>;

export const WebLoginFields = ({ consumerSecretId, attributes }: Props) => {
  const usernameAttr = attributes.find(
    (attr) => attr.key === ConsumerSecretsAttributesKey.username
  );

  const passwordAttr = attributes.find(
    (attr) => attr.key === ConsumerSecretsAttributesKey.password
  );

  const [isEditMode, setIsEditMode] = useToggle();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: usernameAttr?.value ?? "",
      password: passwordAttr?.value ?? ""
    }
  });

  const { mutateAsync: mutateConsumerSecretAsync } = useUpdateConsumerSecret();

  const onFormSubmit = async (formData: FormData) => {
    try {
      const nextUsernameAttr = {
        ...usernameAttr,
        key: ConsumerSecretsAttributesKey.username,
        value: formData.username
      };

      const nextPasswordAttr = {
        ...passwordAttr,
        key: ConsumerSecretsAttributesKey.password,
        value: formData.password
      };

      await mutateConsumerSecretAsync({
        id: consumerSecretId,
        attributes: [nextUsernameAttr, nextPasswordAttr]
      });

      setIsEditMode.timedToggle();
      createNotification({ type: "success", text: "Successfully updated secret!" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onFormSubmit)} autoComplete="off">
      <div className="relative">
        <div className="absolute -right-4 -top-4 z-10 flex items-center justify-end">
          <FieldsButtons
            isEditMode={isEditMode}
            onCancelClick={() => {
              setIsEditMode.toggle();
              form.reset();
            }}
            onEditClick={setIsEditMode.toggle}
          />
        </div>
        <div className="flex w-full flex-wrap gap-6">
          <div className="flex-grow">
            <Controller
              control={form.control}
              name="username"
              render={({ field, fieldState: { error } }) => (
                <FormControl
                  isError={Boolean(error?.message)}
                  errorText={error?.message}
                  className="mb-0"
                  label="Username"
                >
                  <ConcealedField
                    {...field}
                    isDisabled={field.disabled || !isEditMode}
                    readOnly={!isEditMode}
                    forceShow={isEditMode}
                    placeholder="empty"
                    autoFocus
                  />
                </FormControl>
              )}
            />
          </div>
          <div className="flex-grow">
            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState: { error } }) => (
                <FormControl
                  isError={Boolean(error?.message)}
                  errorText={error?.message}
                  className="mb-0 w-full"
                  label="Password"
                >
                  <ConcealedField
                    {...field}
                    isDisabled={field.disabled || !isEditMode}
                    readOnly={!isEditMode}
                    forceShow={isEditMode}
                    placeholder="empty"
                  />
                </FormControl>
              )}
            />
          </div>
        </div>
      </div>
    </form>
  );
};
