Feature: E-commerce Transaction

  As a customer
  I want to able to add items to the cart
  So I can checkout the items with or without logged in to the website

  Scenario: Successful Transaction without logged in to the website (Guest User)
    Given the user logged in with the following data:
      | email    | guest |
      | password |       |
    When the user puts the following items into the cart:
      | ProductName | Size | Color  | Qty |
      | Radiant Tee | XS   | Blue   | 1   |
      | Maya Tunic  | S    | White  | 1   |
      | Bella Tank  | M    | Orange | 1   |
    And the user is navigating to the checkout page
    And the user is selecting "Best Way" Shipping option
    And the user is filling checkout data with the following data:
      | Email       | ahmad@mail.com   |
      | FirstName   | Ahmad            |
      | LastName    | Ubaidillah       |
      | Address     | 499 Jefferson St |
      | City        | San Francisco    |
      | State       | California       |
      | Zip         | 94109            |
      | PhoneNumber | 4154475000       |
    Then the items in the checkout page should be correct
    And the items in the payment page should be correct
    And the address should be same with the checkout data
    And the order should be successful


  Scenario: Successful Transaction with logged in to the website (Registered Customer)
    Given the user logged in with the following data:
      | email    | gerardo.kling40@ethereal.email |
      | password | kzPAz94%23*YtJ                 |
    When the user puts the following items into the cart:
      | ProductName | Size | Color  | Qty |
      | Radiant Tee | XS   | Blue   | 1   |
      | Maya Tunic  | S    | White  | 1   |
      | Bella Tank  | M    | Orange | 1   |
    And the user is navigating to the checkout page
    And the user is selecting "Best Way" Shipping option
    Then the items in the checkout page should be correct
    And the items in the payment page should be correct
    And the address should be same with the checkout data
    And the order should be successful
    And the items in the order page should be correct
    And the address should be same with the checkout data

