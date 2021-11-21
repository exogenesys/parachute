import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import styles from "./Footer.module.css";

function Footer() {
  return (
    <Container>
      <Row>
        <Col>
          <footer className={styles.footer}>
            <span className="text-muted">
              Made with <FontAwesomeIcon icon={faHeart} /> on the internet.
              Powered by SolRazor.
            </span>
          </footer>
        </Col>
      </Row>
    </Container>
  );
}

export default Footer;
