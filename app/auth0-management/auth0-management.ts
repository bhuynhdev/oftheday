import { ManagementClient } from "auth0";

// const management = new ManagementClient({
//   domain: process.env.AUTH0_ISSUER_BASE_URL!.split("//")[1],
//   clientId: process.env.AUTH0_CLIENT_ID!,
//   clientSecret: process.env.AUTH0_CLIENT_SECRET!,
// });


const management = new ManagementClient({
  domain: process.env.AUTH0_ISSUER_BASE_URL!.split("//")[1],
  token: process.env.AUTH0_API_V2_TOKEN!
});



export const addMetadataToUser = (userId: string, metadata: Record<string, any>) => {
  console.log("----------------HERE--------------")
  management.users.update({ id: userId }, { user_metadata: metadata });
};
