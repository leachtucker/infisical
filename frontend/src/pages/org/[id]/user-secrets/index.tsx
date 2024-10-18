import Head from "next/head";

import { UserSecretsPage } from "@app/views/UserSecretsPage";

const SecretApproval = () => {
  // todo: Setup translation for title/metadata
  return (
    <>
      <Head>
        <title>User Secrets</title>
        <link rel="icon" href="/infisical.ico" />
        <meta property="og:image" content="/images/message.png" />
        <meta property="og:title" content="User Secrets Management" />
        <meta name="og:description" content="Manage your user secrets " />
      </Head>

      <div className="h-full">
        <UserSecretsPage />
      </div>
    </>
  );
};

export default SecretApproval;

SecretApproval.requireAuth = true;
