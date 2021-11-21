import { createContext } from "react";
import { AirdropService } from "../../../services/AirdropService";
let airdropService = new AirdropService();

export const AirdropServiceContext = createContext(airdropService);
