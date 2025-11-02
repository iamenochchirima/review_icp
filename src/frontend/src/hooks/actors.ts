import { Actor, HttpAgent } from "@dfinity/agent";
import type { _SERVICE } from "../idl/governance/service";
import { idlFactory } from "../idl/governance/idlFactory.did";

export const getGovernanceActor = async () => {
  const agent = await HttpAgent.create({
    host: "https://icp0.io",
  });

  const canisterId = "rrkah-fqaaa-aaaaa-aaaaq-cai";

  const canister = Actor.createActor<_SERVICE>(idlFactory, {
    agent,
    canisterId,
  });
  return canister;
};
