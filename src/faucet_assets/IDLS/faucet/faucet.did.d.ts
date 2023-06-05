import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type BlockHeight = bigint;
export type Error = { 'NotAuthorized' : null } |
  { 'BadParameters' : null } |
  { 'Unknown' : string } |
  { 'NonExistentItem' : null };
export interface Option {
  'baseFee' : bigint,
  'canId' : string,
  'baseAmount' : bigint,
}
export interface Options {
  'fbtc' : Option,
  'fext' : Option,
  'ficp' : Option,
  'ft20' : Option,
}
export interface Options__1 {
  'fbtc' : Option,
  'fext' : Option,
  'ficp' : Option,
  'ft20' : Option,
}
export type Result = { 'ok' : null } |
  { 'err' : Error };
export type Result_1 = { 'ok' : BlockHeight } |
  { 'err' : Error };
export type Token = { 'FBTC' : null } |
  { 'FEXT' : null } |
  { 'FICP' : null } |
  { 'FT20' : null };
export interface anon_class_12_1 {
  'addAuthorize' : ActorMethod<[Array<Principal>], Result>,
  'claim' : ActorMethod<[Token, [] | [Uint8Array | number[]]], Result_1>,
  'readTokenOptions' : ActorMethod<[], Options__1>,
  'updateTokenOptions' : ActorMethod<[Token, Options__1], Result>,
}
export interface _SERVICE extends anon_class_12_1 {}
