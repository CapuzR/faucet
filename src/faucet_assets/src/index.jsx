import * as React from "react";
import { StoicIdentity } from "ic-stoic-identity";

import {
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Backdrop,
  CircularProgress,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import { idlFactory as idlFaucet } from "../IDLS/faucet";
import { actor } from "./actor";
import canisters from "../../../canister_ids.json";
import dfinityLogo from "../assets/logo.png";

const network =
  process.env.DFX_NETWORK ||
  (process.env.NODE_ENV === "production" ? "ic" : "local");

const host =
  process.env.NODE_ENV == "development"
    ? "http://localhost:4943/"
    : process.env.NODE_ENV == "staging"
    ? "https://mainnet.dfinity.network/"
    : "https://mainnet.dfinity.network/";
const eLedgerCanId =
  process.env.NODE_ENV == "development"
    ? canisters.icp_ledger.local
    : process.env.NODE_ENV == "staging"
    ? canisters.icp_ledger.staging
    : canisters.icp_ledger.ic;

const eFaucetCanId =
  process.env.NODE_ENV == "development"
    ? canisters["faucet-backend"].local
    : process.env.NODE_ENV == "staging"
    ? canisters["faucet-backend"].staging
    : canisters["faucet-backend"].ic;
const whitelist = [eFaucetCanId, eLedgerCanId];

const root = createRoot(document.getElementById("app"));

export default function Faucet() {
  const [token, setToken] = useState("");
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState(
    localStorage.getItem("wallet") ? localStorage.getItem("wallet") : null
  );
  const [identity, setIdentity] = useState();

  const handleChange = (event) => {
    setToken(event.target.value);
  };

  const onSignInPlug = async () => {
    try {
      setLoading(true);
      const response = await window.ic?.plug?.requestConnect({
        host,
        whitelist,
      });

      if (response) {
        const principal = await window.ic.plug.agent.getPrincipal();
        const identity = principal.toText();
        setWallet("plug");
        localStorage.setItem("wallet", "plug");
        setConnected(true);
        setLoading(false);

        return { principal: identity, identity: response };
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.log(err, "Err in connect plug");
      setLoading(false);
    }
  };

  const onSignInBitfinity = async () => {
    try {
      setLoading(true);

      if (window.ic && window.ic.infinityWallet) {
        const response = await window.ic?.infinityWallet?.requestConnect({
          host,
          whitelist,
        });
        if (response) {
          const principal = await window.ic.infinityWallet.getPrincipal();
          const identity = principal.toText();
          setWallet("bitfinity");
          localStorage.setItem("wallet", "bitfinity");
          setConnected(true);
          setLoading(false);

          return { principal: identity, identity: response };
        } else {
          setLoading(false);
        }
      } else {
        return alert("plase install bitfinity");
      }
    } catch (err) {
      console.log(err, "Err in connect bitfinity");
      setLoading(false);
    }
  };

  const onSignInStoic = async () => {
    try {
      setLoading(true);
      const identity = await StoicIdentity.load();

      if (identity !== false) {
        const principal = identity._principal.toText();
        setLoading(false);
        setWallet("stoic");
        setIdentity(identity);
        localStorage.setItem("wallet", "stoic");
        setConnected(true);
        return { identity, principal };
      } else {
        const identity = await StoicIdentity.connect();
        const principal = identity._principal.toText();
        setWallet("stoic");
        localStorage.setItem("wallet", "stoic");
        setConnected(true);
        setLoading(false);
        return { identity, principal };
      }
    } catch (err) {
      console.log(err, "ERR in connect Stoic");
      setLoading(false);
    }
  };

  const handleTransfer = async (e) => {
    setLoading(true);
    const faucetActor = await actor(
      { host: host, whitelist },
      { canisterId: eFaucetCanId, interfaceFactory: idlFaucet },
      identity,
      wallet,
      host
    );
    console.log(faucetActor);
    const blockHeight = await faucetActor.claim({ FICP: null }, []);
    console.log("Block Height/Index", blockHeight);
    setLoading(false);
    // localStorage.getItem("wallet");
  };

  return (
    <div>
      {loading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12}>
          <form onSubmit={handleTransfer}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <img src={dfinityLogo} />
              </Grid>
              {!connected ? (
                <Box
                  style={{
                    display: "flex",
                    width: "100%",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box style={{ width: "100%", marginBottom: 40 }}>
                    <Button
                      onClick={async () => {
                        const identity = await onSignInBitfinity();
                        console.log(identity);
                      }}
                      fullWidth
                      style={{
                        background: "#313754",
                        borderRadius: 18,
                        border: "2px solid rgb(57 173 226 / 42%)",
                      }}
                    >
                      <img alt="" src={"../bitfinityWallet_logo.svg"} />
                    </Button>
                  </Box>
                  <Box style={{ width: "100%", marginBottom: 40 }}>
                    <Button
                      onClick={async () => {
                        const identity = await onSignInPlug();
                        console.log(identity);
                      }}
                      fullWidth
                      style={{
                        background: "#313754",
                        borderRadius: 18,
                        border: "2px solid rgb(57 173 226 / 42%)",
                      }}
                    >
                      <img alt="" src={"../plugIcon.svg"} />
                    </Button>
                  </Box>
                  <Box style={{ width: "100%", marginBottom: 40 }}>
                    <Button
                      onClick={async () => {
                        const identity = await onSignInStoic();
                        console.log(identity);
                      }}
                      fullWidth
                      style={{
                        background: "#313754",
                        borderRadius: 18,
                        border: "2px solid rgb(57 173 226 / 42%)",
                      }}
                    >
                      <img alt="" src={"../stoicLogo.svg"} />
                    </Button>
                  </Box>
                </Box>
              ) : (
                <>
                  <Grid item xs={12} textAlign="center">
                    <Typography>FAUCET</Typography>
                  </Grid>
                  <Grid item xs={3} textAlign="center"></Grid>
                  <Grid item xs={12} md={6} textAlign="center">
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Token
                      </InputLabel>
                      <Select
                        disabled={!connected}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={token}
                        label="Select your preferred token"
                        onChange={handleChange}
                      >
                        <MenuItem value={10}>FICP</MenuItem>
                        <MenuItem disabled value={20}>
                          FEXT
                        </MenuItem>
                        <MenuItem disabled value={30}>
                          FT20
                        </MenuItem>
                        <MenuItem disabled value={30}>
                          FBTC
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={3} textAlign="center"></Grid>
                  <Grid item xs={12} textAlign="center">
                    <Button
                      variant="contained"
                      disabled={!token}
                      component="label"
                      onClick={handleTransfer}
                      style={{ backgroundColor: "#2d2d2d" }}
                    >
                      Claim
                    </Button>
                  </Grid>
                </>
              )}
            </Grid>
          </form>
        </Grid>
        <Grid
          item
          xs={12}
          style={{ marginTop: "10vh", position: "absolute", bottom: 10 }}
        >
          <Grid item xs={12} textAlign="center">
            <Typography>
              <a href="">Github Repo</a>
            </Typography>
            <Typography>Developed by: Weavers Labs</Typography>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

root.render(<Faucet />);
