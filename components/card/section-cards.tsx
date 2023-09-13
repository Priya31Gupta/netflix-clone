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
        return <Link href={`/video/${video.id}`} >
                  <Card key={idx} id={idx} imgUrl={video.imgUrl} size={size} />;
              </Link>
        })}
      </div>
    </section>
  );
};

export default SectionCards;