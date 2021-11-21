import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import styles from "./Message.module.css";

function Message({ message }: { message: string }) {
  return <Container className={styles.messageContainer}>{message}</Container>;
}

export default Message;
