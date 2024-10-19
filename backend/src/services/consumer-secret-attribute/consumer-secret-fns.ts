import { TConsumerSecretsAttributes } from "@app/db/schemas";

type TDecryptAttributesArg = {
  attributes: TConsumerSecretsAttributes[];
  decryptor: (value: Buffer) => Buffer;
};

export const decryptAttributes = async ({ attributes, decryptor }: TDecryptAttributesArg) => {
  return attributes.map((attr) => ({
    ...attr,
    value: attr.encryptedValue ? decryptor(attr.encryptedValue).toString() : ""
  }));
};
