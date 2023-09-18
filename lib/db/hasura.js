async function fetchGraphQL(operationsDoc, operationName, variable, token) {
    const result = await fetch(
        process.env.NEXT_PUBLIC_HASURA_URL,
        {
          method: "POST",
          headers: {
            'Authorization' : `Bearer ${token}`,
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            query: operationsDoc,
            variable:variable,
            operationName: operationName
          })
        }
      );
  
    return await result.json();
  }
  
  export async function isNewUser(token, issuer) {
    const operationsDoc = `
    query isNewUser($issuer: String!) {
      users(where: {
        issuer: {_eq: $issuer}
      }) {
        email
        id
        issuer
        publicAddress
      }
    }
  `;
  const response = await fetchGraphQL(operationsDoc, "isNewUser", {issuer}, token);
  return response?.data?.users?.length === 0;
  }

  export async function createNewUser(token, issuer){
    const operationsDoc = `
    mutation MyMutation {
      insert_users(objects: {email: "abcdef@abcdef.com", issuer: "abcdef", publicAddress: "abcdef"}) {
        returning {
          email
          id
          issuer
          publicAddress
        }
      }
    }
  `;
  const response = await fetchGraphQL(operationsDoc, "MyMutation", {issuer}, token);
  console.log({response});
  return response;
  }
  