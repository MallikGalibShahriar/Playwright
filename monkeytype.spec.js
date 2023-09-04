import { test, expect } from "@playwright/test";

test("Typing Speed", async ({ page }) => {
  await page.goto(`https://monkeytype.com/`);
  await page.click("text=Reject all");
  await page.waitForTimeout(2000);
  await page.locator("#testConfig").getByText("15").click();
  await page.waitForTimeout(5000);

  const words = await page.$$("#wordsWrapper .word");

  for (const word of words) {
    const letters = await word.$$("letter");
    for (const letter of letters) {
      const char = await letter.textContent();
      if (char === " ") {
        await page.keyboard.press("Space");
      } else {
        await page.keyboard.press(char);
      }
    }
    await page.keyboard.press("Space");
  }

  await page.waitForTimeout(5000); 
});
