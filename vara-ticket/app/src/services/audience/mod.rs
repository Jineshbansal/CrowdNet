use super::{common::Storage, funds::FundService};
use funcs::{cancel_and_refund, check_in, purchase_ticket, transfer};
use sails_rs::{
    gstd::{exec, msg},
    prelude::*,
};

pub mod funcs;

#[derive(Clone)]
pub struct AudienceService {
    pub funds: FundService,
}

#[sails_rs::service(extends = FundService)]
impl AudienceService {
    pub fn new() -> Self {
        Self {
            funds: FundService::new(),
        }
    }

    pub fn purchase_ticket(&mut self, ticket_count: u8, event_id: u32) -> bool {
        let audience = Storage::get_audience();
        purchase_ticket((ticket_count, event_id, msg::source()), audience);
        self.funds.purchase_ticket(event_id, ticket_count)
    }

    pub fn cancel_and_refund(&mut self, ticket_count: u8, event_id: u32) -> bool {
        let audience = Storage::get_audience();
        cancel_and_refund((ticket_count, event_id, msg::source()), audience);

        let mut price = U256::from(0);
        self.funds.get_ticket_prices().iter().for_each(|x| {
            if x.0 == event_id {
                price = x.1;
            }
        });

        self.funds.vft.transfer(
            exec::program_id(),
            msg::source(),
            U256::from(ticket_count) * price,
        )
    }

    pub fn transfer_ticket(&self, ticket_count: u8, event_id: u32, transfer_id: ActorId) -> bool {
        transfer(
            (ticket_count, event_id, msg::source(), transfer_id),
            Storage::get_audience(),
        )
    }

    pub fn check_in(&self, ticket_count: u8, event_id: u32) -> bool {
        check_in(
            (ticket_count, event_id, msg::source()),
            &mut Storage::get_audience(),
        )
    }
}

impl AsRef<FundService> for AudienceService {
    fn as_ref(&self) -> &FundService {
        &self.funds
    }
}
