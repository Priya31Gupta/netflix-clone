import Link from "next/link";
import Card from "./card";
import styles from "./section-cards.module.css";

const SectionCards = (props:any) => {
    const { title, videos=[], size } = props;
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.cardWrapper}>
      {videos.map((video: any, idx:any) => {

        const Id: string = typeof video.id != 'string' ? video.id.videoId : video.id;

        const  Thumbnail: string = typeof video.id != 'string' ? video.snippet.thumbnails.default.url : video.imgUrl;
        
        return <Link href={`/video/${Id}`} key={idx} title={title}>
                  <Card id={idx} imgUrl={Thumbnail} size={size} />
              </Link>
        })}
      </div>
    </section>
  );
};

export default SectionCards;