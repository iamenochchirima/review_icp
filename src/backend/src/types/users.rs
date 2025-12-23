use std::borrow::Cow;

use candid::{CandidType, Principal};
use ic_stable_structures::{Storable, storable::Bound};
use serde::{Deserialize, Serialize};

#[derive(CandidType, Clone, Serialize, Deserialize)]
pub struct User {
    pub principal: Principal,
    pub username: Option<String>,
    pub logo_url: Option<String>,
    pub neuron_id : Option<u64>,
    pub followed_topics: Vec<String>,
    pub created_at: u64,
    pub updated_at: u64,
}

impl Storable for User {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(candid::encode_one(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        candid::decode_one(&bytes).unwrap()
    }

    fn into_bytes(self) -> Vec<u8> {
        candid::encode_one(&self).unwrap()
    }

    const BOUND: Bound = Bound::Bounded {
        max_size: 2048,
        is_fixed_size: false,
    };
}

#[derive(CandidType, Clone, Serialize, Deserialize)]
pub struct AddUserArgs {
    pub username: Option<String>,
    pub logo_url: Option<String>,
    pub neuron_id : Option<u64>
}