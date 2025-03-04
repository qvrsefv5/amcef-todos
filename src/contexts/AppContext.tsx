import useLogger from "@/hooks/useLogger";
import React from "react";
import { get, has, isEmpty, set } from "lodash";
import { navigate } from "wouter/use-location";
import routes from "@/app/routes";
import { useApi } from "@/app/api";
import { useToast } from "@/components/ui/use-toast";

export interface AppContextProps {
  children: React.ReactNode | React.ReactNode[];
}

export interface AppContextActions {
  setState: (path: string, value: unknown) => void;
  getState: (path: string, value: unknown) => unknown;
  login: (values: Record<string, unknown>) => void;
  logout: () => void;
}

export interface AppContextStore {
  isLoggedIn: boolean;
  authToken: string | null;
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
    status: boolean;
    //initials: string;
    //displayName: string;
    //pharmacyID: string;
  } | null;
}

export interface AppContextOptions {}

export interface AppContextProviderProps {
  store: AppContextStore;
  actions: AppContextActions;
}

const initialStore: AppContextStore = {
  isLoggedIn: false,
  authToken: null,
  user: null,
};

const AppContext = React.createContext<AppContextProviderProps>({
  store: initialStore,
  actions: {
    setState: () => void 0,
    getState: () => null,
    login: () => void 0,
    logout: () => void 0,
  },
});

export const AppContextProvider: React.FC<AppContextProps> = ({ children }) => {
  // TODO: Replace with useReducer method
  const [store, updateStore] = React.useState<AppContextStore>({
    ...initialStore,
  });
  const logger = useLogger({ module: "AppContext" });
  const api = useApi();
  const { toast } = useToast();

  /**
   * Set state
   *
   * @param string path
   * @param mixed value
   *
   * @returns void
   */
  const setState = (path: string, value: unknown) => {
    try {
      if (!has(initialStore, path))
        throw Error(`"${path}" is not a valid state.`);

      updateStore((prevState: AppContextStore) => {
        const newState = { ...prevState };
        const previousValue = get(prevState, path);
        const newValue =
          value instanceof Function ? value(previousValue) : value;

        logger.debug(`Setting state "${path}" to "${newValue}"`);

        set(newState, path, newValue);
        return newState;
      });
    } catch (e: unknown) {
      logger.error(e as string);
    }
  };

  // Load data from LS
  React.useEffect(() => {
    //let authToken = localStorage.getItem('authToken');
    let userData = localStorage.getItem("userData");

    //if (!authToken) {
    //	authToken = sessionStorage.getItem('authToken');
    //}

    if (!userData) {
      userData = sessionStorage.getItem("userData");
    }

    //if (authToken) {
    if (userData) {
      //setState('authToken', authToken);
      setState("isLoggedIn", true);
    }

    if (userData) {
      try {
        userData = JSON.parse(userData);
        console.log({ userData });

        setState("user", userData);
      } catch (e) {
        console.error("Unable to retrieve user data");
      }
    }
  }, []);

  const getState = React.useCallback(
    (path: string, defaultValue: unknown) => get(store, path, defaultValue),
    [store]
  );

  const login = async (values: Record<string, unknown>) => {
    const { username, password, remember } = values;
    const response = await api.login({
      data: { username, password },
    });

    if (response.status !== 200 || isEmpty(response.data)) {
      console.error(response);
      return;
    }

    // TODO: Connect and retrieve data from API
    const storage = remember ? localStorage : sessionStorage;

    // Update storage
    storage.setItem("userData", JSON.stringify(response.data));

    // Update store
    actions.setState("isLoggedIn", true);
    actions.setState("user", response.data);

    toast({
      description: "Boli ste prihlásený",
    });

    // Navigate to packages page
    navigate(routes.packagesIndex.path ?? "/");
  };

  const logout = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("userData");

    await api.logout();

    setState("isLoggedIn", false);
    setState("authToken", null);
    setState("user", null);

    toast({
      description: "Boli ste odhlásený",
    });

    navigate(routes.index.path ?? "/");
  };

  const actions: AppContextActions = { setState, getState, login, logout };

  return (
    <AppContext.Provider value={{ store, actions }}>
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => React.useContext(AppContext);
