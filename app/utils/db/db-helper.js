import { isHex, isInt } from '../numberHelper';

function isObjectIdValid(oId) {
  return isHex(oId) && oId.length == 24;
}

function isExternalIdValid(externalId) {
  return isInt(externalId);
}

module.exports = { isObjectIdValid, isExternalIdValid };
