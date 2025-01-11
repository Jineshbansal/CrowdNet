use super::utils::{Error, Result, *};
use sails_rs::prelude::*;

pub fn allowance(allowances: &AllowancesMap, owner: ActorId, spender: ActorId) -> U256 {
    allowances
        .get(&(owner, spender))
        .cloned()
        .unwrap_or_default()
}

pub fn approve(
    allowances: &mut AllowancesMap,
    owner: ActorId,
    spender: ActorId,
    value: U256,
) -> bool {
    if owner == spender {
        return false;
    }

    let key = (owner, spender);

    if value.is_zero() {
        return allowances.remove(&key).is_some();
    }

    let prev = allowances.insert(key, value);

    prev.map(|v| v != value).unwrap_or(true)
}

pub fn balance_of(balances: &BalancesMap, owner: ActorId) -> U256 {
    balances.get(&owner).cloned().unwrap_or_default()
}

pub fn transfer(
    balances: &mut BalancesMap,
    from: ActorId,
    to: ActorId,
    value: U256,
) -> Result<bool> {
    if from == to || value.is_zero() {
        return Ok(false);
    }

    let new_from = balance_of(balances, from)
        .checked_sub(value)
        .ok_or(Error::InsufficientBalance)?;

    let new_to = balance_of(balances, to)
        .checked_add(value)
        .ok_or(Error::NumericOverflow)?;

    if !new_from.is_zero() {
        balances.insert(from, new_from);
    } else {
        balances.remove(&from);
    }

    balances.insert(to, new_to);

    Ok(true)
}

pub fn transfer_from(
    allowances: &mut AllowancesMap,
    balances: &mut BalancesMap,
    spender: ActorId,
    from: ActorId,
    to: ActorId,
    value: U256,
) -> Result<bool> {
    if spender == from {
        return transfer(balances, from, to, value);
    }

    if from == to || value.is_zero() {
        return Ok(false);
    };

    let new_allowance = allowance(allowances, from, spender)
        .checked_sub(value)
        .ok_or(Error::InsufficientAllowance)?;

    let _res = transfer(balances, from, to, value)?;
    debug_assert!(_res);

    let key = (from, spender);

    if !new_allowance.is_zero() {
        allowances.insert(key, new_allowance);
    } else {
        allowances.remove(&key);
    }

    Ok(true)
}
