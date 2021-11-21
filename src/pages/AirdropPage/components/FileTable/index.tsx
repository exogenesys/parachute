import React from "react";
import { Table } from "react-bootstrap";
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
