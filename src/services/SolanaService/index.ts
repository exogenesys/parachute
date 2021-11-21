import { Connection } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import { Keypair } from "@solana/web3.js";
import { clusterApiUrl } from "@solana/web3.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { TransactionInstruction } from "@solana/web3.js";
import { Transaction } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Token } from "@solana/spl-token";
import ERRORS from "./errors";

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: PublicKey = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

export const getEndpoint = () => {
  return clusterApiUrl("devnet");
};

export interface SolanaServiceResponse {
  success: boolean;
  data: any;
  error: any;
}

class SolanaService {
  private _keypair: Keypair | null;
  _publicKey: PublicKey | null;
  _mintTokenAccount: PublicKey | null;
  _associatedTokenAccount: PublicKey | null;
  constructor() {
    this._keypair = null;
    this._publicKey = null;
    this._mintTokenAccount = null;
    this._associatedTokenAccount = null;
  }

  _init(keypair: Keypair) {
    this._keypair = keypair;
    this._publicKey = keypair.publicKey;
  }

  _getConnection() {
    const con = new Connection(getEndpoint(), "confirmed");
    return con;
  }

  async _findAssociatedTokenAccount(
    walletAddress: PublicKey,
    tokenMintAddress: PublicKey
  ): Promise<SolanaServiceResponse> {
    try {
      if (walletAddress && tokenMintAddress) {
        const associatedTokenAccount = await PublicKey.findProgramAddress(
          [
            walletAddress.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            tokenMintAddress.toBuffer(),
          ],
          SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
        );

        const associatedTokenAddress = associatedTokenAccount[0];

        if (associatedTokenAddress) {
          const associatedAccountInfo = await this._getAccountInfo(
            associatedTokenAddress
          );

          if (associatedAccountInfo.success && associatedAccountInfo.data) {
            return { success: true, error: null, data: associatedTokenAddress };
          } else {
            return {
              success: false,
              error: ERRORS.ASSOCIATED_TOKEN_ACCOUNT_NOT_FOUND,
              data: associatedTokenAddress,
            };
          }
        }
      }
      throw new Error(ERRORS.INVALID_PARAMETERS);
    } catch (error) {
      return { success: false, error, data: 0 };
    }
  }

  async _getAccountInfo(
    accountAddress: PublicKey
  ): Promise<SolanaServiceResponse> {
    try {
      if (accountAddress) {
        const connection = this._getConnection();
        let walletInfo = await connection.getAccountInfo(accountAddress);
        return { success: true, data: walletInfo, error: null };
      }
      throw new Error(ERRORS.INVALID_PARAMETERS);
    } catch (error) {
      return { success: false, error, data: null };
    }
  }

  async _createAssociatedTokenAccount(
    associatedTokenAddress: PublicKey,
    recipientAddress: PublicKey
  ) {
    try {
      if (this._publicKey && this._keypair) {
        if (this._mintTokenAccount) {
          const transaction = new Transaction({ feePayer: this._publicKey });
          transaction.add(
            Token.createAssociatedTokenAccountInstruction(
              SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
              TOKEN_PROGRAM_ID,
              this._mintTokenAccount,
              associatedTokenAddress,
              recipientAddress,
              this._publicKey
            )
          );
          const connection = this._getConnection();
          const result = await connection.sendTransaction(transaction, [
            this._keypair,
          ]);
          return { success: true, data: result, error: null };
        }
        throw new Error(ERRORS.MINT_TOKEN_ACCOUNT_NOT_SET);
      }
      throw new Error(ERRORS.SECRET_KEY_NOT_SET);
    } catch (error) {
      return { success: false, error, data: 0 };
    }
  }

  async initTokenMint(
    tokenMintAddress: string
  ): Promise<SolanaServiceResponse> {
    try {
      if (this._publicKey) {
        const tokenMintAccount = new PublicKey(tokenMintAddress);
        const { data, error, success } = await this._findAssociatedTokenAccount(
          this._publicKey,
          tokenMintAccount
        );
        if (success) {
          this._mintTokenAccount = tokenMintAccount;
          this._associatedTokenAccount = data;
          return {
            success: true,
            data: null,
            error: null,
          };
        }
        throw new Error(error);
      }
      throw new Error(ERRORS.SECRET_KEY_NOT_SET);
    } catch (error) {
      return { success: false, error, data: 0 };
    }
  }

  async getTokenAccountBalance(): Promise<SolanaServiceResponse> {
    try {
      if (this._publicKey) {
        if (this._associatedTokenAccount) {
          const connection = this._getConnection();
          const balance = await connection.getTokenAccountBalance(
            this._associatedTokenAccount
          );
          return {
            success: true,
            data: balance.value.uiAmount,
            error: null,
          };
        }
        throw new Error(ERRORS.ASSOCIATED_TOKEN_ACCOUNT_NOT_SET);
      }
      throw new Error(ERRORS.SECRET_KEY_NOT_SET);
    } catch (error) {
      return { success: false, error, data: 0 };
    }
  }

  async getBalance(): Promise<SolanaServiceResponse> {
    try {
      if (this._publicKey) {
        const connection = this._getConnection();
        const balance = await connection.getBalance(this._publicKey);
        return {
          success: true,
          data: balance ? balance / LAMPORTS_PER_SOL : 0,
          error: null,
        };
      }
      throw new Error(ERRORS.SECRET_KEY_NOT_SET);
    } catch (error) {
      return { success: false, error, data: 0 };
    }
  }

  setSecretKey(secretKeyString: string): SolanaServiceResponse {
    try {
      const arr = JSON.parse(secretKeyString.trim());
      const secret = new Uint8Array(arr);
      const keypair = Keypair.fromSecretKey(secret);
      this._init(keypair);
      return { error: null, success: true, data: null };
    } catch (error) {
      if (error == SyntaxError) {
        return { error: "Invalid secret key", success: false, data: null };
      } else {
        return { error, success: false, data: null };
      }
    }
  }

  async findOrCreateAssociatedTokenAccount(
    walletAddressString: string
  ): Promise<SolanaServiceResponse> {
    try {
      if (this._publicKey && this._keypair) {
        if (this._associatedTokenAccount) {
          if (this._mintTokenAccount) {
            const walletAddress = new PublicKey(walletAddressString);
            const connection = this._getConnection();
            const token = new Token(
              connection,
              this._mintTokenAccount,
              TOKEN_PROGRAM_ID,
              this._keypair
            );

            const associatedTokenAddress =
              await token.getOrCreateAssociatedAccountInfo(walletAddress);
            return {
              success: true,
              data: associatedTokenAddress.address,
              error: null,
            };
          }
          throw new Error(ERRORS.MINT_TOKEN_ACCOUNT_NOT_SET);
        }
        throw new Error(ERRORS.ASSOCIATED_TOKEN_ACCOUNT_NOT_SET);
      }
      throw new Error(ERRORS.SECRET_KEY_NOT_SET);
    } catch (error) {
      return { success: false, error, data: 0 };
    }
  }

  async transferTokens(
    recipientAddress: PublicKey,
    recipientAssociatedTokenAddress: PublicKey,
    amount: number
  ): Promise<SolanaServiceResponse> {
    try {
      if (this._publicKey && this._keypair) {
        if (this._associatedTokenAccount) {
          if (this._mintTokenAccount) {
            const token = new Token(
              this._getConnection(),
              this._mintTokenAccount,
              TOKEN_PROGRAM_ID,
              this._keypair
            );

            const response = await token.transfer(
              this._associatedTokenAccount,
              recipientAssociatedTokenAddress,
              this._publicKey,
              [],
              amount
            );

            return {
              success: true,
              data: response,
              error: null,
            };
          }
          throw new Error(ERRORS.MINT_TOKEN_ACCOUNT_NOT_SET);
        }
        throw new Error(ERRORS.ASSOCIATED_TOKEN_ACCOUNT_NOT_SET);
      }
      throw new Error(ERRORS.SECRET_KEY_NOT_SET);
    } catch (error) {
      return { success: false, error, data: 0 };
    }
  }

  reset(): void {
    this._publicKey = null;
    this._keypair = null;
    this._mintTokenAccount = null;
    this._associatedTokenAccount = null;
  }
}

export default SolanaService;
