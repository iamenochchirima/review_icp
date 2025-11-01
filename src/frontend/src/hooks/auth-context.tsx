
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  FC,
} from "react";
import {
  AuthClient,
} from "@dfinity/auth-client";
import { Actor, ActorSubclass, HttpAgent, Identity, SignIdentity } from "@dfinity/agent";
import { _SERVICE as BACKEND_SERVICE } from '../../../declarations/backend/backend.did';
import { idlFactory as backendDL, canisterId as backendCanisterId } from "../../../declarations/backend"
import { host, iiURL, network } from "../constants/urls";

interface ContextType {
  backendActor: ActorSubclass<BACKEND_SERVICE> | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  identity: Identity | null;
}

const initialContext: ContextType = {
  isAuthenticated: false,
  backendActor: null,
  login: () => { },
  logout: () => { },
  identity: null,
};

const AuthContext = createContext<ContextType>(initialContext);

const defaultOptions = {
  createOptions: {
    idleOptions: {
      disableIdle: true,
    },
  },
  loginOptions: {
    identityProvider: iiURL,
  },
};


export const useAuthClient = (options = defaultOptions) => {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [backendActor, setBackendActor] = useState<ActorSubclass<BACKEND_SERVICE> | null>(null);


  useEffect(() => {
    AuthClient.create(options.createOptions).then(async (client) => {
      updateClient(client);
    });
  }, []);

  const login = () => {
    authClient?.login({
      ...options.loginOptions,
      onSuccess: () => {
        updateClient(authClient);
      },
    });
  };

  async function logout() {
    await authClient?.logout();
    if (authClient) {
      await updateClient(authClient);
    }
  }

  async function updateClient(client: AuthClient) {
    const isAuthenticated = await client.isAuthenticated();
    setIsAuthenticated(isAuthenticated);

    setAuthClient(client);

    const _identity = client.getIdentity();
    setIdentity(_identity);

    let agent = await HttpAgent.create({
      host: host,
      identity: _identity,
    });

    if (network === "local") {
      agent.fetchRootKey();
    }

    const _backendActor: ActorSubclass<BACKEND_SERVICE> = Actor.createActor(
      backendDL,
      {
        agent,
        canisterId: backendCanisterId,
      }
    );
    setBackendActor(_backendActor);
  }



  return {
    isAuthenticated,
    backendActor,
    login,
    logout,
    identity,
  };
};

interface LayoutProps {
  children: React.ReactNode;
}

export const AuthProvider: FC<LayoutProps> = ({ children }) => {
  const auth = useAuthClient();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

