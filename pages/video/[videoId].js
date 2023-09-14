import { useRouter } from "next/router";
import Modal from 'react-modal';
import styles from '../../styles/video.module.css';
import clsx from 'classnames';
import NavBar from '../../components/nav/navbar';
import { getVideoById  } from "@/lib/video";

Modal.setAppElement('#__next');

export async function getStaticProps(context){
    const videoId = context.params.videoId;
    const videoData = await getVideoById(videoId);
    return {
        props: { video: videoData.length > 0 ? videoData[0] : {}, },
        revalidate: 10, // In seconds
    }
} 
export async function getStaticPaths() {
    const listOfVideos = ["mYfJxlgR2jw", "4zH5iYM4wJo", "KCPEHsAViiQ"];
    const paths = listOfVideos.map((videoId) => ({
     params: { videoId },
    }));

  return { paths, fallback: "blocking" };
}

const VideoIdPage = ({video}) => {
    const router = useRouter();
    const id = router.query.videoId;
    
    const { title, publishTime, description, channelTitle, statistics: { viewCount } = { viewCount: 0 } } = video;
    return (
        <div className={styles.container}>
            <NavBar  />
            <Modal
                isOpen={true}
                onRequestClose={() => router.back()}
                overlayClassName={styles.overlay}
                contentLabel="Watch the video"
                className={styles.modal}
            >
                <iframe
                    id="ytplayer"
                    type="text/html"
                    width="100%"
                    height="360"
                    src={`https://www.youtube.com/embed/${id}?autoplay=0&origin=http://example.com&controls=0&rel=1`}
                    className={styles.videoPlayer}
                    frameBorder={0}
                ></iframe>
                <div className={styles.modalBodyContent}>
                    <div className={styles.modalBody}>
                        <div className={styles.col1}>
                            <p className={styles.publishTime}>{publishTime}</p>
                            <p className={styles.title}>{title}</p>
                            <p className={styles.description}>{description}</p>
                        </div>
                    </div>
                    <div className={styles.col2}>
                        <p className={clsx(styles.subText, styles.subTextWrapper)}>
                            <span className={styles.textColor}>Cast: </span>
                            <span className={styles.channelTitle}>{channelTitle}</span>
                        </p>
                        <p className={clsx(styles.subText, styles.subTextWrapper)}>
                            <span className={styles.textColor}>View Count: </span>
                            <span className={styles.channelTitle}>{viewCount}</span>
                        </p>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default VideoIdPage;