import React, { useEffect, useState, useContext } from "react";
import {
  Row,
  Col,
  Container,
  Button,
  Card,
  Table,
  ProgressBar,
} from "react-bootstrap";
import {
  faArrowLeft,
  faParachuteBox,
  faPlane,
  faSkull,
} from "@fortawesome/free-solid-svg-icons";
import { PublicKey } from "@solana/web3.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Catapult.module.css";
import { airdropStates } from "../../../../utils/general";
import { logObjectType } from "../../../../services/AirdropService";
import { SolanaServiceContext } from "../../contexts/SolanaServiceContext";
import { AirdropServiceContext } from "../../contexts/AirdropServiceContext";
import AirdropLogItem from "../AirdropLogItem";

type CatapultProps = {
  walletList: any;
  setAirdropState: any;
  airdropState: string;
  tokenMintAccount: string;
  goBack: any;
  updateAccountBalances: any;
  reset: any;
};

function Catapult({
  walletList,
  setAirdropState,
  airdropState,
  goBack,
  updateAccountBalances,
  reset,
}: CatapultProps) {
  const solanaService = useContext(SolanaServiceContext);
  const airdropService = useContext(AirdropServiceContext);

  const [successCount, setSuccessCount] = useState(0);
  const emptyLogArray: logObjectType[] = [];
  const [logArray, setLogArray] = useState(emptyLogArray);

  useEffect(() => {
    if (airdropState === airdropStates.NOT_READY) {
      setAirdropState(airdropStates.READY);
    }
  }, []);

  useEffect(() => {
    // creates the airdrop request
    // and the request function is passed to the airdrop service
    // along with other data
    if (walletList && walletList.length > 0) {
      const airdropAsyncRequest = async (
        recipientAddressString: string,
        amountInLamports: number
      ) => {
        try {
          const getAtaResponse =
            await solanaService.findOrCreateAssociatedTokenAccount(
              recipientAddressString
            );
          if (getAtaResponse.success) {
            const recipientAddress = new PublicKey(recipientAddressString);
            const transferResponse = await solanaService.transferTokens(
              recipientAddress,
              getAtaResponse.data,
              amountInLamports
            );
            return transferResponse;
          } else {
            return getAtaResponse;
          }
        } catch (error) {
          return { success: false, error, data: null };
        }
      };
      airdropService.prepareAirdropRequestItemsMap(
        walletList,
        airdropAsyncRequest
      );
    }
  }, [walletList]);

  const DynamicProgressBar = () => {
    if (walletList.length > 0) {
      return (
        <ProgressBar
          className="mb-3"
          animated
          variant="success"
          now={(successCount / walletList.length) * 100}
          label={`${Math.ceil((successCount / walletList.length) * 100)}%`}
        />
      );
    } else {
      return <ProgressBar animated variant="success" now={0} />;
    }
  };

  const onEveryRequest = (logs: logObjectType[]) => {
    setSuccessCount(logs.length);
    setLogArray(logs);
    updateAccountBalances();
  };

  const handleInitiateAirdrop = async () => {
    setAirdropState(airdropStates.INITIATED);
    const completeAirdropResponse = await airdropService.startBatchAirdrop(
      onEveryRequest
    );
    if (completeAirdropResponse.success) {
      setAirdropState(airdropStates.COMPLETED);
    } else {
      setAirdropState(airdropStates.FAILED);
    }
  };

  return (
    <Container className={styles.container}>
      <AirdropServiceContext.Provider value={airdropService}>
        <h3>
          <FontAwesomeIcon icon={faPlane} /> Batch Token Transfer
        </h3>
        <Row className="mt-3">
          <Col>
            <Card className="mt-2">
              <Card.Body>
                <Card.Title>Intiate Batch Token Transfer</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Progress
                </Card.Subtitle>
                <DynamicProgressBar />
                <div className="mb-3">
                  <div className="d-grid gap-2">
                    <Button
                      variant="secondary"
                      type="button"
                      disabled={airdropState !== airdropStates.READY}
                      onClick={() => goBack()}
                      className="my-1"
                    >
                      <FontAwesomeIcon icon={faArrowLeft} />
                      &nbsp; Back
                    </Button>
                  </div>
                  <div className="d-grid gap-2">
                    <Button
                      variant="primary"
                      type="button"
                      disabled={airdropState !== airdropStates.READY}
                      onClick={() => handleInitiateAirdrop()}
                      className="my-1"
                    >
                      <FontAwesomeIcon icon={faParachuteBox} />
                      &nbsp; Initiate Airdrop
                    </Button>
                  </div>
                  {airdropState === airdropStates.INITIATED && (
                    <div className="d-grid gap-2">
                      <Button
                        variant="danger"
                        type="button"
                        onClick={() => {
                          reset();
                          window.location.reload();
                        }}
                        className="my-1"
                      >
                        <FontAwesomeIcon icon={faSkull} />
                        &nbsp; Abort
                      </Button>
                    </div>
                  )}
                </div>
                {airdropState !== airdropStates.READY && (
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
                      {logArray
                        .map((item, index) => (
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
                        ))
                        .reverse()}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card className="mt-2">
              <Card.Body>
                <Card.Title>Batch Token Transfer Guide</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Before initiating the batch token transfer, please make sure
                  that the following things are true:
                </Card.Subtitle>
                <ul>
                  <li>
                    Your wallet has enough tokens to do the batch transfer
                  </li>
                  <li>Your wallet has enough SOL to fund the batch transfer</li>
                  <li>
                    You do not press refresh or close the tab until the airdrop
                    completes
                  </li>
                  <li>
                    You have enough battery (if you are on a mobile device) and
                    internet connectivity is reliable
                  </li>
                </ul>
                <Card.Subtitle className="mb-2 text-muted">FAQ</Card.Subtitle>
                <ul>
                  <li>
                    If the receipent do not have an associated token account for
                    the token you're sending, we will create one and then send
                  </li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </AirdropServiceContext.Provider>
    </Container>
  );
}

export default Catapult;
