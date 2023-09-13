import videoData from "../data/videos.json";

export const getVideos = async (url:string) => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
    const baseUrl = `youtube.googleapis.com/youtube/v3`
  // https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=disney%20trailer&key=[YOUR_API_KEY]'

  try{
    const response = await fetch(
        `https://${baseUrl}/${url}&maxResults=25&key=${YOUTUBE_API_KEY}`
      );
    
      const data = await response.json();
      if(data.error){
        console.error("Youtube API error", data.error);
        return [];
      }
        return data?.items.map((item:any) => {
            return {
                title: item?.snippet?.title,
                imgUrl: item?.snippet?.thumbnails?.high?.url,
                id : item.id?.videoId || null
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