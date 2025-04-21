// Function to check if user is new
export async function isNewUser(token, issuer, hasuraClient) {
  const operationsDoc = `
  query isNewUser($issuer: String!) {
    users(where: {issuer: {_eq: $issuer}}) {
      id
      email
      issuer
    }
  }
`;

  const response = await hasuraClient(operationsDoc, "isNewUser", { issuer });
  return response?.data?.users?.length === 0;
}


// Function to create a new user in Hasura
export async function createNewUser(token, metadata, hasuraClient) {
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
  const response = await hasuraClient(operationsDoc, "createNewUser", { issuer, email, publicAddress });
  return response;
}

export async function findVideoByUser(token, userId, videoId,hasuraClient) {
  const operationsDoc = 
    `query findVideoByUser($userId: String!, $videoId: String!) {
      stats(where: { userId: {_eq: $userId}, videoId: {_eq: $videoId }}) {
        id
        userId
        videoId
        favourited
        watched
      }
    }`
  ;

  const response = await hasuraClient(
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

export async function insertStats(token, { favourited, userId, watched, videoId }, hasuraClient) {
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
    }`;

  const response = await hasuraClient(operationsDoc, "insertStats", { favourited, userId, watched, videoId });
  return response;
}

// Update stats in the database
export async function updateStats(token, { videoId, userId, watched, favourited },hasuraClient) {
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
    }`;

  const response = await hasuraClient(operationsDoc, "updateStats", { videoId, userId, watched, favourited });
  return response;
}

// Get watched videos for a user
export async function getWatchedVideo(userId, token, hasuraClient) {
  const operationsDoc = `
    query getWatchedVideo($userId: String!) {
      stats(where: {
        watched: {_eq: true}, 
        userId: {_eq: $userId},
      }) {
        videoId
        watched
      }
    }`;

  const response = await hasuraClient(operationsDoc, "getWatchedVideo", { userId });
  return response;
}

// Get the user's favorite videos (my list)
export async function getMyListVideo(userId, token, hasuraClient) {
  const operationsDoc = `
    query MyQuery($userId: String!) {
      stats(where: {
        favourited: {_eq: 1}, 
        userId: {_eq: $userId},
      }) {
        videoId
        favourited
      }
    }`;

  const response = await hasuraClient(operationsDoc, "MyQuery", { userId });
  return response;
}