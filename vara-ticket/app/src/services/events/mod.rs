use super::{
    audience::AudienceService,
    common::{Event, Storage},
    funds::FundStorage,
};
use funcs::{cancel_event, create_event, finish_event, update_event};
use sails_rs::{
    gstd::{exec, msg},
    prelude::*,
};
pub mod funcs;

// Host can create event, update event and cancel event
// TODO! If we implement ERC20 minting, can also add a withdraw funds functionality for the host

pub struct EventService {
    pub audience: AudienceService,
}

#[sails_rs::service(extends = AudienceService)]
// TODO! Events implementation
impl EventService {
    pub fn new() -> Self {
        Self {
            audience: AudienceService::new(),
        }
    }

    pub fn create_event(&mut self, event_details: (u32,String, String, String, String, U256)) -> bool {
        let events = Storage::get_events();
        let event = Event {
            event_id: event_details.0,
            name: event_details.1,
            venue: event_details.2,
            time: event_details.3,
            description: event_details.4,
            initial_price: event_details.5,
        };
        create_event(&msg::source(), event, events);

        self.audience.funds.create_event()
    }

    pub fn update_event(&mut self, event_details: (u32, String, String, String, U256)) -> bool {
        let events = Storage::get_events();
        let new_event = Event {
            event_id: event_details.0,
            name: event_details.1,
            venue: event_details.2,
            time: event_details.3,
            description: event_details.4,
            initial_price: event_details.5,
        };

        update_event(&msg::source(), new_event, events)
    }

    pub fn cancel_event(&mut self, event_id: u32) -> bool {
        let events = Storage::get_events();
        let audience = Storage::get_audience();
        let interactions = Storage::get_interactions();

        FundStorage::get_prices().remove_entry(&event_id);

        // Audience and funds
        if let Some(list) = audience.get_mut(&event_id) {
            for audience_list in list.iter() {
                // Turn by turn remove these audiences and refund their money

                self.audience.funds.vft.transfer(
                    exec::program_id(),
                    audience_list.0,
                    audience_list.1,
                );
            }
            list.clear();
        }

        // Interactions
        interactions.remove_entry(&event_id);

        // Events
        cancel_event(&msg::source(), event_id, events);

        self.audience.funds.cancel_event()
    }

    pub fn finish_event(&mut self, host_id: ActorId, event_id: u32) -> bool {
        let events = Storage::get_events();
        let audience = Storage::get_audience();
        let interactions = Storage::get_interactions();

        FundStorage::get_prices().remove_entry(&event_id);

        // Audience and funds to host
        if let Some(list) = audience.get_mut(&event_id) {
            // turn by turn remove these audiences and send their money

            for audience_list in list.iter() {
                self.audience
                    .funds
                    .vft
                    .transfer(exec::program_id(), host_id, audience_list.1);
            }
            list.clear();
        }

        // Interactions
        interactions.remove_entry(&event_id);

        // Events
        finish_event(&host_id, event_id, events)
    }
}

impl AsRef<AudienceService> for EventService {
    fn as_ref(&self) -> &AudienceService {
        &self.audience
    }
}
