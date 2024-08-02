import { API } from "../api/api.js";
import { Cell, fromNano, internal, TonClient, WalletContractV4 } from "ton";
import { mnemonicToWalletKey } from "ton-crypto";
import { Helper } from "../utils/helper.js";
import { ContractEnums } from "./contract_enums.js";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TxRawBody } from "./tx_raw_body.js";

export class Aytufi extends API {
  constructor(acc) {
    super("https://beta.aytu.fi/");

    this.acc = acc;
  }

  async initWallet() {
    try {
      this.endpoint = await getHttpEndpoint({ network: "testnet" });
      this.client = new TonClient({
        endpoint: this.endpoint,
      });

      await Helper.delay(1000, this.acc, `Initialize Wallet ...`, this);
      const words = this.acc.split(" ");
      if (words.length !== 24) {
        throw Error("Invalid seed phrase length");
      }
      this.keyPair = await mnemonicToWalletKey(words);
      this.wallet = WalletContractV4.create({
        workchain: 0,
        publicKey: this.keyPair.publicKey,
      });

      // console.log(this.wallet);

      this.walletContract = this.client.open(this.wallet);
      await Helper.delay(2000, this.acc, `Wallet Initialized`, this);
    } catch (error) {
      throw Error(`Error : Failed to initialize wallet - ${error.message}`);
    }
  }

  async getBalance(withMsg = false) {
    if (withMsg) {
      await Helper.delay(1000, this.acc, `Getting TON Balance ...`, this);
    }
    this.balance = fromNano(await this.walletContract.getBalance());
    if (withMsg) {
      await Helper.delay(2000, this.acc, `Successfully Get Ton Balance`, this);
    }
  }

  async swap(to = "USDT") {
    try {
      await Helper.delay(1000, this.acc, `Swapping TON to ${to} ...`, this);
      const seqno = await this.walletContract.getSeqno();
      let rawData;
      if (to == "USDT") {
        rawData = TxRawBody.TONaUSDT;
      } else if (to == "AYTU-USDT") {
        rawData = TxRawBody.TONAYTU_USDT;
      } else if (to == "STON") {
        rawData = TxRawBody.TONaSTON;
      } else if (to == "NOT") {
        rawData = TxRawBody.TONaNOT;
      } else if (to == "SCALE") {
        rawData = TxRawBody.TONaSCALE;
      }
      const bodyCell = Cell.fromBoc(Buffer.from(rawData, "hex"))[0];

      const inMsg = internal({
        to: ContractEnums.TONJETTONCONTRACT,
        value: "0.10005",
        bounce: true,
        body: bodyCell,
      });

      const tx = await this.walletContract.sendTransfer({
        seqno: seqno,
        secretKey: this.keyPair.secretKey,
        messages: [inMsg],
      });
      await this.confirmTx(tx, seqno);
      await Helper.delay(
        3000,
        this.acc,
        `Swap TON to ${to} Complete, Tx Confirmed ...`,
        this
      );
    } catch (error) {
      console.log(error);
    }
  }

  async confirmTx(tx, seqno) {
    await Helper.delay(
      1000,
      this.acc,
      `TX Executed ${
        JSON.stringify(tx) == undefined ? "" : JSON.stringify(tx)
      }...`,
      this
    );
    let currentSeqno = seqno;
    while (currentSeqno == seqno) {
      await Helper.delay(
        5000,
        this.acc,
        `Waiting for tx to be confirmed ...`,
        this
      );
      currentSeqno = await this.walletContract.getSeqno();
    }
  }
}
