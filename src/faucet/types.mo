module {

    public type Token = {
        #FICP;
        #FT20;
        #FEXT;
        #FBTC;
    };

    public type Error = {
        #NotAuthorized;
        #NonExistentItem;
        #BadParameters;
        #Unknown : Text;
    };

    public type Options = {
        ficp : Option;
        fext : Option;
        ft20 : Option;
        fbtc : Option;
    };

    public type Option = {
        canId : Text;
        baseAmount : Nat64;
        baseFee : Nat64;
    };

    //ICP Ledger Send Types

    public type SendArgs = {
        memo: Memo;
        amount: ICPTs;
        fee: ICPTs;
        from_subaccount: ?SubAccount;
        to: AccountIdentifier;
        created_at_time: ?TimeStamp;
    };

    public type TransferResult = {
        #Ok : BlockHeight;
        #Err : TransferError;
    };

    public type TransferArgs = {
        memo: Memo;
        amount: ICPTs;
        fee: ICPTs;
        from_subaccount: ?SubAccount;
        to: Blob;
        created_at_time: ?TimeStamp;
    };

    type Tokens = {
        e8s : Nat64;
    };

    type TransferError = {
        // The fee that the caller specified in the transfer request was not the one that ledger expects.
        // The caller can change the transfer fee to the `expected_fee` and retry the request.
        #BadFee : { expected_fee : Tokens; };
        // The account specified by the caller doesn't have enough funds.
        #InsufficientFunds : { balance: Tokens; };
        // The request is too old.
        // The ledger only accepts requests created within 24 hours window.
        // This is a non-recoverable error.
        #TxTooOld : { allowed_window_nanos: Nat64 };
        // The caller specified `created_at_time` that is too far in future.
        // The caller can retry the request later.
        #TxCreatedInFuture;
        // The ledger has already executed the request.
        // `duplicate_of` field is equal to the index of the block containing the original transaction.
        #TxDuplicate : { duplicate_of: BlockHeight; }
    };
    // Height of a ledger block.
    public type BlockHeight = Nat64;

    // A number associated with a transaction.
    // Can be set by the caller in `send` call as a correlation identifier.
    public type Memo = Nat64;

    // Account identifier encoded as a 64-byte ASCII hex string.
    public type AccountIdentifier = Text;

    // Subaccount is an arbitrary 32-byte byte array.
    public type SubAccount = Blob;

    public type ICPTs = {
        e8s : Nat64;
    };

    // Number of nanoseconds from the UNIX epoch in UTC timezone.
    public type TimeStamp = {
        timestamp_nanos: Nat64;
    };

};
