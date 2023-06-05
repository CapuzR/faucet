import { idlFactory as bRCanIDLFactory } from "../../IDLS/e-br-service/e_br_service.did.js";
import { idlFactory as icpLedgerIDLFactory } from "../../IDLS/ledgers/icp/icp_ledger.did.js";
import { Actor, HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { Principal } from "@dfinity/principal";
import { actor as createActor } from "../actor";
import { to32bits } from "../utils/utils";
import { StoicIdentity } from "ic-stoic-identity";


const icpLedgerCanId =
  process.env.NODE_ENV == "development"
    ? icpLedgerCanId.local
    : process.env.NODE_ENV == "staging"
    ? icpLedgerCanId.staging
    : icpLedgerCanId.ic;
const brServiceCanId =
  process.env.NODE_ENV == "development"
    ? brServiceCanId.local
    : process.env.NODE_ENV == "staging"
    ? brServiceCanId.staging
    : brServiceCanId.ic;
const host =
  process.env.NODE_ENV == "development"
    ? "http://localhost:4943/"
    : process.env.NODE_ENV == "staging"
    ? "https://ic0.app/"
    : "https://ic0.app/";
const whitelist =
  process.env.NODE_ENV == "development"
    ? [brServiceCanId, icpLedgerCanId]
    : process.env.NODE_ENV == "staging"
    ? [brServiceCanId, icpLedgerCanId]
    : [brServiceCanId, icpLedgerCanId];

const urlsMeninas = [
  "https://images.entrepot.app/t/k4qsa-4aaaa-aaaah-qbvnq-cai/h6loz-3ikor-uwiaa-aaaaa-b4anl-maqca-aaaax-q?cache=10",
  "https://images.entrepot.app/t/k4qsa-4aaaa-aaaah-qbvnq-cai/74wia-qakor-uwiaa-aaaaa-b4anl-maqca-aaabi-a?cache=10",
  "https://images.entrepot.app/t/k4qsa-4aaaa-aaaah-qbvnq-cai/rav3b-vqkor-uwiaa-aaaaa-b4anl-maqca-aaabi-q?cache=10",
  "https://images.entrepot.app/t/k4qsa-4aaaa-aaaah-qbvnq-cai/swokb-mqkor-uwiaa-aaaaa-b4anl-maqca-aaaba-q?cache=10",
  "https://images.entrepot.app/t/k4qsa-4aaaa-aaaah-qbvnq-cai/4knza-jakor-uwiaa-aaaaa-b4anl-maqca-aaaba-a?cache=10",
  "https://images.entrepot.app/t/k4qsa-4aaaa-aaaah-qbvnq-cai/3h23b-3akor-uwiaa-aaaaa-b4anl-maqca-aaabq-a?cache=10",
  "https://images.entrepot.app/t/k4qsa-4aaaa-aaaah-qbvnq-cai/hd5sr-5akor-uwiaa-aaaaa-b4anl-maqca-aaaav-q?cache=10",
  "https://images.entrepot.app/t/k4qsa-4aaaa-aaaah-qbvnq-cai/q3ydr-zakor-uwiaa-aaaaa-b4anl-maqca-aaabm-q?cache=10",
  "https://images.entrepot.app/t/k4qsa-4aaaa-aaaah-qbvnq-cai/aur32-iykor-uwiaa-aaaaa-b4anl-maqca-aaabh-a?cache=10",
];

export async function getBalance(wallet) {
  if (wallet === "plug") {
    const bRService = await createActor(
      { host: host, whitelist },
      { canisterId: icpLedgerCanId, interfaceFactory: icpLedgerIDLFactory },
      "plug"
    );
    const balanceRes = await bRService.icrc1_balance_of({
      owner: Principal.fromText(window.ic.plug.sessionManager.sessionData.principalId),
      subaccount: [],
    });

    if (Number(balanceRes) >= 0) {
      return balanceRes;
    } else {
      return false;
    }
  } else if (wallet === "stoic") {
    let identity = await StoicIdentity.load();
    // let accounts = await identity.accounts();

    const actorLedger = await actor(
      icpLedgerIDLFactory,
      identity,
      icpLedgerCanId
    );
    const balance = await actorLedger.icrc1_balance_of({
      owner: identity._principal,
      subaccount: [],
    });

    if (balance) {
      return balance;
    } else {
      return false;
    }
  } else if (wallet === "NFID") {
    const authClient = await AuthClient.create();
    const identity = await authClient.getIdentity();

    const actorLedger = await actor(
      icpLedgerIDLFactory,
      identity,
      icpLedgerCanId
    );

    const balance = await actorLedger.icrc1_balance_of({
      owner: authClient.getIdentity().getPrincipal(),
      subaccount: [],
    });
    
    if (balance) {
      return balance;
    } else {
      return false;
    }
  };
}

const actor = async (idl, identity, canisterId, options = undefined) => {
  const agent = new HttpAgent({
    identity,
  });
  if (process.env.NODE_ENV == "development") {
    agent.fetchRootKey();
  };
  return await Actor.createActor(idl, {
    agent,
    canisterId,
    ...(options ? options.actorOptions : {}),
  });
};

// export async function connectAndFetchNFTs(sendMessage, wallet) {
//   console.log("--------------");
//   console.log(
//     "--* Connection is stablished with host:" +
//       host +
//       ", using as BR main service the canister with ID: " +
//       brServiceCanId +
//       " *--"
//   );
//   console.log("--------------");
//   if (wallet === "plug") {
//     if (
//       typeof window.ic === "undefined" ||
//       typeof window.ic.plug === "undefined"
//     ) {
//       throw new Error(
//         "We cannot detect a Plug Wallet in your browser extensions"
//       );
//     }
//     const connectionResult = await window.ic.plug.requestConnect({
//       host: host,
//       whitelist: whitelist,
//     });
//     let data = {};
//     let nfts = [];
//     let allowed = true;
//     let haveBalance = true;
//     let success = true;
//     let res;
//     let resProfile;

//     let accountId = window.ic.plug.sessionManager.sessionData.accountId;
//     const balanceTx = {
//       idl: icpLedgerIDLFactory,
//       canisterId: icpLedgerCanId,
//       methodName: "icrc1_balance_of",
//       args: [
//         {
//           owner: Principal.fromText(window.ic.plug.sessionManager.sessionData.principalId),
//           subaccount: [],
//         },
//       ],
//       onSuccess: async (res) => {
//         if (res < 100000000) {
//           console.log(
//             "You don't have FICP. Please join our Discord and ask how to get some."
//           );
//           haveBalance = false;
//         }
//       },
//       onFail: async (res) => {
//         success = false;
//         console.log("ICP balance check error: " + res);
//       },
//     };

//     const meninasTx = {
//       idl: meninasIDLFactory,
//       canisterId: meninasCanId,
//       methodName: "tokens",
//       args: [accountId],
//       onSuccess: async (meninasTxRes) => {
//         if (
//           meninasTxRes.ok &&
//           typeof meninasTxRes.ok == "object" &&
//           meninasTxRes.ok.length != 0
//         ) {
//           meninasTxRes.ok.map((meninaIndex) => {
//             let meninaId = getTokenId(meninasCanId, meninaIndex);

//             nfts.push({
//               canister: meninasCanId,
//               id: meninaId,
//               index: meninaIndex,
//               metadata: undefined,
//               standard: "EXT",
//               url:
//                 "https://" +
//                 meninasCanId +
//                 ".raw.ic0.app/?type=thumbnail&tokenid=" +
//                 meninaId,
//             });
//           });
//         }
//       },
//       onFail: async (res) => {
//         success = false;
//         console.log("Get Meninas error: " + res);
//       },
//     };

//     const interitusTx = {
//       idl: interitusIDLFactory,
//       canisterId: interitusCanId,
//       methodName: "tokens",
//       args: [accountId],
//       onSuccess: async (interitusTxRes) => {
//         if (
//           interitusTxRes.ok &&
//           typeof interitusTxRes.ok == "object" &&
//           interitusTxRes.ok.length != 0
//         ) {
//           interitusTxRes.ok.map((interitusIndex) => {
//             let interitusId = getTokenId(interitusCanId, interitusIndex);

//             nfts.push({
//               canister: interitusCanId,
//               id: interitusId,
//               index: interitusIndex,
//               metadata: undefined,
//               standard: "EXT",
//               url:
//                 "https://" +
//                 interitusCanId +
//                 ".raw.ic0.app/?type=thumbnail&tokenid=" +
//                 interitusId,
//             });
//           });
//         }
//       },
//       onFail: async (res) => {
//         success = false;
//         console.log("Get Interitus error: " + res);
//       },
//     };

//     const profileTx = {
//       idl: profileIDLFactory,
//       canisterId: profileCanId,
//       methodName: "readProfile",
//       args: [],
//       onSuccess: async (profileRes) => {
//         resProfile = profileRes;
//       },
//       onFail: async (res) => {
//         console.log("Get Profile error: " + res);
//       },
//     };

//     const allowlistTx = {
//       idl: bRCanIDLFactory,
//       canisterId: brServiceCanId,
//       methodName: "isCallerAllowed",
//       args: [],
//       onSuccess: async (allowlistTxRes) => {
//         if (!allowlistTxRes) {
//           console.log(
//             "You're not allowed to play yet. Please join our Discord and ask how to join the list."
//           );
//           allowed = false;
//         }
//       },
//       onFail: async (res) => {
//         success = false;
//         console.log("BR Tx error: " + res);
//       },
//     };

//     if (process.env.NODE_ENV == "development") {
//       res = await window.ic.plug.batchTransactions([balanceTx, profileTx]);
//     } else {
//       try {
//         res = await window.ic.plug.batchTransactions([
//           allowlistTx,
//           balanceTx,
//           meninasTx,
//           interitusTx,
//           profileTx,
//         ]);
//       } catch (e) {
//         if ("Error: The transaction was rejected.") {
//           sendMessage("ReactApi", "HandleCallBackBets", "Transaction declined");
//         } else {
//           sendMessage("ReactApi", "HandleCallBackBets", "Unexpected error");
//         }
//       }
//     }
//     const obj = {
//       principal: window.ic.plug.sessionManager.sessionData.principalId,
//       username: null,
//       portraitURL: null,
//       nfts,
//     };

//     if (resProfile.err) {
//       if (resProfile.err["NotFound"] === null) {
//         obj.username = `user #${Math.floor(Math.random() * 1000)}`;
//         obj.portraitURL = urlsMeninas[Math.floor(Math.random() * 9)];
//       } else {
//         alert("not authorized");
//         return false;
//       }
//     } else {
//       const username = resProfile.ok[0][0].bio?.username[0];
//       obj.username = username;
//       obj.portraitURL = getUrlAvatar(
//         window.ic.plug.sessionManager.sessionData.principalId
//       );
//     }
//     data.result = connectionResult ? obj : "denied";
//     if (success) {
//       if (allowed) {
//         if (!haveBalance) {
//           data.error =
//             "You don't have FICP. Please join our Discord and ask how to get some.";
//         }
//       } else {
//         data.error =
//           "You're not allowed to play yet. Please join our Discord and ask how to join the list.";
//       }
//     } else {
//       data.error = "BR Tx error: " + res;
//     }

//     let json = JSON.stringify(data);
//     sendMessage("ReactApi", "HandleCallback", json);
//     return json;
//   } else if (wallet === "stoic") {

//     let identity = await StoicIdentity.load();
//     let accounts = JSON.parse(await identity.accounts());
//     let accountId = accounts[0].address;
    
//     const agent = new HttpAgent({
//       identity,
//     });
//     let data = {};
//     let nfts = [];
//     let allowed = true;
//     let haveBalance = true;
//     let success = true;
//     let res;

//     const actorLedger = await actor(
//       icpLedgerIDLFactory,
//       identity,
//       icpLedgerCanId,
//       {}
//     );

//     const actorProfile = await actor(
//       profileIDLFactory,
//       identity,
//       profileCanId,
//       {}
//     );

//     const actorMeninas = await actor(
//       meninasIDLFactory, 
//       identity, 
//       meninasCanId,
//       {}
//     );

//     const actorInteritus = await actor(
//       interitusIDLFactory,
//       identity,
//       interitusCanId,
//       {}
//     );

//     const actorBR = await actor(
//       bRCanIDLFactory, 
//       identity, 
//       brServiceCanId, 
//       {}
//     );

//     const balance = await actorLedger.icrc1_balance_of({
//       owner: identity._principal,
//       subaccount: [],
//     });

//     if (balance < 100000000) {
//       console.log(
//         "You don't have FICP. Please join our Discord and ask how to get some."
//       );

//       data.error = "You don't have FICP. Please join our Discord and ask how to get some.";
        
//       let json = JSON.stringify(data);

//       sendMessage("ReactApi", "HandleCallback", json);

//     } else {
      
//       const allowlistTxRes = await actorBR.isCallerAllowed();
  
//       if (!allowlistTxRes) {
//         console.log(
//           "You're not allowed to play yet. Please join our Discord and ask how to join the list."
//         );
  
//         data.error = "You're not allowed to play yet. Please join our Discord and ask how to join the list.";
        
//         let json = JSON.stringify(data);
  
//         sendMessage("ReactApi", "HandleCallback", json);
//       } else {

//         const meninasTxRes = await actorMeninas.tokens(accountId);
    
//         if (
//           meninasTxRes.ok &&
//           typeof meninasTxRes.ok == "object" &&
//           meninasTxRes.ok.length != 0
//         ) {
//           meninasTxRes.ok.map((meninaIndex) => {
//             let meninaId = getTokenId(meninasCanId, meninaIndex);
    
//             nfts.push({
//               canister: meninasCanId,
//               id: meninaId,
//               index: meninaIndex,
//               metadata: undefined,
//               standard: "EXT",
//               url:
//                 "https://" +
//                 meninasCanId +
//                 ".raw.ic0.app/?type=thumbnail&tokenid=" +
//                 meninaId,
//             });
//           });
//         }
    
//         const interitusTxRes = await actorInteritus.tokens(accountId);
    
//         if (
//           interitusTxRes.ok &&
//           typeof interitusTxRes.ok == "object" &&
//           interitusTxRes.ok.length != 0
//         ) {
//           interitusTxRes.ok.map((interitusIndex) => {
//             let interitusId = getTokenId(interitusCanId, interitusIndex);
    
//             nfts.push({
//               canister: interitusCanId,
//               id: interitusId,
//               index: interitusIndex,
//               metadata: undefined,
//               standard: "EXT",
//               url:
//                 "https://" +
//                 interitusCanId +
//                 ".raw.ic0.app/?type=thumbnail&tokenid=" +
//                 interitusId,
//             });
//           });
//         }
  
//         const obj = {
//           principal: identity._principal.toText(),
//           username: null,
//           portraitURL: null,
//           nfts,
//         };
    
//         const profile = await actorProfile.readProfile();
    
//         if (profile.err) {
//           if (profile.err["NotFound"] === null) {
//             obj.username = `user #${Math.floor(Math.random() * 1000)}`;
//             obj.portraitURL = urlsMeninas[Math.floor(Math.random() * 9)];
//           } else {
//             alert("not authorized");
//             return false;
//           }
//         } else {
//           const username = profile.ok[0][0].bio?.username[0];
//           obj.username = username;
//           obj.portraitURL = getUrlAvatar(identity._principal.toText());
//         }
    
//         data.result = identity ? obj : "denied";
//         if (success) {
//             if (!haveBalance) {
//               data.error =
//                 "You don't have FICP. Please join our Discord and ask how to get some.";
//             }
//         } else {
//           data.error = "BR Tx error: " + res;
//         }
    
//         let json = JSON.stringify(data);
    
//         sendMessage("ReactApi", "HandleCallback", json);
//         return json;
//       };
//     };


//   } else if (wallet === "NFID") {
//     const authClient = await AuthClient.create();
//     await authClient.login({
//       maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
//       onSuccess: async () => {
//         const identity = await authClient.getIdentity();
//         let data = {};
//         let nfts = [];
//         let allowed = true;
//         let haveBalance = true;
//         let success = true;
//         let res;

//         const actorLedger = await actor(
//           icpLedgerIDLFactory,
//           identity,
//           icpLedgerCanId,
//           {}
//         );
        
//         const actorProfile = await actor(
//           profileIDLFactory,
//           identity,
//           profileCanId,
//           {}
//         );

//         const actorMeninas = await actor(
//           meninasIDLFactory, 
//           identity, 
//           meninasCanId,
//           {}
//         );
    
//         const actorInteritus = await actor(
//           interitusIDLFactory,
//           identity,
//           interitusCanId,
//           {}
//         );
    
//         const actorBR = await actor(
//           bRCanIDLFactory,
//           identity,
//           brServiceCanId,
//           {}
//         );

//         const balance = await actorLedger.icrc1_balance_of({
//           owner: authClient.getIdentity().getPrincipal(),
//           subaccount: [],
//         });
        
//         if (balance < 100000000) {
//           console.log(
//             "You don't have FICP. Please join our Discord and ask how to get some."
//           );
//           haveBalance = false;
//         }

//         const meninasTxRes = await actorMeninas.tokens(accountId);

//         if (
//           meninasTxRes.ok &&
//           typeof meninasTxRes.ok == "object" &&
//           meninasTxRes.ok.length != 0
//         ) {
//           meninasTxRes.ok.map((meninaIndex) => {
//             let meninaId = getTokenId(meninasCanId, meninaIndex);
    
//             nfts.push({
//               canister: meninasCanId,
//               id: meninaId,
//               index: meninaIndex,
//               metadata: undefined,
//               standard: "EXT",
//               url:
//                 "https://" +
//                 meninasCanId +
//                 ".raw.ic0.app/?type=thumbnail&tokenid=" +
//                 meninaId,
//             });
//           });
//         }
    
//         const interitusTxRes = await actorInteritus.tokens(accountId);
    
//         if (
//           interitusTxRes.ok &&
//           typeof interitusTxRes.ok == "object" &&
//           interitusTxRes.ok.length != 0
//         ) {
//           interitusTxRes.ok.map((interitusIndex) => {
//             let interitusId = getTokenId(interitusCanId, interitusIndex);
    
//             nfts.push({
//               canister: interitusCanId,
//               id: interitusId,
//               index: interitusIndex,
//               metadata: undefined,
//               standard: "EXT",
//               url:
//                 "https://" +
//                 interitusCanId +
//                 ".raw.ic0.app/?type=thumbnail&tokenid=" +
//                 interitusId,
//             });
//           });
//         }    

//         const allowlistTxRes = await actorBR.isCallerAllowed();

//         if (!allowlistTxRes) {
//           console.log(
//             "You're not allowed to play yet. Please join our Discord and ask how to join the list."
//           );
//           allowed = false;
//         }

//         const obj = {
//           principal: identity._principal.toText(),
//           username: null,
//           portraitURL: null,
//           nfts,
//         };

//         const profile = await actorProfile.readProfile();
//         console.log(profile, "PRIFLE");

//         if (profile.err) {
//           if (profile.err["NotFound"] === null) {
//             obj.username = `user #${Math.floor(Math.random() * 1000)}`;
//             obj.portraitURL = urlsMeninas[Math.floor(Math.random() * 9)];
//           } else {
//             alert("not authorized");
//             return false;
//           }
//         } else {
//           const username = profile.ok[0][0].bio?.username[0];
//           obj.username = username;
//           obj.portraitURL = getUrlAvatar(identity._principal.toText());
//         }

//         console.log(obj, "OBJECTO");

//         data.result = identity ? obj : "denied";
//         if (success) {
//           if (allowed) {
//             if (!haveBalance) {
//               data.error =
//                 "You don't have FICP. Please join our Discord and ask how to get some.";
//             }
//           } else {
//             data.error =
//               "You're not allowed to play yet. Please join our Discord and ask how to join the list.";
//           }
//         } else {
//           data.error = "BR Tx error: " + res;
//         }

//         let json = JSON.stringify(data);

//         sendMessage("ReactApi", "HandleCallback", json);
//         return json;
//       },
//       identityProvider: "https://nfid.one" + AUTH_PATH,
//       windowOpenerFeatures:
//         `left=${window.screen.width / 2 - 525 / 2}, ` +
//         `top=${window.screen.height / 2 - 705 / 2},` +
//         `toolbar=0,location=0,menubar=0,width=525,height=705`,
//     });
//   }
// }

// const getTokenId = (principal, index) => {
//   const padding = Buffer("\x0Atid");
//   const array = new Uint8Array([
//     ...padding,
//     ...Principal.fromText(principal).toUint8Array(),
//     ...to32bits(index),
//   ]);
//   return Principal.fromUint8Array(array).toText();
// };
