export const idlFactory = ({ IDL }) => {
  const Option = IDL.Record({
    'baseFee' : IDL.Nat64,
    'canId' : IDL.Text,
    'baseAmount' : IDL.Nat64,
  });
  const Options = IDL.Record({
    'fbtc' : Option,
    'fext' : Option,
    'ficp' : Option,
    'ft20' : Option,
  });
  const Error = IDL.Variant({
    'NotAuthorized' : IDL.Null,
    'BadParameters' : IDL.Null,
    'Unknown' : IDL.Text,
    'NonExistentItem' : IDL.Null,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : Error });
  const Token = IDL.Variant({
    'FBTC' : IDL.Null,
    'FEXT' : IDL.Null,
    'FICP' : IDL.Null,
    'FT20' : IDL.Null,
  });
  const BlockHeight = IDL.Nat64;
  const Result_1 = IDL.Variant({ 'ok' : BlockHeight, 'err' : Error });
  const Options__1 = IDL.Record({
    'fbtc' : Option,
    'fext' : Option,
    'ficp' : Option,
    'ft20' : Option,
  });
  const anon_class_12_1 = IDL.Service({
    'addAuthorize' : IDL.Func([IDL.Vec(IDL.Principal)], [Result], []),
    'claim' : IDL.Func([Token, IDL.Opt(IDL.Vec(IDL.Nat8))], [Result_1], []),
    'readTokenOptions' : IDL.Func([], [Options__1], ['query']),
    'updateTokenOptions' : IDL.Func([Token, Options__1], [Result], []),
  });
  return anon_class_12_1;
};
export const init = ({ IDL }) => {
  const Option = IDL.Record({
    'baseFee' : IDL.Nat64,
    'canId' : IDL.Text,
    'baseAmount' : IDL.Nat64,
  });
  const Options = IDL.Record({
    'fbtc' : Option,
    'fext' : Option,
    'ficp' : Option,
    'ft20' : Option,
  });
  return [Options];
};
