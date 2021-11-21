import React, { useContext, useState } from "react";
import {
  Button,
  Container,
  Form,
  Row,
  Col,
  ButtonGroup,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faCoins,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./TokenMintAccountForm.module.css";
import { toast } from "react-toastify";
import { SolanaServiceContext } from "../../contexts/SolanaServiceContext";

type TokenMintAccountFormProps = {
  setTokenMintAccount: any;
  setIsTokenMintAccountSet: any;
  goBack: any;
};

function TokenMintAccountForm({
  setTokenMintAccount,
  setIsTokenMintAccountSet,
  goBack,
}: TokenMintAccountFormProps): JSX.Element {
  const [tokenMintAccountString, setTokenMintAccountString] = useState("");

  const solanaService = useContext(SolanaServiceContext);

  const handleSubmit = async () => {
    if (tokenMintAccountString && tokenMintAccountString.length > 0) {
      setTokenMintAccount(tokenMintAccountString);
      const initTokenMintResponse = await solanaService.initTokenMint(
        tokenMintAccountString
      );
      if (initTokenMintResponse.success) {
        setIsTokenMintAccountSet(true);
        toast.success("Token mint account address saved.");
      } else {
        toast.error(
          "Sorry, you dont have an associated account for this token. Please, mint some coins and try again."
        );
      }
    } else {
      toast.error("Token mint account address field is empty.");
    }
  };

  return (
    <Container className={styles.tokenMintAccountContainer}>
      <h3>
        <FontAwesomeIcon icon={faCoins} /> Token Mint Account Form
      </h3>
      <Form>
        <Row>
          <Col>
            <Form.Group
              controlId="tokenMintFormAccountForm.input"
              className="mb-3"
            >
              <Form.Label>Enter the token mint account address</Form.Label>
              <Form.Control
                size="lg"
                type="text"
                onChange={(e) => setTokenMintAccountString(e.target.value)}
                className={styles.inputControl}
              />
            </Form.Group>
            <Button
              variant="secondary"
              onClick={() => goBack()}
              className="mx-1"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              &nbsp; Back
            </Button>
            <Button
              variant="primary"
              type="button"
              onClick={() => handleSubmit()}
              className="mx-1"
            >
              <FontAwesomeIcon icon={faArrowRight} />
              &nbsp; Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default TokenMintAccountForm;
