import videoData from "../data/videos.json";

const fetchData = async(url:string) => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const baseUrl = `youtube.googleapis.com/youtube/v3`;
  try{
    const response = await fetch(
      `https://${baseUrl}/${url}&maxResults=25&key=${YOUTUBE_API_KEY}`
    );
  
    return await response.json();
  }catch(err){
    console.error('something went wrong',err)
  }
}

export const getVideos = async (url:string) => {
  const isDev = process.env.DEVELOPMENT;

  try{
      const data = isDev ? videoData : await fetchData(url);
      if(data.error){
        console.error("Youtube API error", data.error);
        return [];
      }
        return data?.items.map((item:any) => {
            return {
                title: item?.snippet?.title,
                imgUrl: item?.snippet?.thumbnails?.high?.url,
                id : item.id?.videoId || item.id,
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