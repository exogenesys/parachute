import { PublicKey } from "@solana/web3.js";
import React, { useContext, useState, useEffect } from "react";
import { SolanaServiceContext } from "../../contexts/SolanaServiceContext";

type AirdropRequestProps = {
  amount: number;
  address: string;
  isAirdropInitiated: boolean;
  status: string;
  uniqueId: string;
};

function AirdropRequestItem({
  amount,
  address,
  status,
  uniqueId,
}: AirdropRequestProps) {
  return (
    <tr key={uniqueId}>
      <td>{address ? address : ""}</td>
      <td>{amount ? amount : ""}</td>
      <td>{status ? status : ""}</td>
    </tr>
  );
}

export default AirdropRequestItem;
