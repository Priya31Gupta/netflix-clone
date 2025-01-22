import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { magic } from "../lib/magic-client";
import "../styles/globals.css";
import type { AppProps } from 'next/app';
import Loading from '../components/loading/loading';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleLoggedIn = async () => {
      setLoading(true);
      const isLoggedIn = await magic.user.isLoggedIn();
      if (isLoggedIn) {
        console.log('✌️handleLoggedIn ---> inside if');
        router.push("/");
      } else {
        router.push("/login");
      }
    };
    handleLoggedIn();
  }, []);

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

  return loading ? <Loading /> :  <Component {...pageProps} />;
}
