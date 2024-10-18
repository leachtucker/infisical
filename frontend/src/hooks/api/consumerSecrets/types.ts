export type TConsumerSecret = {
  id: string;
  userId: string;
  orgId: string;
  name: string;
  type: ConsumerSecretType;
  createdAt: string;
  updatedAt: string;
};

export type TDeleteConsumerSecretDTO = {
  id: string;
};

export type TUpdateConsumerSecretDTO = {
  id: string;
  name?: string;
  attributes: TUpdateConsumerSecretAttributeDTO[];
};

export type TCreateConsumerSecretDTO = {
  name: string;
  type: string;
};

export enum ConsumerSecretType {
  WebLogin = "WebLogin"
}

export enum ConsumerSecretsAttributesKey {
  username = "username",
  password = "password"
}

export type TConsumerSecretAttribute = {
  id: string;
  consumerSecretId: string;
  key: string;
  value: string;
};

export type TUpdateConsumerSecretAttributeDTO = {
  id?: string;
  consumerSecretId?: string;
  key: string;
  value: string;
};
