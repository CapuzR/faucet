E_BR_SERVICE_PATH=$ELEMENTUM_PATH"/bounty-rush/e-br-service"

cd $E_BR_SERVICE_PATH

if [ $E_ASSET_MANAGER_ENV = "local" ] 
then
    dfx canister create e_br_service >/dev/null
fi

echo $(dfx canister id e_br_service);

for i in ${ALLOW_LIST[@]}
do
    val="$val principal \"$i\";"
done 

if [ $EXECUTION_TYPE = "multiple" ]
then
    #Puts icp ledger canisterId into the canister_ids.json file.
    jq '.icp_ledger.local = "'$S_ICP_LEDGER_CANID'"' $E_BR_SERVICE_PATH/canister_ids.json > tmp.$$.json && mv tmp.$$.json $E_BR_SERVICE_PATH/canister_ids.json
    jq '.e_br_service.local = "'$(dfx canister id e_br_service)'"' $E_BR_SERVICE_PATH/canister_ids.json > tmp.$$.json && mv tmp.$$.json $E_BR_SERVICE_PATH/canister_ids.json


    # rm -r $E_BR_SERVICE_PATH"/src/IDLs/ledgers/icrc1";
    # cp -r $ELEMENTUM_PATH"/utilities/ledgers/icrc1/src/declarations/ledger" $E_BR_SERVICE_PATH"/src/IDLs/ledgers/icrc1";
    rm -r $E_BR_SERVICE_PATH"/src/IDLs/ledgers/icp";
    cp -r $ELEMENTUM_PATH"/utilities/ledgers/icp/src/declarations/ledger" $E_BR_SERVICE_PATH"/src/IDLs/ledgers/icp";
    
    #Replace exports from esm to cjs format so that nodejs can be able to use it.
    #Reemplaza los exports de formato esm a cjs para que nodejs pueda utilizarlos.

    #Para icp-ledger
    OLD='let icpLedger : Environments = { local : Text ='
    NEW='   let icpLedger : Environments = { local : Text = "'$S_ICP_LEDGER_CANID'"; staging : Text = "vttjj-zyaaa-aaaal-aabba-cai"; production : Text = "vttjj-zyaaa-aaaal-aabba-cai"; };'
    cp $E_BR_SERVICE_PATH"/canister-ids.mo" $E_BR_SERVICE_PATH"/canister-ids_temp.mo"
    DPATH=$E_BR_SERVICE_PATH"/canister-ids_temp.mo"
    BPATH=$E_BR_SERVICE_PATH
    [ ! -d $BPATH ] && mkdir -p $BPATH || :
    for f in $DPATH
    do
    if [ -f $f -a -r $f ]; then
        /bin/cp -f $f $BPATH
        sed -i "/$OLD/s/.*/$NEW/" "$f"
    else
        echo "Error: Cannot read $f"
    fi
    done

    rm $E_BR_SERVICE_PATH"/canister-ids.mo"
    mv $E_BR_SERVICE_PATH"/canister-ids_temp.mo" $E_BR_SERVICE_PATH"/canister-ids.mo"
fi

dfx build --network $E_BR_SERVICE_ENV e_br_service >/dev/null

if [ $INSTALL_MODE = "none" ]
then
    dfx canister install e_br_service --network $E_BR_SERVICE_ENV --argument '(
        record {
            admins = vec {
                principal "'$ADMINS_PRINCIPAL_0'";
                principal "'$ADMINS_PRINCIPAL_1'"
            };
            auth = vec {
                principal "'$AUTH_PRINCIPAL_0'";
            };
            turnManagers = vec {
                principal "'$TURN_MANAGER_PRINCIPAL_0'";
            };
            allowList = opt vec {
                principal "'$ALLOW_PRINCIPAL_0'";
                principal "'$ALLOW_PRINCIPAL_1'"
            };
            environment = "'$E_BR_SERVICE_ENV'"
        }
    )' >/dev/null
else
    dfx canister install --mode $INSTALL_MODE --network local e_br_service --argument '(
        record {
            admins = vec {
                principal "'$ADMINS_PRINCIPAL_0'";
                principal "'$ADMINS_PRINCIPAL_1'"
            };
            auth = vec {
                principal "'$AUTH_PRINCIPAL_0'";
            }; 
            turnManagers = vec {
                principal "'$TURN_MANAGER_PRINCIPAL_0'";
            };
            allowList = opt vec {
                principal "'$ALLOW_PRINCIPAL_0'";
                principal "'$ALLOW_PRINCIPAL_1'"
            };
            environment = "'$E_BR_SERVICE_ENV'"
        }
    )' >/dev/null
fi

dfx generate e_br_service >/dev/null