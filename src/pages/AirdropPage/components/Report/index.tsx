import React, { useEffect, useState, useContext } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  Row,
  Col,
  Container,
  Button,
  Card,
  Table,
  ProgressBar,
} from "react-bootstrap";
import { faCopy, faPlane, faReceipt } from "@fortawesome/free-solid-svg-icons";
import { PublicKey } from "@solana/web3.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { v1 as uuidv1 } from "uuid";
import styles from "./Report.module.css";
import { toast } from "react-toastify";
import CSVReader from "react-csv-reader";
import { airdropStates } from "../../../../utils/general";
import { logObjectType } from "../../../../services/AirdropService";
import { SolanaServiceContext } from "../../contexts/SolanaServiceContext";
import { AirdropServiceContext } from "../../contexts/AirdropServiceContext";
import AirdropLogItem from "../AirdropLogItem";

function Report({ reset }: { reset: any }) {
  const solanaService = useContext(SolanaServiceContext);
  const airdropService = useContext(AirdropServiceContext);

  const emptyLogArray: logObjectType[] = [];
  const emptyWalletListFailed: string[] = [];
  const [logArray, setLogArray] = useState(emptyLogArray);
  const [walletListFailed, setWalletListFailed] = useState(
    emptyWalletListFailed
  );

  const cleanAndReset = () => {
    solanaService.reset();
    airdropService.reset();
    reset();
  };

  useEffect(() => {
    setLogArray(airdropService.logs);
    setWalletListFailed(
      airdropService.logs
        .filter((log) => !log.success)
        .map((log) => log.walletAddress)
    );
  }, []);

  const csvData = () =>
    logArray.map((log, index) => {
      return {
        index: String(index),
        id: String(log.uniqueId),
        successful: String(log.success),
        transactionId: String(log.transactionId),
        message: String(log.message),
        address: String(log.walletAddress),
        amount: String(log.amount),
        timestamp: String(log.timestamp),
      };
    });

  return (
    <Container className={styles.container}>
      <AirdropServiceContext.Provider value={airdropService}>
        <h3>
          <FontAwesomeIcon icon={faReceipt} /> Airdrop Report
        </h3>
        <Row className="mt-3">
          <Col>
            <Card className="mt-2">
              <Card.Body>
                <Card.Title>
                  Congratulation, airdropping has completed!
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Do another airdrop or go back to the home page.
                </Card.Subtitle>
                <div className="p-5 text-center">
                  <Row className="">
                    <Col>Total Airdrops</Col>
                    <Col>Successful Airdrops</Col>
                    <Col>Failed Airdrops</Col>
                    <Col>Success Percentage</Col>
                  </Row>
                  <Row className="display-6">
                    <Col>{logArray.length}</Col>
                    <Col>{logArray.length - walletListFailed.length}</Col>
                    <Col>{walletListFailed.length}</Col>
                    <Col>
                      {Math.ceil(
                        ((logArray.length - walletListFailed.length) /
                          logArray.length) *
                          100
                      )}
                      %
                    </Col>
                  </Row>
                </div>
                <div className="mb-3">
                  <div className="d-grid gap-2">
                    <CopyToClipboard
                      text={walletListFailed.join(",")}
                      onCopy={() => toast.success("Copied to clipboard")}
                    >
                      <Button variant="warning" type="button" className="my-1">
                        <FontAwesomeIcon icon={faCopy} />
                        &nbsp; Copy List Of Failed Wallet Addresses
                      </Button>
                    </CopyToClipboard>
                  </div>
                  <div className="d-grid gap-2">
                    <Button
                      variant="primary"
                      type="button"
                      className="my-1"
                      onClick={() => cleanAndReset()}
                    >
                      <FontAwesomeIcon icon={faPlane} />
                      &nbsp; Do Another Airdrop
                    </Button>
                  </div>
                </div>
                <Table striped bordered responsive className={styles.table}>
                  <thead className={styles.thead}>
                    <tr>
                      <td>Index</td>
                      <td>ID</td>
                      <td>Timestamp</td>
                      <td>Status</td>
                      <td>Transaction ID</td>
                      <td>Message</td>
                      <td>Wallet Address</td>
                      <td>Amount</td>
                    </tr>
                  </thead>
                  <tbody className={styles.tbody}>
                    {logArray.map((item, index) => (
                      <AirdropLogItem
                        index={index}
                        key={item.uniqueId}
                        uniqueId={item.uniqueId}
                        success={item.success}
                        transactionId={item.transactionId}
                        message={item.message}
                        walletAddress={item.walletAddress}
                        amount={item.amount}
                        timestamp={item.timestamp}
                      />
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </AirdropServiceContext.Provider>
    </Container>
  );
}

export default Report;
