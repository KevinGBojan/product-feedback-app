import { createContext } from "react";
import { User } from "firebase/auth";

interface AppContextInterface {
  user: User | undefined | null;
  username: string | null;
}

export const UserContext = createContext<AppContextInterface>({
  user: null,
  username: null,
});
