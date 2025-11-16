use ic_cdk::api::msg_caller;
use ic_stable_structures::StableBTreeMap;
use std::cell::RefCell;
use crate::{AddUserArgs, types::users::{ User }};

use super::memory::{ get_memory, USERS_MEMORY_ID };
use candid::Principal;

thread_local! {
    static USERS: RefCell<StableBTreeMap<Principal, User, super::memory::Memory>> = RefCell::new(
        StableBTreeMap::init(get_memory(USERS_MEMORY_ID))
    );
}

pub fn add_user(args: AddUserArgs) -> Result<String, String> {
    let caller = msg_caller();
    let existing = get_user(caller);

    if existing.is_some() {
        return Err("User already exists".to_string());
    }

    let listing = User {
        principal: caller,
        username: args.username,
        logo_url: args.logo_url,
        neuron_id: args.neuron_id,
        created_at: ic_cdk::api::time(),
    };

    USERS.with(|l| {
        l.borrow_mut().insert(caller, listing);
    });

    Ok("User added successfully".to_string())
}

pub fn get_user(id: Principal) -> Option<User> {
    USERS.with(|l| l.borrow().get(&id))
}

pub fn get_users(page: u32, limit: u32) -> Vec<User> {
    USERS.with(|l| {
        l.borrow()
            .iter()
            .skip((page * limit) as usize)
            .take(limit as usize)
            .map(|entry| entry.value())
            .collect()
    })
}

pub fn update_user(args: AddUserArgs) -> Result<(), String> {
    let caller = msg_caller();
    let user = get_user(caller);

    if user.is_none() {
        return Err("User does not exist".to_string());
    }

    let mut updated_user = user.unwrap();

    updated_user.username = args.username;
    updated_user.logo_url = args.logo_url;
    updated_user.neuron_id = args.neuron_id;
    
    USERS.with(|l| {
        l.borrow_mut().insert(caller, updated_user);
    });

    Ok(())
}

pub fn remove_user() {
    let caller = msg_caller();
    USERS.with(|l| {
        l.borrow_mut().remove(&caller);
    });
}

pub fn get_user_count() -> u64 {
    USERS.with(|l| l.borrow().len())
}
