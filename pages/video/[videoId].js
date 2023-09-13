import { useRouter } from "next/router";


const VideoIdPage = () => {
    const router = useRouter();
    const id = router.query.videoId;

    return <p> VideoIdPage </p>
}

export default VideoIdPage;