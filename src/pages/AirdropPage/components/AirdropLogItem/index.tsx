import { PublicKey } from "@solana/web3.js";
import React, { useContext, useState, useEffect } from "react";
import { SolanaServiceContext } from "../../contexts/SolanaServiceContext";
import { logObjectType } from "../../../../services/AirdropService";

interface AirdropLogItemProps extends logObjectType {
  index: number;
}

function AirdropLogItem({
  index,
  success,
  transactionId,
  message,
  uniqueId,
  walletAddress,
  amount,
  timestamp,
}: AirdropLogItemProps) {
  return (
    <tr key={uniqueId}>
      <td>{index}</td>
      <td>{uniqueId}</td>
      <td>{timestamp}</td>
      <td>{success ? "Success" : "Failed"}</td>
      <td>{transactionId ? transactionId : "-"}</td>
      <td>{message}</td>
      <td>{walletAddress}</td>
      <td>{amount}</td>
    </tr>
  );
}

export default AirdropLogItem;
