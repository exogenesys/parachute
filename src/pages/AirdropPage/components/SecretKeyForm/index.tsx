import React, { useState, useContext } from "react";
import { Button, Container, Form, Row, Col, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faKey } from "@fortawesome/free-solid-svg-icons";
import styles from "./SecretKeyForm.module.css";
import { toast } from "react-toastify";
import { SolanaServiceContext } from "../../contexts/SolanaServiceContext";

type SecretKeyFormProps = {
  setIsSecretKeyLoaded: any;
};

function SecretKeyForm({
  setIsSecretKeyLoaded,
}: SecretKeyFormProps): JSX.Element {
  const [secretKeyString, setSecretKeyString] = useState("");

  const solanaService = useContext(SolanaServiceContext);

  const loadSecretKey = (secretKey: string) => {
    try {
      const initKeypairResponse = solanaService.setSecretKey(secretKeyString);
      if (initKeypairResponse.success) {
        toast.success("Secret key is set");
        setIsSecretKeyLoaded(true);
      } else {
        toast.error("Invalid secret key");
      }
    } catch (error) {
      toast.error("Unknow error occured");
    }
  };

  const handleSubmit = () => {
    loadSecretKey(secretKeyString);
  };

  return (
    <Container className={styles.secretKeyFormContainer}>
      <h3>
        <FontAwesomeIcon icon={faKey} /> Secret Key Form
      </h3>
      <Row>
        <Col>
          <Form>
            <Form.Group
              controlId="tokenMintFormAccountForm.input"
              className="mb-3"
            >
              <Form.Label>
                Enter the secret key which has access to the tokens you want to
                airdrop
              </Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Paste your secret key here"
                className={styles.secretKeyFormInput}
                onChange={(e) => setSecretKeyString(e.target.value)}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="button"
              onClick={() => handleSubmit()}
            >
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Notes</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                Read this before sumbitting your secret key
              </Card.Subtitle>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default SecretKeyForm;
