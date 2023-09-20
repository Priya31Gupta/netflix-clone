import SectionCards from "@/components/card/section-cards";
import NavBar from "@/components/nav/navbar";
import Head from "next/head";
import styles from '../../styles/myList.module.css';
import verifyToken from "@/lib/utils";
import { getMyListVideos } from "@/lib/video";

export async function getServerSideProps(context: any){
    const token = context.req ? context.req?.cookies.token : null;
    const userId = await verifyToken(token);
    
    if(!userId){
        return {
            props: {},
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }

    const myListVideos = await getMyListVideos(userId, token);
    return {
        props: {
            myListVideos
        }
    }
}
 

export default function MyList({myListVideos = []}){
    return <div>
        <Head>
            <title>My list</title>
        </Head>
        <main className={styles.main}>
            <NavBar />
            <div className={styles.sectionWrapper}>
                <SectionCards title="My List" videos={myListVideos} size="small" />
            </div>
        </main>
    </div>
}