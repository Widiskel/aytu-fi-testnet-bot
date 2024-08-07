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
        300,
        acc,
        `Starting SWAP TX for Acoount ${account.indexOf(acc) + 1} ...`,
        aytufi
      );
      await aytufi.swap();
      await aytufi.swap("AYTU-USDT");
      await aytufi.swap("STON");
      await aytufi.swap("NOT");
      await aytufi.swap("SCALE");
      await Helper.delay(
        300,
        acc,
        `All Swap TX Completed for Account ${account.indexOf(acc) + 1} ...`,
        aytufi
      );
    } else {
      throw Error(
        `Account balance < 2 TON , please fill up TON balance using TON Faucet`
      );
    }
    const delay = Helper.random(3000, 10000);
    await Helper.delay(
      delay,
      acc,
      `Account ${
        account.indexOf(acc) + 1
      } Processing complete Delaying for ${Helper.msToTime(delay)}`,
      aytufi
    );
    await twist.clear(acc);
    await operation(acc);
  } catch (error) {
    await Helper.delay(
      3000,
      acc,
      `Error processing Accoung ${account.indexOf(acc) + 1} : ${error.message}`
    );
    await twist.clear(acc);
    // console.log(error);
    await operation(acc);
  }
}

/** Processing Bot */
async function process() {
  logger.clear();
  logger.info(`AYTU-FI AUTO TX BOT STARTED`);

  const allPromise = account.map(async (acc) => {
    await operation(acc);
  });

  await Promise.all(allPromise);
  logger.info(`AYTU-FI AUTO TX BOT FINISHED`);
}

(async () => {
  console.log("Aytufi Testnet Tx Bot");
  console.log("By : Widiskel");
  console.log("Note : Don't forget to run git pull to keep up-to-date");
  console.log();
  await process();
})();
