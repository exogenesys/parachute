import { createContext } from "react";
import SolanaService from "../../../services/SolanaService";
let solanaService = new SolanaService();

export const SolanaServiceContext = createContext(solanaService);
