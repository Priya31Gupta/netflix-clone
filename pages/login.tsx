import Link from 'next/link';
import styles from '../styles/Login.module.css';
import Head from 'next/head';
import Image from "next/legacy/image";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { magic } from "../lib/magic-client";



const Login = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [userMsg, setUserMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const handleInputChange = (event:any) => {
        setUserMsg('');
        setEmail(event.target.value);
    }

    const ValidateEmail = (mail:string) => {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
            return (true)
        return (false)
    }

    const handleLoginWithEmail = async() => {
        if(!ValidateEmail(email)){
           setUserMsg('Please Enter Valid Email');
           return; 
        }else{
            try {
                setLoading(true);
                const didToken  = await magic.auth.loginWithEmailOTP({ email});
                console.log(didToken, "didtoken");
                if (didToken) {
                    localStorage.setItem('didToken',JSON.stringify({ didToken,email}));
                    router.push("/");
                }
            } catch (error:any) {
                setLoading(false);
                setUserMsg('Something went wrong while authentication.');
            }
        }
    }

    useEffect(()=>{
        const handleComplete = () => {
            setLoading(false);
        };
        router.events.on("routeChangeComplete", handleComplete);
        router.events.on("routeChangeError", handleComplete);

        return () => {
            router.events.off("routeChangeComplete", handleComplete);
            router.events.off("routeChangeError", handleComplete);
        };
    }, [router])


    return (
        <div  className={styles.container}>
            <Head>
                <title>Netflix SignIn</title>
            </Head>

            <header className={styles.header}>
                <div className={styles.headerWrapper}>
                <Link className={styles.logoLink} href="/">
                    <div className={styles.logoWrapper}>
                        <Image
                        src="/static/netflix.svg"
                        alt="Netflix logo"
                        width={128}
                        height={34}
                        priority
                        />
                    </div>
                </Link>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.mainWrapper}>
                <h1 className={styles.signinHeader}>Sign In</h1>

                <input
                    type="text"
                    placeholder="Email address"
                    className={styles.emailInput}
                    value={email}
                    onChange={ (e) => handleInputChange(e)}
                />

                <p className={styles.userMsg}> {userMsg} </p>
                    <button onClick={handleLoginWithEmail} className={styles.loginBtn}>
                        {loading ? "Loading..." : 'Sign In'}
                    </button>
                </div>
            </main>
        </div>
        
    )
}

export default Login;