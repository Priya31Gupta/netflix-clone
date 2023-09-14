import Image from "next/legacy/image";
import styles from "./card.module.css";
import { useState } from "react";
import cls from "classnames";
import { motion } from "framer-motion";

const Card = (props: any) => {
  const { imgUrl = "/static/banner.jpeg", size = "medium",id, } = props;

  const [imgSrc, setImgSrc] = useState(imgUrl);
  const scale = id === 0 ? { scaleY: 1.1 } : { scale: 1.1 };
  const classMap : any = {
    large: styles.lgItem,
    medium: styles.mdItem,
    small: styles.smItem,
  };

  const handleOnError = () => {
    setImgSrc("/static/banner.jpeg");
  };

  return (
    <div className={styles.container}>
      <div className={classMap[size]}>
        <motion.div
            className={cls(styles.imgMotionWrapper, classMap[size])}
            whileHover={{ ...scale }}
        >
            <Image
                src={imgSrc}
                alt="image"
                layout="fill"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={styles.cardImg}
            />
        </motion.div>
      </div>
    </div>
  );
};

export default Card;