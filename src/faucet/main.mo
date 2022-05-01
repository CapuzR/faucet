import AID "./utils/AccountIdentifier";
import Utils "./utils/utils";
import Blob "mo:base/Blob";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Types "./types";
import Text "mo:base/Text";
import Nat64 "mo:base/Nat64";

shared({ caller = owner }) actor class(initOptions: Types.Options) = this {

  type Options = Types.Options;
  type Token = Types.Token;
  type SendArgs = Types.SendArgs;
  type TransferArgs = Types.TransferArgs;
  type TransferResult = Types.TransferResult;
  type BlockHeight = Types.BlockHeight;
  type Error = Types.Error;
  type SubAccount = Types.SubAccount;
  
  stable var authorized : [Principal] = [owner];
  stable var options : Options = initOptions;

  public shared({caller}) func claim(token : Token, subAccount: ?[Nat8]) : async Result.Result<BlockHeight, Error> {
    
    if(Principal.isAnonymous(caller)) {
      return #err(#NotAuthorized);
    };

    switch (token){
      case (#FICP(icp)) {
        let aCActor = actor(options.ficp.canId): actor {
            transfer : shared (TransferArgs) -> async (TransferResult)
        };
        let result = await aCActor.transfer({
          to = AID.fromPrincipalToBlob(caller, subAccount);
          fee = { e8s = 0 };
          from_subaccount = null;
          created_at_time = null;
          memo = 0;
          amount = { e8s = options.ficp.baseAmount };
        });

        switch(result) {
          case (#Ok(r)) {
            return #ok(r);
          };
          case (#Err(e)) {
            switch(e) {
              case (#BadFee(f)) {
                return #err(#Unknown(Text.concat("Expected fee: ", Nat64.toText(f.expected_fee.e8s))));
              };
              case (#InsufficientFunds(i)) {
                return #err(#Unknown(Text.concat("Insufficient funds: ", Nat64.toText(i.balance.e8s))));
              };
              case (_) {
                return #err(#Unknown("Error."));
              };
            };
            return #err(#Unknown("Error"));
          };
        };
      };
      case (#FT20(ft20)) {
        #err(#Unknown("FT20 is not implemented yet"));
      };
      case (#FEXT(fext)) {
        #err(#Unknown("FEXT is not implemented yet"));
      };
      case (#FBTC(fbtc)) {
        #err(#Unknown("FBTC is not implemented yet"));
      };
    };
  };

  public shared({caller}) func updateTokenOptions (token : Token, newOptions : Options) : async Result.Result<(), Error> {
    
    if(not Utils.isAuthorized(caller, authorized)) {
      return #err(#NotAuthorized);
    };

    options := newOptions;
    #ok(());
    
  };

  public query func readTokenOptions () : async Options {
    options;
  };

  public shared({caller}) func addAuthorize (newAuthorized : [Principal]) : async Result.Result<(), Error> {

    if(not Utils.isAuthorized(caller, authorized)) {
      return #err(#NotAuthorized);
    };

    let tempBuff : Buffer.Buffer<Principal> = Buffer.Buffer(newAuthorized.size() + authorized.size());

    for (auth in authorized.vals()) {
      tempBuff.add(auth);
    };
    for (auth in newAuthorized.vals()) {
      tempBuff.add(auth);
    };

    authorized := tempBuff.toArray();

    #ok(());

  };

};
