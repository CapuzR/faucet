import { Actor, HttpAgent } from "@dfinity/agent";


export const actor = async (connectOptions, actorOptions, identity, wallet) => {
    if (wallet === "plug") {
      const connected = await window.ic.plug.isConnected();
      if (!connected) {
        await window.ic.plug.requestConnect(connectOptions);
      }
      return await window.ic.plug.createActor(actorOptions);
    } else {
      const agent = new HttpAgent({
        identity,
        host: connectOptions.host,
      });
  
      if (process.env.NODE_ENV == "development") {
        agent.fetchRootKey();
      }
  
      return await Actor.createActor(actorOptions.interfaceFactory, {
        agent,
        canisterId: actorOptions.canisterId,
      });
    }
  };