import React, { useState, useEffect, useContext } from "react";
import { Col, Row } from "react-bootstrap";
import styles from "./Airdrop.module.css";
import Message from "./components/Message";
import TokenMintAccount from "./components/TokenMintAccountForm";
import StatusBar from "./components/StatusBar";
import WalletListLoader from "./components/WalletListLoader";
import Catapult from "./components/Catapult";
import SecretKeyForm from "./components/SecretKeyForm";
import { airdropStates } from "../../utils/general";
import SolanaService from "../../services/SolanaService";
import { toast } from "react-toastify";
import { fetchStates } from "../../utils/general";
import { SolanaServiceContext } from "./contexts/SolanaServiceContext";
import Report from "./components/Report";

const solanaService = new SolanaService();

function Airdrop() {
  const [isSecretKeyLoaded, setIsSecretKeyLoaded] = useState(false);

  const [tokenMintAccount, setTokenMintAccount] = useState("");
  const [isTokenMintAccountSet, setIsTokenMintAccountSet] = useState(false);

  const [walletList, setWalletList] = useState(null);
  const [isWalletListSubmitted, setIsWalletListSubmitted] = useState(false);
  const [isWalletListUploaded, setIsWalletListUploaded] = useState(false);
  const [isWalletListValidated, setIsWalletListValidated] = useState(false);
  const [airdropState, setAirdropState] = useState(airdropStates.NOT_READY);
  const [updateCount, setUpdateCount] = useState(0);

  const resetState = () => {
    setIsTokenMintAccountSet(false);
    setTokenMintAccount("");

    setIsSecretKeyLoaded(false);

    setWalletList(null);
    setIsWalletListSubmitted(false);
    setIsWalletListUploaded(false);
    setIsWalletListValidated(false);

    setUpdateCount(0);

    setAirdropState(airdropStates.NOT_READY);
  };

  const goBackFromTokenMintAccountForm = () => {
    setIsSecretKeyLoaded(false);
  };

  const goBackFromWalletListLoader = () => {
    setIsTokenMintAccountSet(false);
    setIsWalletListUploaded(false);
    setIsWalletListValidated(false);
  };

  const goBackFromCatapult = () => {
    setIsWalletListSubmitted(false);
    setIsWalletListUploaded(false);
    setIsWalletListValidated(false);
    setAirdropState(airdropStates.NOT_READY);
  };

  const updateAccountBalances = () => {
    setUpdateCount(updateCount + 1);
  };

  let AirDropView = null;

  if (isSecretKeyLoaded) {
    if (isTokenMintAccountSet) {
      if (
        isWalletListUploaded &&
        isWalletListValidated &&
        isWalletListSubmitted
      ) {
        if (
          airdropState === airdropStates.COMPLETED ||
          airdropState === airdropStates.FAILED
        ) {
          AirDropView = <Report reset={resetState} />;
        } else {
          AirDropView = (
            <Catapult
              walletList={walletList}
              setAirdropState={setAirdropState}
              airdropState={airdropState}
              tokenMintAccount={tokenMintAccount}
              goBack={goBackFromCatapult}
              updateAccountBalances={updateAccountBalances}
            />
          );
        }
      } else {
        AirDropView = (
          <WalletListLoader
            setWalletList={setWalletList}
            setIsWalletListSubmitted={setIsWalletListSubmitted}
            setIsWalletListUploaded={setIsWalletListUploaded}
            setIsWalletListValidated={setIsWalletListValidated}
            isWalletListValidated={isWalletListValidated}
            isWalletListUploaded={isWalletListUploaded}
            goBack={goBackFromWalletListLoader}
          />
        );
      }
    } else {
      AirDropView = (
        <TokenMintAccount
          setTokenMintAccount={setTokenMintAccount}
          setIsTokenMintAccountSet={setIsTokenMintAccountSet}
          goBack={goBackFromTokenMintAccountForm}
        />
      );
    }
  } else {
    AirDropView = <SecretKeyForm setIsSecretKeyLoaded={setIsSecretKeyLoaded} />;
  }

  return (
    <div className={styles.airdropContainer}>
      <SolanaServiceContext.Provider value={solanaService}>
        <Row>
          <Col sm={3}>
            <StatusBar
              isSecretKeyLoaded={isSecretKeyLoaded}
              isTokenMintAccountSet={isTokenMintAccountSet}
              tokenMintAccountAddress={tokenMintAccount}
              isWalletListSubmitted={isWalletListSubmitted}
              isWalletListUploaded={isWalletListUploaded}
              isWalletListValidated={isWalletListValidated}
              airdropState={airdropState}
              updateCount={updateCount}
            />
          </Col>
          <Col sm={9}>{AirDropView}</Col>
        </Row>
      </SolanaServiceContext.Provider>
    </div>
  );
}

export default Airdrop;
