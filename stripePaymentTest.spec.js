import { test } from "@playwright/test";


//Cards from: https://stripe.com/docs/testing?testing-method=card-numbers
const cardNumbers = [
  "4242424242424242",
  "4000056655665556",
  "5555555555554444",
  "2223003122003222",
  "5200828282828210",
  "5105105105105100",
  "378282246310005",
  "371449635398431",
  "6011111111111117",
  "6011000990139424",
  "6011981111111113",
  "3056930009020004",
  "36227206271667",
  "6555900000604105",
  "3566002020360505",
  "6200000000000005",
  "6200000000000047",
  "6205500000000000004",
  "4000002500001001",
  "5555552500001001",
  "4000050360000001",
  "5555050360000080",
  "4242424242424242",
  "4000000320000021",
  "4000000760000002",
  "4000001240000000",
  "4000004840008001",
  "4000007840000001",
  "5200007840000022",
  "4000000400000008",
  "4000000560000004",
  "4000001000000000",
  "4000001120000005",
  "4000001910000009",
  "4000001960000008",
  "4000002030000002",
  "4000002080000001",
  "4000002330000009",
  "4000002460000001",
  "4000002500000003",
  "4000002760000016",
  "4000002920000005",
  "4000003000000030",
  "4000003480000005",
  "4000003720000005",
  "4000003800000008",
  "4000004280000005",
  "4000004380000004",
  "4000004400000000",
  "4000004420000006",
  "4000004700000007",
  "4000005280000002",
  "4000005780000007",
  "4000006160000005",
  "4000006200000007",
  "4000006420000001",
  "4000006820000007",
  "4000007050000006",
  "4000007030000001",
  "4000007240000007",
  "4000007520000008",
  "4000007560000009",
  "4000008260000000",
  "4000058260000005",
  "5555558265554449",
  "4000000360000006",
  "4000001560000002",
  "4000003440000004",
  "4000003560000008",
  "4000003920000003",
  "3530111333300000",
  "4000004580000002",
  "4000005540000008",
  "4000007020000003",
  "4000007640000003",
  "4000057640000008",
  "4000000000000002",
  "4000000000009995",
  "4000000000009987",
  "4000000000009979",
  "4000000000000069",
  "4000000000000127",
  "4000000000000119",
  "4242424242424241",
  "4000000000006975",
  "4000000000000341",
  "4100000000000019",
  "4000000000004954",
  "4000000000009235",
  "4000000000000101",
  "4000000000000036",
  "4000000000000028",
  "4000000000000010",
  "4000000000000044",
  "4000000000000259",
  "4000000000002685",
  "4000000000001976",
  "4000000000005423",
  "4000000000007726",
  "4000000000005126",
  "4000000000000077",
  "4000003720000278",
  "4000002500003155",
  "4000002760003184",
  "4000003800000446",
  "4000008260003178",
  "4000000000003220",
  "4000000000003063",
  "4000008400001629",
  "4000008400001280",
  "4000000000003055",
  "4000000000003097",
  "4242424242424242",
  "378282246310005",
  "4000000000003220",
  "4000000000003238",
  "4000000000003246",
  "4000000000003253",
  "4000000000003063",
  "4001007020000002",
  "4000008260000075",
  "4001000360000005",
  "4000002760000008",
];

test("Stripe Payment Test", async ({ page }) => {
  //Do Login Here
  //---------------
  //---------------

  let cardCounter = 1;
  for (const cardNumber of cardNumbers) {
    await page.goto("yoursite.com/subscription"); //your subscription page

    //Cancel if you already have a subscription
    //----------------------------------------
    //----------------------------------------

    //Main Code from Here
    const frameHandle = await page.waitForSelector(
      'iframe[name="privateStripeFrame"]' //frame selector Here
    );

    if (!frameHandle) {
      console.error("Frame not found.");
      continue;
    }
    const frame = await frameHandle.contentFrame();

    await frame.click('input[name="cardnumber"]'); //your selector
    await frame.type('input[name="cardnumber"]', cardNumber);

    await frame.click('input[name="exp-date"]'); //your selector
    await frame.type('input[name="exp-date"]', "4/24"); //any future date

    await frame.click('input[name="cvc"]');
    await frame.type('input[name="cvc"]', "242"); //any 3 digit

    let postalInput;

    try {
      postalInput = await frame.waitForSelector('input[name="postal"]', {  //your selector
        state: "attached",
        timeout: 2000,
      });
      await postalInput.click();
      await postalInput.type("42424");
    } catch (error) {
      //Do this if you want to know which cards does not need Postal Code
      // console.log(" ");
      // console.log(
      //   `🔴 Postal input field not found for ↓ ${cardCounter} no.↓ Card`
      // );
    }

    const payButton = await page.getByRole("button", { name: "PAY" }); //Your Pay Button Here

    const isActive = await Promise.race([
      payButton.evaluate((btn) => !btn.disabled),
      page.waitForTimeout(2000).then(() => false),
    ]);

    if (isActive) {
      await payButton.click();
      await page.waitForTimeout(2000);
      const pageContent = await page.textContent("body");

      if (/Wrong|wrong|not supported/.test(pageContent)) {
        //Your Error message's strings any word; it's case sensitive
        console.log(
          `${cardCounter}. Payment Declined for Card: ${cardNumber} ❌`
        );
      } else {
        console.log(
          `${cardCounter}. Payment Accepted for Card: ${cardNumber} ✅`
        );
      }
    } else {
      console.log(`${cardCounter}. Invalid Card: ${cardNumber} ❌`);
    }

    await page.waitForTimeout(2000);

    cardCounter++;
  }
});
