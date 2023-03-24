// Define the ticket types and their prices
export const TICKET_TYPES = {
  INFANT: 0,
  CHILD: 10,
  ADULT: 20,
};

// Define the maximum number of tickets that can be purchased at a time
const MAX_TICKETS_PER_PURCHASE = 20;

// Define the TicketService interface
class TicketService {
  constructor(paymentService, seatReservationService) {
    this.paymentService = paymentService;
    this.seatReservationService = seatReservationService;
  }

  buyTickets(accountId, ticketTypeRequests) {
    // Validate the accountId and ticketTypeRequests
    if (accountId === 0 || accountId < 0 || accountId === "") {
      throw new Error("Invalid Account ID");
      // console.log("error");
    }
    if (!Array.isArray(ticketTypeRequests) || ticketTypeRequests.length === 0) {
      throw new Error("Invalid Ticket Requests");
    }

    // Calculate the total cost of the tickets
    let totalCost = 0;
    let totalSeatsToAllocate = 0;
    let adultCount = 0;
    let childCount = 0;
    let infantCount = 0;

    for (const ticketTypeRequest of ticketTypeRequests) {
      const { ticketType, quantity } = ticketTypeRequest;

      if (
        !Object.values(TICKET_TYPES).includes(ticketType) ||
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {
        throw new Error("Invalid Ticket Requests");
      }

      if (ticketType === TICKET_TYPES.ADULT) {
        adultCount += quantity;
      } else if (ticketType === TICKET_TYPES.CHILD) {
        childCount += quantity;
      } else if (ticketType === TICKET_TYPES.INFANT) {
        infantCount += quantity;
      }

      totalCost += ticketType * quantity;
      totalSeatsToAllocate += quantity - infantCount;
    }

    // Validate the total number of tickets
    const totalTickets = adultCount + childCount + infantCount;
    if (totalTickets > MAX_TICKETS_PER_PURCHASE) {
      throw new Error("Cannot buy more than 20 tickets");
      // console.log("Should throw an error");
    }

    if (adultCount === 0 && totalTickets > 0) {
      throw new Error(
        "Child and Infant tickets cannot be purchased without purchasing an Adult ticket"
      );
    }

    // Make a payment request to the TicketPaymentService
    this.paymentService.makePayment(accountId, totalCost);

    // Make a seat reservation request to the SeatReservationService
    this.seatReservationService.reserveSeats(accountId, totalSeatsToAllocate);
  }
}

// module.exports = TicketService;
export default TicketService;

// Define a sample TicketPaymentService implementation
class TicketPaymentService {
  makePayment(accountId, amount) {
    console.log(`Processing payment of ${amount} for account ${accountId}`);
  }
}

// Define a sample SeatReservationService implementation
class SeatReservationService {
  reserveSeats(accountId, totalSeats) {
    console.log(
      `Total seats to reserve ${totalSeats} for account ${accountId}`
    );
  }
}

// Sample usage
const paymentService = new TicketPaymentService();
const seatReservationService = new SeatReservationService();
const ticketService = new TicketService(paymentService, seatReservationService);

try {
  ticketService.buyTickets(1, [
    { ticketType: TICKET_TYPES.ADULT, quantity: 11 },
    { ticketType: TICKET_TYPES.CHILD, quantity: 5 },
    { ticketType: TICKET_TYPES.INFANT, quantity: 2 },
  ]);
} catch (error) {
  console.error(error.message);
}
