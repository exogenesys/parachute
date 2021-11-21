import { PublicKey } from "@solana/web3.js";
import { toast } from "react-toastify";

export const airdropStates = {
  NOT_READY: "NOT_READY",
  READY: "READY",
  INITIATED: "INITIATED",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
};

export const fetchStates = {
  READY: "READY",
  FETCHING: "FETCHING",
  FETCHED: "FETCHED",
  FAILED: "FAILED",
};

export function shortenPublicKey(publicKey: string) {
  if (publicKey.length >= 8) {
    return `${publicKey.substring(0, 3)}...${publicKey.substr(
      publicKey.length - 3
    )}`;
  }
  return publicKey;
}

export function onConnect() {
  toast.success("Wallet successfully connected!");
}
export function onDisconnect() {
  toast.info("Wallet disconnected!");
}
export function onError() {
  toast.error("Some error occured!");
}
export function onWalletKitError() {
  toast.error("Some error occured!");
}

export const convertPublicKey = (key: string) => {
  return new PublicKey(key);
};
