import React from "react";
import { Row, Col, Container, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import styles from "./FileTable.module.css";

function FileTable({ data }: { data: any }) {
  return (
    <Table striped bordered responsive className={styles.table}>
      <thead>
        <tr>
          <th>Address</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row: any) => {
          return (
            <tr key={row.address}>
              <td>{row && row.address ? row.address : ""}</td>
              <td>{row && row.amount ? row.amount : ""}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export default FileTable;
