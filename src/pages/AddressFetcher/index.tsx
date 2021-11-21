import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import styles from "./AddressFetcher.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressBook } from "@fortawesome/free-solid-svg-icons";

function AddressFetcher() {
  return (
    <div className={styles.homePageContainer}>
      <Row>
        <Col>
          <h1>
            <FontAwesomeIcon icon={faAddressBook} />
            &nbsp; Address Fetcher
          </h1>
          <h3>Coming Soon!</h3>
        </Col>
      </Row>
    </div>
  );
}

export default AddressFetcher;
