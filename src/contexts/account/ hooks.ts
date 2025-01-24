import { useContext } from "react";
import { AccountContext, Context } from "./context";

const useAccount = (): AccountContext => useContext(Context);

export { useAccount };