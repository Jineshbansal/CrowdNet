#![allow(static_mut_refs)]

use sails_rs::{collections::HashMap, gstd::msg, prelude::*};

pub static mut STORAGE: Option<Storage> = None;
#[derive(Default, Debug, Clone)]
pub struct Storage {
    pub events: HashMap<ActorId, Vec<Event>>,
    pub audience: HashMap<u32, Vec<(ActorId, U256)>>,
    pub admin: Vec<ActorId>,
    pub interactions: HashMap<u32, (u32, Vec<String>)>,
    pub event_count: u32,
}

#[derive(Default, Debug, Clone, TypeInfo, Encode, Decode)]
pub struct Event {
    pub event_id: u32,
    pub name:String,
    pub venue: String,
    pub time: String,
    pub description: String,
    pub initial_price: U256,
}

impl Storage {
    pub fn get_audience() -> &'static mut HashMap<u32, Vec<(ActorId, U256)>> {
        unsafe { &mut STORAGE.as_mut().expect("Not yet initialised").audience }
    }

    pub fn get_events() -> &'static mut HashMap<ActorId, Vec<Event>> {
        unsafe { &mut STORAGE.as_mut().expect("Not yet initialised").events }
    }

    pub fn get_event_id_count() -> &'static mut u32 {
        unsafe { &mut STORAGE.as_mut().expect("Not yet initialised").event_count }
    }

    pub fn get_admin() -> &'static mut Vec<ActorId> {
        unsafe { &mut STORAGE.as_mut().expect("Not yet initialised").admin }
    }

    pub fn get_interactions() -> &'static mut HashMap<u32, (u32, Vec<String>)> {
        unsafe { &mut STORAGE.as_mut().expect("Not yet initialised").interactions }
    }
}

#[derive(Clone)]
pub struct CommonService(());

impl CommonService {
    pub fn init() -> Self {
        let admin = msg::source();
        unsafe {
            STORAGE = Some(Storage {
                events: HashMap::new(),
                audience: HashMap::new(),
                admin: vec![admin],
                interactions: HashMap::new(),
                event_count: 0,
            })
        }
        Self(())
    }

    pub fn get_mut(&mut self) -> &'static mut Storage {
        unsafe { STORAGE.as_mut().expect("Not yet initilised") }
    }

    pub fn get(&self) -> &'static Storage {
        unsafe { STORAGE.as_ref().expect("Not yet initialised") }
    }
}

#[sails_rs::service]
impl CommonService {
    pub fn new() -> Self {
        Self(())
    }

    pub fn add_admin(&mut self, addr: ActorId) -> bool {
        let admins = &mut self.get_mut().admin;
        if admins.contains(&msg::source()) && !admins.contains(&addr) {
            admins.push(addr);
            return true;
        }
        false
    }

    // TODO! did not returned all the events
    pub fn display_events(&self) -> Vec<(ActorId, Vec<Event>)> {
        let events = self.get().events.clone();
        events.into_iter().collect()
    }

    pub fn interact_like(&mut self, event_id: u32) -> bool {
        self.get_mut()
            .interactions
            .get_mut(&event_id)
            .unwrap()
            .0
            .checked_add(1)
            .expect("Overflow occured");
        true
    }

    pub fn interact_comment(&mut self, event_id: u32, comment: String) -> bool {
        self.get_mut()
            .interactions
            .get_mut(&event_id)
            .unwrap()
            .1
            .push(comment);
        true
    }

    pub fn get_event_count(&self) -> u32 {
        self.get().event_count.clone()
    }

    pub fn get_interactions(&self) -> Vec<(u32, (u32, Vec<String>))> {
        let interactions = self.get().interactions.clone();
        interactions.into_iter().collect()
    }

    pub fn get_audience(&self) -> Vec<(u32, Vec<(ActorId, U256)>)> {
        let audience = self.get().audience.clone();
        audience.into_iter().collect()
    }
}
