# Faucet

## Simply use it

Go to [Faucet](https://rme2k-giaaa-aaaal-aabya-cai.raw.ic0.app/), connect your plug wallet, choose FICP and click on Claim to receive your Faucet ICPs.

We're talking to Plug's team to add FICP (Our canister and others) as an option for testing purposes.

If you want to have your own faucet, feel free to follow next section steps.

## Deploy your own faucet

### 1. Clone [Faucet repository](https://github.com/CapuzR/ICPFaucet).

### 2. Get a pre-built Ledger canister module and Candid interface files.
NOTE: The `IC_VERSION` variable is a commit hash from the [DFINITY repository](http://github.com/dfinity/ic).

```bash
export IC_VERSION=a7058d009494bea7e1d898a3dd7b525922979039
curl -o ledger.wasm.gz https://download.dfinity.systems/ic/${IC_VERSION}/canisters/ledger-canister_notify-method.wasm.gz
gunzip ledger.wasm.gz
curl -o ledger.private.did https://raw.githubusercontent.com/dfinity/ic/${IC_VERSION}/rs/rosetta-api/ledger.did
curl -o ledger.public.did https://raw.githubusercontent.com/dfinity/ic/${IC_VERSION}/rs/rosetta-api/ledger_canister/ledger.did
```

### 3. Make sure you use a recent version of DFX.
  If you don't have DFX installed, follow instructions on https://smartcontracts.org/ to install it.

### 4. If you don't have a DFX project yet, follow these instructions to create a new DFX project:
  https://smartcontracts.org/docs/developers-guide/cli-reference/dfx-new.html

### 5. Copy the file you obtained at the first step (`ledger.wasm`, `ledger.private.did`, `ledger.public.did`) into the root of your project.

### 6. Add the following definition to the `canisters` object in your `dfx.json` file:

```bash
"customLedger": {
      "type": "custom",
      "wasm": "ledger.wasm",
      "candid": "ledger.private.did"
}
```

### 7. Start a local replica cleanning everything.

```bash
dfx start --clean
```

### 8. In a different console create all the canisters:

```bash
dfx canister create --all
```

### 9. Deploy the token faucet.

```bash
export NETWORK=local
export MINT_ACC=$(dfx ledger --network ${NETWORK} account-id --of-canister faucet)
export ARCHIVE_CONTROLLER=$(dfx identity get-principal)
export TOKEN_NAME="FaucetICP"
export TOKEN_SYMBOL="FICP"

dfx deploy --network ${NETWORK} customLedger --argument '(record {
  token_name = opt "'${TOKEN_NAME}'";
  token_symbol = opt "'${TOKEN_SYMBOL}'";
  minting_account = "'${MINT_ACC}'";
  transfer_fee = opt record{ e8s = 10_000 };
  initial_values = vec {};
  send_whitelist = vec {};
})'
```
where
- the `NETWORK` is the url or name of the replica where you want to deploy the ledger (e.g. use ic for the mainnet or local)
- the `TOKEN_NAME` is the human-readable name of your new token
- the `TOKEN_SYMBOL` is the symbol of your new token
- the `MINT_ACC` is the account of the Principal responsible for minting and burning tokens (see the xref:ledger.adoc[Ledger documentation]). In this case we're assigning a canister as the responsible.
- the `ARCHIVE_CONTROLLER` is the xref:https://smartcontracts.org/docs/developers-guide/default-wallet.html#_controller_and_custodian_roles[controller Principal] of the archive canisters.

For testing purposes we doesn't include archive_options on mainnet.

### 10. Update the canister definition in the `dfx.json` file to use the public Candid interface:

```bash
 {
   "canisters": {
    ...,
    "ledger": {
        "type": "custom",
        "wasm": "ledger.wasm",
-       "candid": "ledger.private.did"
+       "candid": "ledger.public.did"
    },
     ...
   }
 }
 ```

### 11. Check that the Ledger canister is healthy. Execute the following command:

```bash
dfx canister --network ${NETWORK} call customLedger symbol
```
 The output should look like the following:
```bash
(record { symbol = "FICP" })
```

### 12. Deploy Faucet canister

```bash
export LEDGER_ID=$(dfx canister id customLedger)
dfx deploy --network ${NETWORK} faucet --argument '(record { 
    ficp = record {
      canId = "'${LEDGER_ID}'";
      baseAmount = 1_000_000_000;
      baseFee = 10_000
    };
    fext = record {
      canId = "";
      baseAmount = 1_000_000_000;
      baseFee = 10_000
    };
    ft20 = record {
      canId = "";
      baseAmount = 1_000_000_000;
      baseFee = 10_000
    };
    fbtc = record {
      canId = "";
      baseAmount = 1_000_000_000;
      baseFee = 10_000
    }
  })'
```


## Test and use the Faucet from dfx

### 1. Create a test user and transfer funds from the ICP faucet to your account:

```bash
dfx identity new test
dfx identity use test
dfx canister --network ${NETWORK} call faucet claim '(variant { FICP }, null)'
```

### 2. Check your account balance:

```bash
export TEST_ACC=$(dfx ledger --network ${NETWORK} account-id)
dfx canister --network ${NETWORK} call customLedger account_balance '(record { account = '$(python3 -c 'print("vec{" + ";".join([str(b) for b in bytes.fromhex("'$TEST_ACC'")]) + "}")')' })'
```

### 3. Update token options:

```bash
export LEDGER_ID="<ledger-canister-id>"
dfx canister call customLedger account_balance '(record { 
    ficp = record {
      canId = "<new-ledger-canister-id>";
      baseAmount = 1_000_000_000;
      baseFee = 10_000
    };
    fext = record {
      canId = "";
      baseAmount = 1_000_000_000;
      baseFee = 10_000
    };
    ft20 = record {
      canId = "";
      baseAmount = 1_000_000_000;
      baseFee = 10_000
    };
    fbtc = record {
      canId = "";
      baseAmount = 1_000_000_000;
      baseFee = 10_000
    }
  })'
```

### 4. Remove frontend dependencies from `dfx.json`:

```bash
   "faucet_assets": {
-     "dependencies": [
-       "faucet"
-     ],
      "frontend": {
        "entrypoint": "src/faucet_assets/src/index.html"
      },
```

### 5. Change your identity:

```bash
dfx identity use default
```

### 5. Deploy your frontend canister:

```bash
dfx canister deploy faucet_assets
```