import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import styles from "./HomePage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faParachuteBox } from "@fortawesome/free-solid-svg-icons";

function Airdrop() {
  let accountInfo = null;

  return (
    <div className={styles.homePageContainer}>
      <Row>
        <Col>
          <h1>
            <FontAwesomeIcon icon={faParachuteBox} />
            &nbsp; Parachute
          </h1>
        </Col>
      </Row>
    </div>
  );
}

export default Airdrop;
