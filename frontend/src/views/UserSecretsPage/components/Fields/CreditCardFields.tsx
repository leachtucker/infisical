import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { createNotification } from "@app/components/notifications";
import { FormControl, Input } from "@app/components/v2";
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
    cardNumber: z.string(),
    securityCode: z.string(),
    expirationDate: z.string()
  })
  .required();

export type FormData = z.infer<typeof schema>;

export const CreditCardFields = ({ consumerSecretId, attributes }: Props) => {
  const [isEditMode, setIsEditMode] = useToggle();

  const cardNumberAttr = attributes.find(
    (attr) => attr.key === ConsumerSecretsAttributesKey.cardNumber
  );

  const securityCodeAttr = attributes.find(
    (attr) => attr.key === ConsumerSecretsAttributesKey.securityCode
  );

  const expirationDateAttr = attributes.find(
    (attr) => attr.key === ConsumerSecretsAttributesKey.expirationDate
  );

  const form = useForm<FormData>({
    defaultValues: {
      cardNumber: cardNumberAttr?.value ?? "",
      securityCode: securityCodeAttr?.value ?? "",
      expirationDate: expirationDateAttr?.value ?? ""
    },
    resolver: zodResolver(schema)
  });
  const { mutateAsync } = useUpdateConsumerSecret();

  const onFormSubmit = async (formData: FormData) => {
    try {
      const nextCardNumberAttr = {
        ...cardNumberAttr,
        key: ConsumerSecretsAttributesKey.cardNumber,
        value: formData.cardNumber
      };

      const nextSecurityCodeAttr = {
        ...securityCodeAttr,
        key: ConsumerSecretsAttributesKey.securityCode,
        value: formData.securityCode
      };

      const nextExpirationDateAttr = {
        ...expirationDateAttr,
        key: ConsumerSecretsAttributesKey.expirationDate,
        value: formData.expirationDate
      };

      await mutateAsync({
        id: consumerSecretId,
        attributes: [nextCardNumberAttr, nextSecurityCodeAttr, nextExpirationDateAttr]
      });

      form.reset(formData);
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
        <div className="flex w-full flex-wrap gap-y-4 gap-x-6">
          <div className="flex-grow basis-full">
            <Controller
              control={form.control}
              name="cardNumber"
              render={({ field, fieldState: { error } }) => (
                <FormControl
                  isError={Boolean(error?.message)}
                  errorText={error?.message}
                  className="mb-0"
                  label="Card Number"
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
              name="securityCode"
              render={({ field, fieldState: { error } }) => (
                <FormControl
                  isError={Boolean(error?.message)}
                  errorText={error?.message}
                  className="mb-0"
                  label="Security Code"
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
              name="expirationDate"
              render={({ field, fieldState: { error } }) => (
                <FormControl
                  isError={Boolean(error?.message)}
                  errorText={error?.message}
                  className="mb-0"
                  label="Expiration Date"
                >
                  <Input
                    {...field}
                    isDisabled={field.disabled || !isEditMode}
                    readOnly={!isEditMode}
                    placeholder="empty"
                    autoFocus
                    type="date"
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
