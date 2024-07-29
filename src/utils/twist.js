import { Twisters } from "twisters";
import logger from "./logger.js";
import { account } from "../../account.js";
import { Aytufi } from "../core/aytufi.js";

class Twist {
  constructor() {
    /** @type  {Twisters}*/
    this.twisters = new Twisters({});
  }

  /**
   * @param {string} acc
   * @param {Aytufi} aytufi
   * @param {string} msg
   * @param {string} delay
   */
  log(msg = "", acc = "", aytufi = new Aytufi(), delay) {
    if (delay == undefined) {
      logger.info(`Account ${account.indexOf(acc) + 1} - ${msg}`);
      delay = "-";
    }

    const wallet = aytufi.wallet ?? {};
    const address = wallet.address ?? "-";
    const balance = aytufi.balance ?? "-";

    this.twisters.put(acc, {
      text: `
================= Account ${account.indexOf(acc) + 1} =============
Wallet Contract Address : ${address}
Balance                 : ${balance} TON 

Status : ${msg}
Delay  : ${delay}
==============================================`,
    });
  }

  async clear(acc) {
    await this.twisters.remove(acc);
  }

  /**
   * @param {string} msg
   */
  info(msg = "") {
    this.twisters.put(2, {
      text: `
==============================================
Info : ${msg}
==============================================`,
    });
    return;
  }

  async cleanInfo() {
    await this.twisters.remove(2);
  }
}
export default new Twist();
