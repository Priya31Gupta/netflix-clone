import styles from './navbar.module.css';
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Image from "next/legacy/image";
import {magic} from '../../lib/magic-client.js';

const NavBar = (props) => {
    const [userName, setUserName] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const[userMsg,setUserMsg] = useState('');

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
            const res = await magic.user.logout();
            setLoggedIn(res);
            localStorage.removeItem('didtoken')
            router.push("/login");
          } catch(error) {
            console.error("Error logging out", error);
            //router.push("/login");
          }
    }
    useEffect(()=>{
        const getUser = async () => {
            try {
                const isLoggedIn = await magic.user.isLoggedIn();
                let { email, publicAddress } = await magic.user.getMetadata();
                const localDidToken = JSON.parse(localStorage.getItem('didtoken')) || '';
                if(isLoggedIn || localDidToken.didtoken){
                    if(!email && localDidToken.email) email = localDidToken.email;
                    setLoggedIn(true);
                    setUserName(email);
                }
            } catch {
                setLoggedIn(false);
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
                    src="/static/netflix.svg"
                    alt="Netflix logo"
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
                        <p className={styles.username}>{ loggedIn? userName : "Sign In"}</p>
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
  