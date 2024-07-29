import { account } from "./account.js";
import { Aytufi } from "./src/core/aytufi.js";
import { Helper } from "./src/utils/helper.js";
import logger from "./src/utils/logger.js";
import twist from "./src/utils/twist.js";

async function operation(acc) {
  try {
    const aytufi = new Aytufi(acc);
    await aytufi.initWallet();
    await aytufi.getBalance(true);

    if (aytufi.balance > 2) {
      await Helper.delay(
        2000,
        acc,
        `Starting SWAP TX for Acoount ${account.indexOf(acc) + 1} ...`,
        aytufi
      );
      await aytufi.swap();
      await aytufi.swap("AYTU-USDT");
      await aytufi.swap("STON");
      await Helper.delay(
        2000,
        acc,
        `All Swap TX Completed for Account ${account.indexOf(acc) + 1} ...`,
        aytufi
      );

      await Helper.delay(
        2000,
        acc,
        `Starting Provide Liquidity TX for Acoount ${
          account.indexOf(acc) + 1
        } ...`,
        aytufi
      );
      await aytufi.pool();
      await Helper.delay(
        2000,
        acc,
        `All Provide Liquidity TX Completed for Account ${
          account.indexOf(acc) + 1
        } ...`,
        aytufi
      );
    } else {
      throw Error(
        `Account balance < 2 TON , please fill up TON balance using TON Faucet`
      );
    }

    await twist.clear();
  } catch (error) {
    // console.log(error);
    await Helper.delay(
      5000,
      acc,
      `Error processing Accoung ${account.indexOf(acc) + 1} : ${error.message}`
    );
  }
}

/** Processing Bot */
async function process() {
  logger.clear();
  logger.info(`AYTU-FI AUTO TX BOT STARTED`);
  for (const acc of account) {
    await operation(acc);
  }
  logger.info(`AYTU-FI AUTO TX BOT FINISHED`);
  const delay = Helper.random(10000, 120000);
  await Helper.delay(
    delay,
    undefined,
    `All Account processed Delaying for ${Helper.msToTime(delay)} Second`,
    undefined
  );
  await process();
}

(async () => {
  console.log("Aytufi Testnet Tx Bot");
  console.log("By : Widiskel");
  console.log("Note : Don't forget to run git pull to keep up-to-date");
  console.log();
  await process();
})();
