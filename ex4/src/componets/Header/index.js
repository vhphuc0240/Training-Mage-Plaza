import React from "react";
import styles from "./index.module.scss";

const Header = () => {
  return (
    <div className={styles.header}>
      <div className={styles.headerLogo}>
        <img src="/logo.png" alt="logo" className={styles.headerImage} />
      </div>
      <div className={styles.headerUser}>
        <div className={styles.headerAvatar}>
          <span>XA</span>
        </div>
        <div className={styles.headerUsername}>Xquenda Andreev</div>
      </div>
    </div>
  );
};
export default Header;
