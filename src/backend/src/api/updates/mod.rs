use ic_cdk::update;
use crate::{ state, types::users::AddUserArgs };

#[update]
pub fn create_user(args: AddUserArgs) -> Result<String, String> {
    return state::add_user(args);
}

#[update]
pub fn update_user(args: AddUserArgs) -> Result<(), String> {
    return state::update_user(args);
}

#[update]
pub fn delete_user() {
    state::remove_user()
}
