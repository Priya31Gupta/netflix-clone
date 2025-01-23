import styles from "../styles/Home.module.css";
import Head from 'next/head';
import Banner from "../components/banner/banner";
import NavBar from "../components/nav/navbar";
import SectionCards from "../components/card/section-cards";
import { getSpecificVideos, getPopularVideos, getWatchItAgainVideos } from "../lib/video";
import verifyToken from '../lib/utils';



export async function getServerSideProps(context:any) {
  const token = context.req ? context.req?.cookies.token : null;
  const userId = await verifyToken(token);
  const disneyVideos = await getSpecificVideos('disney trailer');
  const travelVideos = await getSpecificVideos("indie music");
  const productivityVideos = await getSpecificVideos("Productivity");
  const popularVideos = await getPopularVideos();
  if(!userId){
    return {
      props: {},
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const watchedVideo = await getWatchItAgainVideos(userId,token);

  return {
    props: { disneyVideos,productivityVideos,travelVideos, popularVideos, watchedVideo} 
  };
}

export default function Home({ disneyVideos, productivityVideos,travelVideos, popularVideos, watchedVideo }: { 
  disneyVideos: any,
  travelVideos:any, 
  productivityVideos:any,
  popularVideos: any,
  watchedVideo: any
}) {
  return (
    <div className={styles.container}>
      <Head>
        <meta name="google-site-verification" content="_ucB6EGoQpe42sbwItrrJWhOTzW6WPoIFZn6bHyjwd0" />
        <title>Cinestream</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavBar  />

      <Banner 
      title="Clifford the red dog"
      subTitle="a very cute dog"
      imgUrl="/static/banner.jpeg"
      videoId='4zH5iYM4wJo'
      />

      <div className={styles.sectionWrapper}>
        <SectionCards title="Watch it again" videos={watchedVideo} size="large" /> 
        <SectionCards title="Disney" videos={disneyVideos} size="large" />
        <SectionCards title="Productivity" videos={productivityVideos} size="large" />
        <SectionCards title="Travel" videos={travelVideos} size="large" />
        <SectionCards title="Popular" videos={popularVideos} size="large" />
      </div>
      
    </div>
  )
}
