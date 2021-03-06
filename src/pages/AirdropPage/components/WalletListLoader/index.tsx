import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Container,
  Form,
  Button,
  Card,
  Table,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faFileCsv,
  faSave,
  faTasks,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./WalletListLoader.module.css";
import { CSVReader } from "../../../../deps";
import { toast } from "react-toastify";
import FileTable from "../FileTable";

type WalletListLoaderProps = {
  setWalletList: any;
  setIsWalletListUploaded: any;
  setIsWalletListSubmitted: any;
  setIsWalletListValidated: any;
  isWalletListValidated: boolean;
  isWalletListUploaded: boolean;
  goBack: any;
};

function WalletListLoader({
  setWalletList,
  setIsWalletListUploaded,
  setIsWalletListSubmitted,
  setIsWalletListValidated,
  isWalletListValidated,
  isWalletListUploaded,
  goBack,
}: WalletListLoaderProps) {
  const [fileData, setFileData] = useState([]);
  const [fileInfo, setFileInfo] = useState({});

  const isFileEmpty = () => {
    if (fileInfo === {} || fileData == [] || fileData.length === 0) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    setIsWalletListValidated(false);
  }, [fileData]);

  const handleFileLoaded = (data: any, fileInfo: any) => {
    setFileData(data);
    setFileInfo(fileInfo);
    setIsWalletListUploaded(true);
  };

  const handleValidate = () => {
    if (isWalletListUploaded && !isFileEmpty()) {
      setIsWalletListValidated(true);
      toast.success("Wallet list validated.");
    } else {
      toast.error("Please upload a CSV file before validating");
    }
  };

  const handleSubmit = () => {
    if (isWalletListValidated) {
      setWalletList(fileData);
      setIsWalletListSubmitted(true);
      toast.success("Wallet list saved.");
    } else {
      toast.error("Please validate the wallet list before submitting.");
    }
  };

  const parserOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: (header: string) =>
      header.toLowerCase().replace(/\W/g, "_"),
  };

  return (
    <Container className={styles.container}>
      <h3>
        <FontAwesomeIcon icon={faFileCsv} /> Upload CSV File With Recipient's
        Wallet Addresses
      </h3>
      <Row>
        <Col>
          <Card className="mt-2">
            <Card.Body>
              <Form>
                <Form.Group controlId="walletListFile.input" className="mb-3">
                  <Form.Label>CSV File with Wallet Addresses</Form.Label>
                  <CSVReader
                    cssClass="react-csv-input"
                    onFileLoaded={handleFileLoaded}
                    parserOptions={parserOptions}
                  />
                </Form.Group>
                {isWalletListUploaded && isWalletListValidated ? (
                  <div className="p-5 text-center">
                    <Row className="">
                      <Col>Number Of Addresses</Col>
                      <Col>Number Of Total Tokens</Col>
                    </Row>
                    <Row className="display-6">
                      <Col>{fileData.length}</Col>
                      <Col>
                        {fileData.reduce(
                          (sum, row) => sum + parseInt(row.amount),
                          0
                        )}
                      </Col>
                    </Row>
                  </div>
                ) : null}
                {isWalletListUploaded && isWalletListValidated ? (
                  <Button
                    variant="primary"
                    type="button"
                    onClick={() => handleSubmit()}
                    className="mx-1"
                  >
                    <FontAwesomeIcon icon={faSave} />
                    &nbsp; Submit
                  </Button>
                ) : null}
                {isWalletListUploaded && !isWalletListValidated ? (
                  <Button
                    variant="warning"
                    onClick={() => handleValidate()}
                    className="mx-1"
                  >
                    <FontAwesomeIcon icon={faTasks} />
                    &nbsp; Validate
                  </Button>
                ) : null}
                <Button
                  variant="secondary"
                  onClick={() => goBack()}
                  className="mx-1"
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                  &nbsp; Back
                </Button>
                {fileData.length > 0 ? (
                  <Row className="mt-3">
                    <Col>
                      <FileTable data={fileData} />
                    </Col>
                  </Row>
                ) : null}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>CSV File Upload Instruction</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                CSV File should be formatted in this exact way
              </Card.Subtitle>
              <ul>
                <li>
                  File should have two columns:
                  <ul>
                    <li>address</li>
                    <li>amount</li>
                  </ul>
                </li>
                <li>
                  The amount should be mentioned without any decimals. So, if
                  you want to airdrop 2 tokens and decimals per token is 9, the
                  amount should be 2000000000
                </li>
                <li>The delimiter should be comma (,)</li>
                <li>Please check the example CSV file before submitting</li>
              </ul>
              <Card.Link
                target="_blank"
                href="https://github.com/exogenesys/parachute/blob/main/addresses/address_5000.csv"
              >
                Example CSV File
              </Card.Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default WalletListLoader;
