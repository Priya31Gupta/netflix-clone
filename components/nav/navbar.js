import styles from './navbar.module.css';
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Image from "next/legacy/image";
import {magic} from '../../lib/magic-client.js';

const NavBar = (props) => {
    const [userName, setUserName] = useState('');
    const[userMsg,setUserMsg] = useState('');
    const [didToken, setDidToken] = useState('');

    const router = useRouter();

    const handleOnClickHome = (e) => {
        e.preventDefault();
        router.push("/");
    };

    const handleOnClickMyList = (e) => {
        e.preventDefault();
        router.push("/browse/my-list");
    };
    const [showDropdown, setShowDropdown] = useState(false);

    const handleShowDropdown = (e) => {
        e.preventDefault();
        setShowDropdown(!showDropdown);
    };

    const handleSignOut = async () => {
        try {
            const loggingOut = await fetch('/api/logout',{
                method: 'POST',
                headers:{
                    Authorization: `Bearer ${didToken}`,
                    'Content-Type': 'application/json'
                },
            });
            const loggedOut = await loggingOut.json();
            if(loggedOut.loggedOut)
                router.push('/login');
          } catch(error) {
            console.error("Error logging out", error);
          }
    }
    useEffect(()=>{
        const getUser = async () => {
            try {
                let { email, publicAddress, issuer } = await magic.user.getMetadata();
                const didToken = await magic.user.getIdToken();
                if(email){
                    setUserName(email);
                    setDidToken(didToken);
                }
            } catch {
                setUserMsg('Something went wrong while authentication.');
            }
        }
        getUser();
    },[])


    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <a className={styles.logoLink}>
                <div className={styles.logoWrapper}>
                    <Image
                    src="/static/cinestream.png"
                    alt="cinestream logo"
                    width={128}
                    height={34}
                    />
                </div>
                </a>
                <ul className={styles.navItems}>
                    <li className={styles.navItem} onClick={handleOnClickHome}>Home</li>
                    <li className={styles.navItem2} onClick={handleOnClickMyList}>My List</li>
                </ul>
                <nav className={styles.navContainer}>
                    <div>
                    <button className={styles.usernameBtn}  onClick={handleShowDropdown}>
                        <p className={styles.username}>{ userName ? userName : "Sign In"}</p>
                    </button>
        
                    {showDropdown && (
                        <div className={styles.navDropdown}>
                            <div>
                                <a onClick={handleSignOut} className={styles.linkName}>Sign out</a>
                                <div className={styles.lineWrapper}></div>
                            </div>
                        </div>
                        
                    )}
                    </div>
                </nav>
            </div>
        </div>
    );
  };
  
  export default NavBar;
  