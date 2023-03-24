Feature: Ticket Purchase

  As a user
  I want to purchase tickets for an show
  So that I can attend the show

  Scenario: Purchase tickets successfully
    Given I have a valid account ID
    And I want to buy the following tickets:
      | Ticket Type | Quantity |
      | Adult       | 2        |
      | Child       | 1        |
    When I buy the tickets
    Then I should see "Processing payment" message
    And I should see "Total seats to reserve" message

  Scenario: Purchase too many tickets
    Given I have a valid account ID
    And I want to buy the following tickets:
      | Ticket Type | Quantity |
      | Adult       | 15       |
      | Child       | 6        |
    When I try to buy the tickets
    Then I should see an error message saying "Cannot buy more than 20 tickets"

  Scenario: Purchase child or infant tickets without adult ticket
    Given I have a valid account ID
    And I want to buy the following tickets:
      | Ticket Type | Quantity |
      | Child       | 1        |
      | Infant      | 1        |
    When I try to buy the tickets
    Then I should see an error message saying "Child and Infant tickets cannot be purchased without purchasing an Adult ticket"

  Scenario: Purchase tickets with invalid account ID
    Given I have an invalid account ID
    And I want to buy the following tickets:
      | Ticket Type | Quantity |
      | Adult       | 2        |
      | Child       | 1        |
    When I try to buy the tickets
    Then I should see an error message saying "Invalid Account ID"

  Scenario: Purchase tickets with invalid ticket type or quantity
    Given I have a valid account ID
    And I want to buy the following tickets:
      | Ticket Type | Quantity |
      | Adult       | 2.5      |
      | Child       | -1       |
    When I try to buy the tickets
    Then I should see an error message saying "Invalid Ticket Type Requests"
