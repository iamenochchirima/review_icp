use ic_cdk::{api::msg_caller, query};
use candid::Principal;

use crate::{state, types::User};

#[query]
pub fn get_user(principal: Principal) -> Option<User> {
    state::get_user(principal)
}

#[query]
pub fn get_current_user() -> Option<User> {
    let caller = msg_caller();
    state::get_user(caller)
}

#[query]
pub fn get_users(page: u32, limit: u32) -> Vec<User> {
    state::get_users(page, limit)
}

#[query]
pub fn get_user_count() -> u64 {
    state::get_user_count()
}
