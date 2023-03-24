import TicketService from "../src/pairtest/TicketService.js";
// const TicketService = require("../src/pairtest/TicketService.js");

const paymentService = {
  makePayment: jest.fn(),
};

const seatReservationService = {
  reserveSeats: jest.fn(),
};

const ticketService = new TicketService(paymentService, seatReservationService);

describe("TicketService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("buyTickets", () => {
    it("should throw an error for invalid account ID", () => {
      expect(() => ticketService.buyTickets("", [])).toThrow(
        "Invalid Account ID"
      );
      expect(() => ticketService.buyTickets(0, [])).toThrow(
        "Invalid Account ID"
      );
      expect(() => ticketService.buyTickets(-1, [])).toThrow(
        "Invalid Account ID"
      );
    });

    it("should throw an error for too many tickets", () => {
      expect(() =>
        ticketService.buyTickets(1, [
          { ticketType: 20, quantity: 10 },
          { ticketType: 10, quantity: 11 },
        ])
      ).toThrow("Cannot buy more than 20 tickets");
    });

    it("should throw an error for child and infant tickets without adult ticket", () => {
      expect(() =>
        ticketService.buyTickets(1, [
          { ticketType: 10, quantity: 5 },
          { ticketType: 0, quantity: 2 },
        ])
      ).toThrow(
        "Child and Infant tickets cannot be purchased without purchasing an Adult ticket"
      );
    });

    it("should make payment and seat reservation requests for valid input", () => {
      ticketService.buyTickets(1, [
        { ticketType: 20, quantity: 2 },
        { ticketType: 10, quantity: 3 },
        { ticketType: 0, quantity: 1 },
      ]);

      expect(paymentService.makePayment).toHaveBeenCalledWith(1, 70);
      expect(seatReservationService.reserveSeats).toHaveBeenCalledWith(1, 5);
    });

    it("should make payment and seat reservation requests for valid input with only adult and child tickets", () => {
      ticketService.buyTickets(1, [{ ticketType: 20, quantity: 3 }]);

      expect(paymentService.makePayment).toHaveBeenCalledWith(1, 60);
      expect(seatReservationService.reserveSeats).toHaveBeenCalledWith(1, 3);
    });
    it("should throw an error for invalid ticket request", () => {
      expect(() =>
        ticketService.buyTickets(1, [
          { ticketType: 10, quantity: 5.2 },
          { ticketType: 0, quantity: 2 },
        ])
      ).toThrow("Invalid Ticket Requests");
    });
  });
});
