import { useRouter } from "next/router";
import Modal from 'react-modal';
import styles from '../../styles/video.module.css';
import clsx from 'classnames';
import NavBar from '../../components/nav/navbar';
import { getVideoById  } from "@/lib/video";
import Like from '../../components/icon/like-icon';
import DisLike from '../../components/icon/dislike-icon';
import { useState } from "react";

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
    const [toggleLike, setToggleLike] = useState(false);
    const [toggleDisLike, setToggleDisLike] = useState(false);

    const handleToggleLike = async() => {
        console.log('toggled')
        setToggleLike(!toggleLike);
        setToggleDisLike(toggleLike);
    }

    const handleToggleDisLike = async() => {
        console.log('toggled')
        setToggleLike(toggleLike);
        setToggleDisLike(!toggleLike);
    }
    
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
                    height="460"
                    src={`https://www.youtube.com/embed/${id}?autoplay=0&origin=http://example.com&controls=0&rel=1`}
                    className={styles.videoPlayer}
                    frameBorder={0}
                > 
                </iframe>
                <div className={styles.likeDislikeBtnWrapper}>
                    <div className={styles.likeBtnWrapper}>
                        <button onClick={handleToggleLike}>
                            <div className={styles.btnWrapper}>
                                <Like selected={toggleLike}/>
                            </div>
                        </button>
                    </div> 
                    <div className={styles.likeBtnWrapper}>
                        <button onClick={handleToggleDisLike}>
                            <div className={styles.btnWrapper}>
                                <DisLike selected={toggleDisLike} />
                            </div>
                        </button>
                    </div> 
                </div>
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