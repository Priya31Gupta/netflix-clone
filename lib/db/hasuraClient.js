// lib/hasuraClient.js

import jwt from 'jsonwebtoken';

export function createHasuraClient(userMetadata) {
  const token = jwt.sign(
    {
      ...userMetadata,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
      "https://hasura.io/jwt/claims": {
        "x-hasura-allowed-roles": ["user", "admin"],
        "x-hasura-default-role": "user",
        "x-hasura-user-id": userMetadata.issuer,
      },
    },
    process.env.JWT_SECRET
  );
  
  return {
    token, // Add token here
    queryHasura: async function(query, operationName, variables = {}) {
      const response = await fetch(process.env.NEXT_PUBLIC_HASURA_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, variables, operationName }),
      });

      return await response.json();
    },
  };
}
