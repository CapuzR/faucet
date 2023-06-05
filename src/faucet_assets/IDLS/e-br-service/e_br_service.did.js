export const idlFactory = ({ IDL }) => {
  const DetailValue = IDL.Rec();
  const InitOptions = IDL.Record({
    'turnManagers' : IDL.Vec(IDL.Principal),
    'auth' : IDL.Vec(IDL.Principal),
    'admins' : IDL.Vec(IDL.Principal),
    'environment' : IDL.Text,
    'allowList' : IDL.Opt(IDL.Vec(IDL.Principal)),
  });
  const Tokens = IDL.Record({ 'e8s' : IDL.Nat64 });
  const BlockHeight = IDL.Nat64;
  const Error = IDL.Variant({
    'InvalidAccount' : IDL.Text,
    'TxTooOld' : IDL.Record({ 'allowed_window_nanos' : IDL.Nat64 }),
    'InvalidDetails' : IDL.Null,
    'NotPlayersTurn' : IDL.Null,
    'InvalidAmount' : IDL.Null,
    'TransferError' : IDL.Null,
    'NotInMatch' : IDL.Null,
    'AlreadyJoined' : IDL.Null,
    'NotFound' : IDL.Null,
    'NotAuthorized' : IDL.Null,
    'InvalidAID' : IDL.Null,
    'BadFee' : IDL.Record({ 'expected_fee' : Tokens }),
    'InvalidToken' : IDL.Null,
    'BadParameters' : IDL.Null,
    'AlreadyVerified' : IDL.Text,
    'AlreadyExists' : IDL.Null,
    'AlreadyPlaying' : IDL.Null,
    'InvalidInvoiceId' : IDL.Null,
    'Unknown' : IDL.Text,
    'TxDuplicate' : IDL.Record({ 'duplicate_of' : BlockHeight }),
    'NonExistentCanister' : IDL.Null,
    'NotYetPaid' : IDL.Text,
    'NonExistentItem' : IDL.Null,
    'TxCreatedInFuture' : IDL.Null,
    'Expired' : IDL.Null,
    'InsufficientFunds' : IDL.Record({ 'balance' : Tokens }),
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : Error });
  const MatchSettings = IDL.Record({
    'maxNumRounds' : IDL.Nat,
    'pointsPerMatch' : IDL.Record({ 'winner' : IDL.Nat, 'looser' : IDL.Nat }),
    'fees' : IDL.Record({ 'bR' : IDL.Nat, 'network' : IDL.Nat }),
    'matchMaxBet' : IDL.Nat,
    'turnMinBet' : IDL.Nat,
    'minNumRounds' : IDL.Nat,
    'maxNumPlayers' : IDL.Nat,
    'minNumPlayers' : IDL.Nat,
    'matchMinBet' : IDL.Nat,
  });
  const MatchPlayerStatus = IDL.Variant({
    'Fold' : IDL.Null,
    'Active' : IDL.Null,
    'MatchClosed' : IDL.Null,
    'Banned' : IDL.Null,
    'Winner' : IDL.Null,
    'Looser' : IDL.Null,
    'MultipleMatches' : IDL.Null,
    'TimeBanned' : IDL.Null,
    'Exited' : IDL.Null,
  });
  const MatchPlayerStats = IDL.Record({
    'accumulatedBet' : IDL.Nat,
    'status' : MatchPlayerStatus,
    'joinPosition' : IDL.Nat,
    'lost' : IDL.Nat,
    'invoiceId' : IDL.Text,
    'earned' : IDL.Nat,
    'matchId' : IDL.Text,
    'position' : IDL.Nat,
    'points' : IDL.Nat,
    'playerPrincipal' : IDL.Principal,
  });
  const MatchStatus = IDL.Variant({
    'OnHold' : IDL.Null,
    'Playing' : IDL.Null,
    'Finished' : IDL.Null,
    'Cancelled' : IDL.Null,
  });
  const TokenSymbol = IDL.Text;
  const Details = IDL.Record({
    'meta' : IDL.Vec(IDL.Nat8),
    'description' : IDL.Text,
  });
  const Match = IDL.Record({
    'id' : IDL.Text,
    'pot' : IDL.Nat,
    'accumulatedBet' : IDL.Nat,
    'status' : MatchStatus,
    'currentPlayer' : IDL.Opt(IDL.Principal),
    'currentRound' : IDL.Nat,
    'createdBy' : IDL.Principal,
    'createdOn' : IDL.Int,
    'minBet' : IDL.Nat,
    'roundOpener' : IDL.Principal,
    'tokenSymbol' : TokenSymbol,
    'updatedOn' : IDL.Int,
    'details' : IDL.Opt(Details),
    'maxNumPlayers' : IDL.Nat,
    'maxBet' : IDL.Nat,
    'currentBet' : IDL.Nat,
    'rounds' : IDL.Nat,
    'joinedPlayersQty' : IDL.Nat,
  });
  const PlayerStats__1 = IDL.Record({
    'matchesLost' : IDL.Nat,
    'lost' : IDL.Nat,
    'earned' : IDL.Nat,
    'matchesWon' : IDL.Nat,
    'points' : IDL.Nat,
  });
  const UserBasics = IDL.Record({
    'about' : IDL.Opt(IDL.Text),
    'username' : IDL.Text,
    'displayName' : IDL.Opt(IDL.Text),
    'avatarUrl' : IDL.Opt(IDL.Text),
    'lastName' : IDL.Opt(IDL.Text),
    'firstName' : IDL.Opt(IDL.Text),
  });
  DetailValue.fill(
    IDL.Variant({
      'I64' : IDL.Int64,
      'U64' : IDL.Nat64,
      'Vec' : IDL.Vec(DetailValue),
      'Slice' : IDL.Vec(IDL.Nat8),
      'Text' : IDL.Text,
      'True' : IDL.Null,
      'False' : IDL.Null,
      'Float' : IDL.Float64,
      'Principal' : IDL.Principal,
    })
  );
  const User = IDL.Record({
    'userBasics' : UserBasics,
    'createdOn' : IDL.Int,
    'updatedOn' : IDL.Int,
    'details' : IDL.Vec(IDL.Tuple(IDL.Text, DetailValue)),
    'points' : IDL.Nat,
  });
  const TokenVerbose = IDL.Record({
    'decimals' : IDL.Int,
    'meta' : IDL.Opt(IDL.Record({ 'Issuer' : IDL.Text })),
    'symbol' : IDL.Text,
  });
  const Time = IDL.Int;
  const Payment = IDL.Record({
    'currentRound' : IDL.Nat,
    'paid' : IDL.Bool,
    'verifiedAtTime' : IDL.Opt(Time),
    'amount' : IDL.Nat,
  });
  const AccountIdentifier = IDL.Variant({
    'principal' : IDL.Principal,
    'blob' : IDL.Vec(IDL.Nat8),
    'text' : IDL.Text,
  });
  const Invoice = IDL.Record({
    'id' : IDL.Text,
    'isPaidToPlayer' : IDL.Bool,
    'token' : TokenVerbose,
    'paidToPlayer' : IDL.Nat,
    'toPlayerPaymentBlockHeight' : BlockHeight,
    'payments' : IDL.Opt(IDL.Vec(Payment)),
    'createdBy' : IDL.Principal,
    'createdOn' : Time,
    'amountPaid' : IDL.Nat,
    'playerPaymentBlockHeight' : BlockHeight,
    'updatedOn' : Time,
    'matchId' : IDL.Text,
    'expiration' : Time,
    'isPaidByPlayer' : IDL.Bool,
    'details' : IDL.Opt(Details),
    'paidByPlayer' : IDL.Nat,
    'matchPlayerAID' : AccountIdentifier,
    'paidToPlayerVerifiedAtTime' : IDL.Opt(Time),
    'amount' : IDL.Nat,
    'paidByPlayerVerifiedAtTime' : IDL.Opt(Time),
  });
  const ErrorLogType = IDL.Variant({
    'TransferToMatch' : IDL.Null,
    'PayToWinner' : IDL.Null,
    'EPaymentMismatch' : IDL.Null,
    'UpdateInvoice' : IDL.Text,
    'PayToElementum' : IDL.Null,
    'CheckPayment' : IDL.Null,
  });
  const Error__1 = IDL.Variant({
    'InvalidAccount' : IDL.Text,
    'TxTooOld' : IDL.Record({ 'allowed_window_nanos' : IDL.Nat64 }),
    'InvalidDetails' : IDL.Null,
    'NotPlayersTurn' : IDL.Null,
    'InvalidAmount' : IDL.Null,
    'TransferError' : IDL.Null,
    'NotInMatch' : IDL.Null,
    'AlreadyJoined' : IDL.Null,
    'NotFound' : IDL.Null,
    'NotAuthorized' : IDL.Null,
    'InvalidAID' : IDL.Null,
    'BadFee' : IDL.Record({ 'expected_fee' : Tokens }),
    'InvalidToken' : IDL.Null,
    'BadParameters' : IDL.Null,
    'AlreadyVerified' : IDL.Text,
    'AlreadyExists' : IDL.Null,
    'AlreadyPlaying' : IDL.Null,
    'InvalidInvoiceId' : IDL.Null,
    'Unknown' : IDL.Text,
    'TxDuplicate' : IDL.Record({ 'duplicate_of' : BlockHeight }),
    'NonExistentCanister' : IDL.Null,
    'NotYetPaid' : IDL.Text,
    'NonExistentItem' : IDL.Null,
    'TxCreatedInFuture' : IDL.Null,
    'Expired' : IDL.Null,
    'InsufficientFunds' : IDL.Record({ 'balance' : Tokens }),
  });
  const ErrorLog = IDL.Record({
    'player' : IDL.Principal,
    'kind' : ErrorLogType,
    'createdOn' : Time,
    'invoiceId' : IDL.Text,
    'error' : Error__1,
    'matchId' : IDL.Text,
  });
  const ErrorQty = IDL.Record({
    'updateInvoicePWError' : IDL.Nat,
    'transferToMatchError' : IDL.Nat,
    'checkPaymentError' : IDL.Nat,
    'payToElementumError' : IDL.Nat,
    'payToWinnerError' : IDL.Nat,
    'updateInvoiceTMError' : IDL.Nat,
  });
  const GroupedData = IDL.Record({
    'externalInternalMatchIdEntries' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
    'usernamePpal' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Principal)),
    'turnManagers' : IDL.Vec(IDL.Principal),
    'userInvoiceEntries' : IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Text)),
    'auth' : IDL.Vec(IDL.Principal),
    'assetCanisterIds' : IDL.Vec(IDL.Principal),
    'matchSettings' : MatchSettings,
    'matchPlayerStatsEntries' : IDL.Vec(
      IDL.Tuple(IDL.Text, IDL.Principal, MatchPlayerStats)
    ),
    'matches' : IDL.Vec(IDL.Tuple(IDL.Text, Match)),
    'playerStats' : IDL.Vec(IDL.Tuple(IDL.Principal, PlayerStats__1)),
    'admins' : IDL.Vec(IDL.Principal),
    'users' : IDL.Vec(IDL.Tuple(IDL.Principal, User)),
    'invoices' : IDL.Vec(IDL.Tuple(IDL.Text, Invoice)),
    'allowList' : IDL.Opt(IDL.Vec(IDL.Principal)),
    'activePlayerMatches' : IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Text)),
    'errorLog' : IDL.Vec(ErrorLog),
    'errorQty' : ErrorQty,
    'matchInvoiceEntries' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
  });
  const Result_8 = IDL.Variant({ 'ok' : GroupedData, 'err' : Error__1 });
  const Result_9 = IDL.Variant({
    'ok' : IDL.Vec(
      IDL.Record({
        'invoiceId' : IDL.Text,
        'isPaid' : IDL.Bool,
        'amount' : IDL.Nat,
      })
    ),
    'err' : Error,
  });
  const MatchInit = IDL.Record({
    'minBet' : IDL.Nat,
    'tokenSymbol' : TokenSymbol,
    'details' : IDL.Opt(Details),
    'maxNumPlayers' : IDL.Nat,
    'maxBet' : IDL.Nat,
    'rounds' : IDL.Nat,
    'externalMatchId' : IDL.Text,
  });
  const MatchInvoice = IDL.Record({
    'accountId' : AccountIdentifier,
    'invoiceId' : IDL.Text,
  });
  const Result_2 = IDL.Variant({ 'ok' : MatchInvoice, 'err' : Error });
  const EndMatchPlayerStats = IDL.Record({
    'principal' : IDL.Principal,
    'position' : IDL.Nat,
    'points' : IDL.Nat,
  });
  const BetOptions = IDL.Variant({
    'Call' : IDL.Null,
    'Fold' : IDL.Null,
    'AllInRaise' : IDL.Record({ 'amountBet' : IDL.Nat }),
    'Raise' : IDL.Record({ 'amountBet' : IDL.Nat }),
    'Check' : IDL.Null,
    'AllInCall' : IDL.Record({ 'amountBet' : IDL.Nat }),
  });
  const TurnInit = IDL.Variant({
    'OpenRound' : BetOptions,
    'OpenPot' : BetOptions,
    'RegularTurn' : BetOptions,
    'ForcedExit' : IDL.Record({
      'text' : IDL.Text,
      'detail' : IDL.Variant({
        'LeaveGame' : IDL.Null,
        'MatchClosed' : IDL.Null,
        'Banned' : IDL.Null,
        'TimeLimit' : IDL.Null,
        'MultipleMatches' : IDL.Null,
      }),
    }),
  });
  const Result_7 = IDL.Variant({
    'ok' : IDL.Opt(IDL.Vec(IDL.Principal)),
    'err' : Error,
  });
  const ContractInfo = IDL.Record({
    'heapSize' : IDL.Nat,
    'maxLiveSize' : IDL.Nat,
    'cycles' : IDL.Nat,
    'details' : IDL.Vec(IDL.Tuple(IDL.Text, DetailValue)),
    'memorySize' : IDL.Nat,
  });
  const Result_6 = IDL.Variant({ 'ok' : ContractInfo, 'err' : Error });
  const Result_5 = IDL.Variant({ 'ok' : IDL.Vec(ErrorLog), 'err' : Error });
  const PlayerStats = IDL.Record({
    'matchesLost' : IDL.Nat,
    'lost' : IDL.Nat,
    'earned' : IDL.Nat,
    'matchesWon' : IDL.Nat,
    'points' : IDL.Nat,
  });
  const Result_4 = IDL.Variant({ 'ok' : PlayerStats, 'err' : Error });
  const Result_3 = IDL.Variant({ 'ok' : IDL.Bool, 'err' : Error });
  const TurnInit__1 = IDL.Variant({
    'OpenRound' : BetOptions,
    'OpenPot' : BetOptions,
    'RegularTurn' : BetOptions,
    'ForcedExit' : IDL.Record({
      'text' : IDL.Text,
      'detail' : IDL.Variant({
        'LeaveGame' : IDL.Null,
        'MatchClosed' : IDL.Null,
        'Banned' : IDL.Null,
        'TimeLimit' : IDL.Null,
        'MultipleMatches' : IDL.Null,
      }),
    }),
  });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Null, 'err' : Error__1 });
  const anon_class_36_1 = IDL.Service({
    'addNewAdmin' : IDL.Func([IDL.Vec(IDL.Principal)], [Result], []),
    'addNewAuth' : IDL.Func([IDL.Vec(IDL.Principal)], [Result], []),
    'addNewTurnManager' : IDL.Func([IDL.Vec(IDL.Principal)], [Result], []),
    'allowUsers' : IDL.Func([IDL.Vec(IDL.Principal)], [Result], []),
    'backup' : IDL.Func([], [Result_8], []),
    'backupMatches' : IDL.Func([IDL.Nat, IDL.Nat], [Result_8], []),
    'checkPayments' : IDL.Func([], [Result_9], []),
    'createMatch' : IDL.Func([MatchInit], [Result_2], []),
    'endMatch' : IDL.Func(
        [IDL.Text, IDL.Vec(EndMatchPlayerStats), IDL.Nat],
        [Result],
        [],
      ),
    'forcedExit' : IDL.Func([IDL.Principal, IDL.Text, TurnInit], [Result], []),
    'freePlayerFromMatch' : IDL.Func([IDL.Principal], [Result], []),
    'freePlayers' : IDL.Func([], [Result], []),
    'freePlayersFromMatch' : IDL.Func([IDL.Text], [Result], []),
    'fullBackup' : IDL.Func([], [Result_8], []),
    'getAllowedUsers' : IDL.Func([], [Result_7], ['query']),
    'getCanisterInfo' : IDL.Func([], [ContractInfo], ['query']),
    'getDetailedCanisterInfo' : IDL.Func([], [Result_6], []),
    'getLogsAndClean' : IDL.Func([], [Result_5], []),
    'getPStatsOrderedByPoints' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Principal, PlayerStats))],
        ['query'],
      ),
    'getPlayerStats' : IDL.Func([IDL.Principal], [Result_4], ['query']),
    'isCallerAllowed' : IDL.Func([], [IDL.Bool], []),
    'isUserAllowed' : IDL.Func([IDL.Principal], [Result_3], []),
    'joinMatch' : IDL.Func([IDL.Text], [Result_2], []),
    'matchForcedClose' : IDL.Func([IDL.Text, TurnInit__1], [Result_1], []),
    'name' : IDL.Func([], [IDL.Text], ['query']),
    'removeAllowedUsers' : IDL.Func([IDL.Vec(IDL.Principal)], [Result], []),
    'startMatch' : IDL.Func([IDL.Text], [Result], []),
    'turnExec' : IDL.Func([TurnInit], [Result], []),
    'wallet_balance' : IDL.Func([], [IDL.Nat], []),
    'wallet_receive' : IDL.Func(
        [],
        [IDL.Record({ 'accepted' : IDL.Nat64 })],
        [],
      ),
  });
  return anon_class_36_1;
};
export const init = ({ IDL }) => {
  const InitOptions = IDL.Record({
    'turnManagers' : IDL.Vec(IDL.Principal),
    'auth' : IDL.Vec(IDL.Principal),
    'admins' : IDL.Vec(IDL.Principal),
    'environment' : IDL.Text,
    'allowList' : IDL.Opt(IDL.Vec(IDL.Principal)),
  });
  return [InitOptions];
};
