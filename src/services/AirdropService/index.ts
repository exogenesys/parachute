import { v1 as uuidv1 } from "uuid";
import { eachOfLimit } from "async-es";

type WalletAndAmountObjectType = {
  address: string;
  amount: number;
};

type AirdropRequestItemsMapType = {
  [key: string]: AirdropRequestItemType;
};

type AirdropRequestItemType = {
  uniqueId: string;
  amount: number;
  address: string;
  status: string;
  airdropAsyncRequest: any;
};

const AirdropRequestItemState = {
  READY: "READY",
  FINDING_ATA: "FINDING_ATA",
  TRANSFERING_TOKENS: "TRANSFERING_TOKENS",
  QUEUED: "QUEUED",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
};

export type logObjectType = {
  success: boolean;
  transactionId: string | null;
  message: string;
  uniqueId: string;
  walletAddress: string;
  amount: number;
  timestamp: string;
};

export class AirdropService {
  _walletAndAmountArray: null | WalletAndAmountObjectType[];
  _airdropRequestItemsMap: null | AirdropRequestItemsMapType;
  _requestsAtATime: number;
  public logs: logObjectType[];
  constructor() {
    this._walletAndAmountArray = null;
    this._airdropRequestItemsMap = null;
    this._requestsAtATime = 5;
    this.logs = [];
  }

  prepareAirdropRequestItemsMap = (
    walletAndAmountArray: WalletAndAmountObjectType[],
    airdropAsyncRequest: any
  ) => {
    try {
      if (walletAndAmountArray.length > 0) {
        this._walletAndAmountArray = walletAndAmountArray;
        let airdropRequestItemsMap: AirdropRequestItemsMapType = {};
        this._walletAndAmountArray.forEach(
          (walletAndAmount: WalletAndAmountObjectType) => {
            const uniqueId = uuidv1();
            airdropRequestItemsMap[uniqueId] = {
              uniqueId: uniqueId,
              amount: walletAndAmount.amount,
              address: walletAndAmount.address,
              status: AirdropRequestItemState.READY,
              airdropAsyncRequest: async () =>
                airdropAsyncRequest(
                  walletAndAmount.address,
                  walletAndAmount.amount
                ),
            };
          }
        );
        this._airdropRequestItemsMap = airdropRequestItemsMap;
        return {
          success: true,
          data: this._airdropRequestItemsMap,
          error: null,
        };
      }
      throw new Error("Not implemented");
    } catch (error) {
      return { success: false, error, data: null };
    }
  };

  getAirdropRequestItemsArray = () => {
    try {
      if (this._airdropRequestItemsMap) {
        const requestItemArray = Object.values(this._airdropRequestItemsMap);
        if (requestItemArray && requestItemArray.length) {
          return { success: true, error: null, data: requestItemArray };
        }
        throw new Error("Not implemented");
      }
      throw new Error("Not implemented");
    } catch (error) {
      return { success: false, error, data: [] };
    }
  };

  startBatchAirdrop = async (onEveryRequest: any) => {
    try {
      const iteratee = async (
        airdropRequestItem: AirdropRequestItemType,
        uniqueId: string,
        callback: any
      ) => {
        const response = await airdropRequestItem.airdropAsyncRequest();
        let logObject: logObjectType;
        if (response.success) {
          logObject = {
            success: true,
            transactionId: response.data,
            message: "Airdrop successful",
            uniqueId: uniqueId,
            walletAddress: airdropRequestItem.address,
            amount: airdropRequestItem.amount,
            timestamp: new Date().toISOString(),
          };
        } else {
          logObject = {
            success: false,
            transactionId: null,
            message: `Airdrop failed: ${response.error}`,
            uniqueId: uniqueId,
            walletAddress: airdropRequestItem.address,
            amount: airdropRequestItem.amount,
            timestamp: new Date().toISOString(),
          };
        }
        this.logs.push(logObject);
        onEveryRequest(this.logs);
      };
      if (this._airdropRequestItemsMap) {
        await eachOfLimit(
          this._airdropRequestItemsMap,
          this._requestsAtATime,
          iteratee
        );
        return {
          success: true,
          error: null,
          data: this.logs,
        };
      }
      throw new Error("Not prepared");
    } catch (error) {
      return { success: false, error, data: null };
    }
  };

  reset = () => {
    this._walletAndAmountArray = null;
    this._airdropRequestItemsMap = null;
  };
}
