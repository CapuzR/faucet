import { Actor, HttpAgent } from "@dfinity/agent";

export const actor = async (
  connectOptions,
  actorOptions,
  identity,
  wallet,
  host
) => {
  if (wallet === "plug") {
    const connected = await window.ic.plug.isConnected();
    if (!connected) {
      await window.ic.plug.requestConnect(connectOptions);
    }
    return await window.ic.plug.createActor(actorOptions);
  } else if (wallet === "bitfinity") {
    const connected = await window.ic.infinityWallet.isConnected();
    if (!connected) {
      await window.ic.infinityWallet.requestConnect(connectOptions);
    }
    console.log(actorOptions);
    return await window.ic.infinityWallet.createActor({
      ...actorOptions,
      host,
    });
  } else {
    const agent = new HttpAgent({
      identity,
      host,
    });

    if (process.env.NODE_ENV == "development") {
      agent.fetchRootKey();
    }
    console.log(agent, "agent")
    return await Actor.createActor(actorOptions.interfaceFactory, {
      agent,
      canisterId: actorOptions.canisterId,
    });
  }
};
