use sails_rs::collections::HashMap;
use sails_rs::prelude::*;

use crate::services::common::{Event, Storage};
use crate::services::funds::FundStorage;

pub fn create_event(
    host_id: &ActorId,
    event: Event,
    events: &mut HashMap<ActorId, Vec<Event>>,
) -> bool {

    let mut vec_events: Vec<Event> = vec![event.clone()];
    if let Some(list) = events.get(host_id) {
        for list_event in list {
            if list_event.event_id == event.event_id {
                vec_events.push(event);
                return false;
            }
        }
    }

    let ticket_prices = FundStorage::get_prices();
    ticket_prices.insert(event.event_id.clone(), event.initial_price);
    events.insert(*host_id, vec_events);

    *Storage::get_event_id_count() += 1;

    true
}

pub fn update_event(
    host_id: &ActorId,
    new_event: Event,
    events: &mut HashMap<ActorId, Vec<Event>>,
) -> bool {
    if let Some(list) = events.get_mut(host_id) {
        for list_event in list.iter_mut() {
            if list_event.event_id == new_event.event_id {
                *list_event = new_event;

                return true;
            }
        }
        return false;
    }
    false
}

pub fn cancel_event(
    host_id: &ActorId,
    event_id: u32,
    events: &mut HashMap<ActorId, Vec<Event>>,
) -> bool {
    // Refund all the money in the people's account
    // purge audience and interactions

    if let Some(list) = events.get_mut(host_id) {
        for (index, list_event) in list.iter().enumerate() {
            if list_event.event_id == event_id {
                list.remove(index);
                let ticket_prices = FundStorage::get_prices();
                ticket_prices.remove(&event_id);

                return true;
            }
        }
        return false;
    }
    false
}

pub fn finish_event(
    host_id: &ActorId,
    event_id: u32,
    events: &mut HashMap<ActorId, Vec<Event>>,
) -> bool {
    // Transfer all the money in the host's account
    // purge audience and interactions

    if let Some(list) = events.get_mut(host_id) {
        for (index, list_event) in list.iter().enumerate() {
            if list_event.event_id == event_id {
                list.remove(index);
                let ticket_prices = FundStorage::get_prices();
                ticket_prices.remove(&event_id);

                return true;
            }
        }
        return false;
    }
    false
}
