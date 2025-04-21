import videoData from "../data/videos.json";
import { getMyListVideo, getWatchedVideo } from './db/hasura';

const fetchData = async(url:string) => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const baseUrl = `youtube.googleapis.com/youtube/v3`;
  try{
    const response = await fetch(
      `https://${baseUrl}/${url}&maxResults=25&key=${YOUTUBE_API_KEY}`
    );
  
    return await response.json();
  }catch(err){
    console.error('something went wrong',err);
    return [];
  }
}

export const getVideos = async (url:string) => {
  try{
      const data = await fetchData(url);
      if(data.error){
        console.error("Youtube API error", data.error);
        return videoData.items;
      }
      return data?.items.map((item:any) => {
          const id = item.id?.videoId || item.id;
            return {
                title: item?.snippet?.title,
                id  ,
                imgUrl: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
                description: item.snippet.description,
                publishTime: item.snippet.publishedAt,
                channelTitle: item.snippet.channelTitle,
                statistics: item.statistics ? item.statistics : { viewCount: 0 },
            };
        });
  }catch(err){
    console.error('something went wrong',err)
  }
  
};

export const getSpecificVideos = async (seachQuery:any) => {
    let url = `search?part=snippet&q=${seachQuery}&type=video`;
    return  getVideos(url);
}
export const getPopularVideos = () => {
    let url = `videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=IN`;
    return  getVideos(url);
}

export const getVideoById = async(id:string) => {
  let url = `videos?id=${id}&part=snippet`;
  return getVideos(url);
}

export const getWatchItAgainVideos = async (userId : string, token: string, hasuraClient: any) => {
  const videos = await getWatchedVideo(userId, token, hasuraClient);
  const watchedVideo = videos?.data?.stats.map((video: any) => {
    return {
      id: video.videoId,
      imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
    }
  });
  return watchedVideo;
};

export const getMyListVideos = async (userId:string, token:string, hasuraClient: any) => {
  const videos = await getMyListVideo(userId,token, hasuraClient);
  const mylistVideos = videos?.data?.stats.map((video: any) => {
    return {
      id: video.videoId,
      imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
    }
  });
  return mylistVideos;
}