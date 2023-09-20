async function fetchGraphQl(operationsDoc, operationName, variables, token) {
  const result = await fetch(process.env.NEXT_PUBLIC_HASURA_URL, {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}

export async function isNewUser(token, issuer) {
  const operationsDoc = `
  query isNewUser($issuer: String!) {
    users(where: {issuer: {_eq: $issuer}}) {
      id
      email
      issuer
    }
  }
`;

  const response = await fetchGraphQl(
    operationsDoc,
    "isNewUser",
    {
      issuer,
    },
    token
  );

  return response?.data?.users?.length === 0;
}


export async function createNewUser(token, metadata) {
  const operationsDoc = `
    mutation createNewUser($issuer: String!, $email: String!, $publicAddress: String!) {
      insert_users(objects: {email: $email, issuer: $issuer, publicAddress: $publicAddress}) {
        returning {
          email
          id
          issuer
          publicAddress
        }
      }
    }
  `;

  const { issuer, email, publicAddress } = metadata;
  const response = await fetchGraphQl(
        operationsDoc,
        "createNewUser",
        {
          issuer,
          email,
          publicAddress
        },
        token
      );
      return response;
}

export async function findVideoByUser(token, userId, videoId) {
  const operationsDoc = `
    query findVideoByUser($userId: String!, $videoId: String!) {
      stats(where: { userId: {_eq: $userId}, videoId: {_eq: $videoId }}) {
        id
        userId
        videoId
        favourited
        watched
      }
    }
  `;

  const response = await fetchGraphQl(
    operationsDoc,
    "findVideoByUser",
    {
      userId,
      videoId
    },
    token
  );

  return response;
}

export async function insertStats(token, { favourited, userId, watched, videoId }) {
     const operationsDoc = `
     mutation insertStats($userId: String!, $videoId: String!, $favourited: Int!, $watched: Boolean!) {
      insert_stats_one(object: {
        userId: $userId, 
        videoId: $videoId,
        watched: $watched, 
        favourited: $favourited
      }) {
        favourited
        userId
        videoId
        watched
      }
    }`

    const response = await fetchGraphQl(
      operationsDoc,
      "insertStats",
      { favourited, userId, watched, videoId },
      token
    );
    return response;
}

export async function updateStats(token, { videoId, userId, watched, favourited }) {
  const operationsDoc = `
  mutation updateStats($favourited: Int!, $userId: String!, $watched: Boolean!, $videoId: String!) {
    update_stats(
      _set: {watched: $watched, favourited: $favourited}, 
      where: {
        userId: {_eq: $userId}, 
        videoId: {_eq: $videoId}
      }) {
      returning {
        favourited,
        userId,
        watched,
        videoId
      }
    }
  }
  `;
  
 

 const response = await fetchGraphQl(
   operationsDoc,
   "updateStats",
   { 
    videoId, userId, watched, favourited
   },
   token
 );
 return response;
}

export async function getWatchedVideo(userId, token){
  const operationsDoc = `
  query getWatchedVideo($userId: String!) {
    stats(where: {
      watched: {_eq: true}, 
      userId: {_eq: $userId},
    }) {
      videoId
      watched
    }
  }
`;
const response = await fetchGraphQl(
  operationsDoc,
  "getWatchedVideo",
  { userId },
  token
);

  return  response;
}

export async function getMyListVideo(userId, token){
  const operationsDoc = `
  query MyQuery($userId: String!) {
    stats(where: {
      favourited: {_eq: 1}, 
      userId: {_eq: $userId},
    }) {
      videoId
      favourited
    }
  }
`;
const response = await fetchGraphQl(
  operationsDoc,
  "MyQuery",
  { userId },
  token
);

  return  response;
}