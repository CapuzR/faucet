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
  Alert,
  Stack,
  Link
} from "@mui/material";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { idlFactory as idlFaucet } from "../IDLS/faucet";
import { actor as Actor } from "./actor";
import canisters from "../../../canister_ids.json";
import dfinityLogo from "../assets/logo.png";
import * as Connections from "./Services/Connections";

const network =
  process.env.DFX_NETWORK ||
  (process.env.NODE_ENV === "production" ? "ic" : "local");

const host =
  process.env.NODE_ENV == "development"
    ? "http://localhost:4943/"
    : process.env.NODE_ENV == "staging"
    ? "https://ic0.app/"
    : "https://ic0.app/";

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
  const [balance, setBalance] = useState(0);
  const [wallet, setWallet] = useState(
    localStorage.getItem("wallet") ? localStorage.getItem("wallet") : null
  );
  const [ claim, setClaim ] = useState(false);
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
    try {
      setClaim(true);
      setLoading(true);
      const faucetActor = await Actor(
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
      setInterval(() => {
        setClaim(false)
      }, 5000);
    }catch (error) {
      console.log(error)
  }
    // localStorage.getItem("wallet");
  };

  const getBalance = async () => {
    const balanceRes = await Connections.getBalance();
    setBalance(parseInt(balanceRes) / 100000000);
  };

  useEffect(() => {
    if (connected) {
      getBalance();
    }
  });


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
        <Grid item xs={6}>
          {
            connected ? 
              <Grid
                item
                container
                style={{
                  width: "20%",
                  backgroundColor: "transparent",
                  zIndex: "9",
                  position: "absolute",
                  Top: 0,
                  left: 0,
                }}
              >
                <Grid item xs={12}>
                  <Button
                    style={{
                      color: "#fff",
                      marginTop: "10px",
                      marginLeft: "10px",
                      borderColor: "#fff",
                    }}
                    variant="outlined"
                    aria-label="refresh balance"
                    component="label"
                    size="small"
                    onClick={() => {
                      getBalance();
                    }}
                  >
                    <p style={{ fontSize: "12px", color: "#fff" }}>
                      Balance:{" "}
                      {balance == 0
                        ? 0.0
                        : Math.round((balance + Number.EPSILON) * 100) / 100}{" "}
                      FICP ⟲
                    </p>
                  </Button>
                </Grid>
              </Grid>
            :
            ''
          }
        </Grid>
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
                  <Grid item xs={12}>
                    {
                      claim ? 
                        <Stack sx={{ width: '100%' }} spacing={2}>
                          <Alert severity="success">You've succesfully claim your FICP tokens. Now go and play <Link href="https://oisnv-xiaaa-aaaan-qaumq-cai.ic0.app/">Bounty Rush</Link></Alert>
                        </Stack>
                      :
                      ''
                    }
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
