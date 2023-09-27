import React from "react";
import styles from "./nav.module.scss";

type Props = {
  children?: React.ReactNode;
};

const NavDropdown = ({ children }: Props) => {
  return <div className={styles.dropdown_container}>{children}</div>;
};

export default NavDropdown;
