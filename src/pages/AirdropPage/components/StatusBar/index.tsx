import React, { useEffect, useContext, useState } from "react";
import { Button, Container, Form, Row, Col, Badge, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
  faSync,
  faSpinner,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./StatusBar.module.css";
import { toast } from "react-toastify";
import {
  airdropStates,
  fetchStates,
  shortenPublicKey,
} from "../../../../utils/general";
import { SolanaServiceContext } from "../../contexts/SolanaServiceContext";

type StatusBarProps = {
  isSecretKeyLoaded: boolean;
  isTokenMintAccountSet: boolean;
  tokenMintAccountAddress: string;
  isWalletListSubmitted: boolean;
  isWalletListUploaded: boolean;
  isWalletListValidated: boolean;
  airdropState: string;
  updateCount: number;
};

function StatusBar({
  isSecretKeyLoaded,
  isTokenMintAccountSet,
  tokenMintAccountAddress,
  isWalletListSubmitted,
  isWalletListUploaded,
  isWalletListValidated,
  airdropState,
  updateCount,
}: StatusBarProps) {
  const solanaService = useContext(SolanaServiceContext);

  const [walletBalance, setWalletBalance] = useState(0);
  const [updateWalletBalanceStatus, setUpdateWalletBalanceStatus] = useState(
    fetchStates.READY
  );

  const updateWalletBalance = async () => {
    setUpdateWalletBalanceStatus(fetchStates.FETCHING);
    const balance = await solanaService.getBalance();
    if (balance.success) {
      setWalletBalance(balance.data);
      setUpdateWalletBalanceStatus(fetchStates.FETCHED);
    } else {
      setUpdateWalletBalanceStatus(fetchStates.FAILED);
      setWalletBalance(0);
    }
  };

  const [tokenBalance, setTokenBalance] = useState(0);
  const [updateTokenBalanceStatus, setUpdateTokenBalanceStatus] = useState(
    fetchStates.READY
  );
  const [updateTokenBalancePollCount, setUpdateTokenBalancePollCount] =
    useState(0);

  const updateTokenBalance = async () => {
    setUpdateTokenBalanceStatus(fetchStates.FETCHING);
    const tokenBalance = await solanaService.getTokenAccountBalance();
    if (tokenBalance.success) {
      setTokenBalance(tokenBalance.data);
      setUpdateTokenBalanceStatus(fetchStates.FETCHED);
    } else {
      setUpdateTokenBalancePollCount(updateTokenBalancePollCount + 1);
      setUpdateTokenBalanceStatus(fetchStates.FAILED);
      setTokenBalance(0);
    }
  };

  useEffect(() => {
    updateTokenBalance();
    updateWalletBalance();
  }, [updateCount]);

  useEffect(() => {
    if (
      updateTokenBalanceStatus === fetchStates.FAILED &&
      updateTokenBalancePollCount < 5
    ) {
      updateTokenBalance();
    }
  }, [updateTokenBalancePollCount]);

  useEffect(() => {
    if (isSecretKeyLoaded) {
      updateWalletBalance();
    }
  }, [isSecretKeyLoaded]);

  useEffect(() => {
    if (isTokenMintAccountSet) {
      updateTokenBalance();
    }
  }, [isTokenMintAccountSet]);

  const StatusLabel = (
    isSuccess: boolean,
    label: string,
    successLabel: string,
    failureLabel: string
  ) => {
    if (isSuccess) {
      return (
        <Badge className="p-2 w-100 text-start" bg="success">
          {label}
          <span className={styles.rightBadgeLabel}>
            <FontAwesomeIcon icon={faCheckCircle} /> {successLabel}
          </span>
        </Badge>
      );
    } else {
      return (
        <Badge className="p-2 w-100 text-start" bg="secondary">
          {label}
          <span className={styles.rightBadgeLabel}>
            <FontAwesomeIcon icon={faTimesCircle} /> {failureLabel}
          </span>
        </Badge>
      );
    }
  };

  const TokenMintAccountLabel = () =>
    StatusLabel(
      isTokenMintAccountSet,
      "Token Mint Account",
      shortenPublicKey(tokenMintAccountAddress),
      "Not Set"
    );
  const WalletListUploadedLabel = () =>
    StatusLabel(
      isWalletListUploaded,
      "Recepients Wallet List",
      "Uploaded",
      "Not Uploaded"
    );
  const WalletListValidatedLabel = () =>
    StatusLabel(
      isWalletListValidated,
      "Recepients Wallet List",
      "Validated",
      "Not Validated"
    );
  const WalletListSubmittedLabel = () =>
    StatusLabel(
      isWalletListSubmitted,
      "Recepients Wallet List",
      "Submitted",
      "Not Submitted"
    );
  const SecretKeyLoadedLabel = () =>
    StatusLabel(isSecretKeyLoaded, "Secret Key", "Set", "Not Set");

  const AccountBalanceLabel = () => {
    let balanceLabel = "";
    if (updateWalletBalanceStatus === fetchStates.FAILED) {
      balanceLabel = "Failed to fetch token balance";
    } else if (updateWalletBalanceStatus === fetchStates.FETCHING) {
      balanceLabel = "Fetching token balance...";
    } else if (updateWalletBalanceStatus === fetchStates.READY) {
      balanceLabel = "-";
    } else if (updateWalletBalanceStatus === fetchStates.FETCHED) {
      balanceLabel = `${walletBalance} SOL`;
    }

    return StatusLabel(isSecretKeyLoaded, "Account Balance", balanceLabel, "-");
  };

  const TokenBalanceLabel = () => {
    let balanceLabel = "";
    if (updateTokenBalanceStatus === fetchStates.FAILED) {
      balanceLabel = "Failed to fetch balance";
    } else if (updateTokenBalanceStatus === fetchStates.FETCHING) {
      balanceLabel = "Fetching balance...";
    } else if (updateTokenBalanceStatus === fetchStates.READY) {
      balanceLabel = "-";
    } else if (updateTokenBalanceStatus === fetchStates.FETCHED) {
      balanceLabel = `${tokenBalance} Tokens`;
    }

    return StatusLabel(
      isTokenMintAccountSet,
      "Token Balance",
      balanceLabel,
      "-"
    );
  };

  const GenericLabel = (
    leftLabel: string,
    rightLabel: string,
    bg: string,
    icon: IconDefinition,
    spin: boolean
  ) => {
    return (
      <Badge className="p-2 w-100 text-start" bg={bg}>
        {leftLabel}
        <span className={styles.rightBadgeLabel}>
          <FontAwesomeIcon icon={icon} spin={spin} /> {rightLabel}
        </span>
      </Badge>
    );
  };

  const AirdropStateLabel = () => {
    switch (airdropState) {
      case airdropStates.NOT_READY:
        return GenericLabel(
          "Airdrop Status",
          "Preparing Assests",
          "secondary",
          faTimesCircle,
          false
        );
      case airdropStates.READY:
        return GenericLabel(
          "Airdrop Status",
          "Ready",
          "primary",
          faCheckCircle,
          false
        );
      case airdropStates.INITIATED:
        return GenericLabel(
          "Airdrop Status",
          "In Process",
          "warning",
          faSpinner,
          true
        );
      case airdropStates.FAILED:
        return GenericLabel(
          "Airdrop Status",
          "Failed",
          "danger",
          faTimesCircle,
          false
        );
      case airdropStates.COMPLETED:
        return GenericLabel(
          "Airdrop Status",
          "Successful",
          "success",
          faTimesCircle,
          false
        );
      default:
        return GenericLabel(
          "Airdrop Status",
          "Unknown",
          "secondary",
          faTimesCircle,
          false
        );
    }
  };

  return (
    <div>
      <Container className={`${styles.statusBarContainer}`}>
        <h3>Steps:</h3>
        <Nav className="flex-column">
          <Nav.Item className="mb-2">{SecretKeyLoadedLabel()}</Nav.Item>
          <Nav.Item className="mb-2">{TokenMintAccountLabel()}</Nav.Item>
          <Nav.Item className="mb-2">{WalletListUploadedLabel()}</Nav.Item>
          <Nav.Item className="mb-2">{WalletListValidatedLabel()}</Nav.Item>
          <Nav.Item className="mb-2">{WalletListSubmittedLabel()}</Nav.Item>
          <Nav.Item className="mb-2">{AirdropStateLabel()}</Nav.Item>
        </Nav>
      </Container>
      <Container className={`${styles.statusBarContainer}`}>
        <h3>Account Info:</h3>
        <Nav className="flex-column">
          <Nav.Item className="mb-2">{AccountBalanceLabel()}</Nav.Item>
          <Nav.Item className="mb-2">{TokenBalanceLabel()}</Nav.Item>
        </Nav>
      </Container>
    </div>
  );
}

export default StatusBar;
