export type TConsumerSecret = {
  id: string;
  userId: string;
  orgId: string;
  name: string;
  type: ConsumerSecretType;
  createdAt: string;
  updatedAt: string;
};

export enum ConsumerSecretType {
  WebLogin = "WebLogin"
}

export type TConsumerSecretAttribute = {
  id: string;
  consumerSecretId: string;
  key: string;
  value: string;
};

export type TDeleteConsumerSecretDTO = {
  id: string;
};
