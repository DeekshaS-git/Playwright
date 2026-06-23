Feature: Amazon Product Search

  Scenario Outline: Search for a product
    Given User is on the homepage
    When User searches for "<product>"
    Then Search results for "<product>" should be displayed

    Examples:
      | product        |
      | iPhone 15      |
      | Samsung Galaxy |
      | OnePlus        |