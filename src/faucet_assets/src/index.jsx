import { canisterId as faucetId, idlFactory as faucetIdlFactory } from "../../declarations/faucet/index.js";
import { canisterId as ledgerId, idlFactory as ledgerIdlFactory } from "../../declarations/customLedger/index.js";
import PlugConnect from '@psychedelic/plug-connect';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Grid, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import dfinityLogo from "../assets/logo.png";
import { Typography } from "../../../node_modules/@mui/material/index.js";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const network =
  process.env.DFX_NETWORK ||
  (process.env.NODE_ENV === "production" ? "ic" : "local");
const host = network != "ic" ? "http://localhost:8080" : "https://mainnet.dfinity.network";
const whitelist = [ faucetId, ledgerId ];

const root = createRoot(document.getElementById("app"));

export default function Faucet() {
  const [ token, setToken ] = useState('');
  const [ connected, setConnected ] = useState(false);
  const [ loading, setLoading ] = useState(false);

  const createActor = async (id, idl)=> { 
    return await window.ic.plug.createActor({
      canisterId: id,
      interfaceFactory: idl,
    })
  };

  const handleChange = (event) => {
    setToken(event.target.value);
  };

  const verifyConnectionAndAgent = async () => {
    const connected = await window.ic.plug.isConnected();
    if (!connected) window.ic.plug.requestConnect({ whitelist, host });
    if (connected && !window.ic.plug.agent) {
      window.ic.plug.createAgent({ whitelist, host })
    }
    setConnected(true);
  };

  const handleTransfer = async (e)=> {
    setLoading(true);
    const faucetActor = await createActor(faucetId, faucetIdlFactory);
    const blockHeight = await faucetActor.claim({ FICP: null }, []);
    console.log('Block Height/Index', blockHeight);
    setLoading(false);
  };
  
  useEffect(() => {
    verifyConnectionAndAgent();
  }, []);

  return (
    <div>
      {
        loading &&
        <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      }
      <Grid container spacing={3} justifyContent="center">
        {
          !connected ?
          <Grid item xs={12} textAlign="right">
            <a onClick={()=>{ setLoading(true); }}>
            <PlugConnect
              title="Connect"
              whitelist={whitelist}
              onConnectCallback={() => {console.log("Connected"); setConnected(true); setLoading(false);}}
              host={host}
              dark
            />
            </a>
          </Grid>
          :
          <Grid item xs={12} textAlign="right">
            <Button variant="text" onClick={()=>{setConnected(false)}}>Disconnect</Button>
          </Grid>
        }
        <Grid item xs={12} style={{marginTop: "10vh"}}>
          <form onSubmit={handleTransfer}>
            <Grid container spacing={2}>
            <Grid item xs={12}>
              <img src={dfinityLogo}/>
            </Grid>
            <Grid item xs={12} textAlign="center">
              <Typography>
                FAUCET
              </Typography>
            </Grid>
            <Grid item xs={3} textAlign="center">
            </Grid>
            <Grid item xs={12} md={6} textAlign="center">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Token</InputLabel>
                <Select
                  disabled = {!connected}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={token}
                  label="Select your preferred token"
                  onChange={handleChange}
                >
                  <MenuItem value={10}>FICP</MenuItem>
                  <MenuItem disabled value={20}>FEXT</MenuItem>
                  <MenuItem disabled value={30}>FT20</MenuItem>
                  <MenuItem disabled value={30}>FBTC</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3} textAlign="center">
            </Grid>
            <Grid item xs={12} textAlign="center">
              <Button
                variant="contained"
                disabled = {!connected}
                component="label"
                onClick={handleTransfer}
                style={{ backgroundColor: "#2d2d2d" }}
              >
                Claim
              </Button>
            </Grid>
            </Grid>
          </form>
        </Grid>
        <Grid item xs={12} style={{marginTop: "10vh", position: "absolute", bottom: 10}}>
          <Grid item xs={12} textAlign="center">
            <Typography>
              <a href="">Github Repo</a>
            </Typography>
            <Typography>
              Developed by: Weavers Labs
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

root.render(<Faucet/>);