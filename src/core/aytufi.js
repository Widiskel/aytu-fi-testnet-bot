import { API } from "../api/api.js";
import { Cell, fromNano, internal, TonClient, WalletContractV4 } from "ton";
import { mnemonicToWalletKey } from "ton-crypto";
import { Helper } from "../utils/helper.js";
import { ContractEnums } from "./contract_enums.js";
import { getHttpEndpoint } from "@orbs-network/ton-access";

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
        rawData =
          "b5ee9c720102070100013200011f2f11bf9f000000000000000030186a0801018f800185018ac59a7ea09b5ac6501839af75793cae6b082f2ba7d1926c41a7342e12c84706f0590020ac29808739526932c2600d1562da35fc40ece3fc641bf6f74daabb98b1bb58580202012003040143bff0d5a320fd186c9881c881284377632e9006bc93470dbe6a012b2f00dd325f1e40050143bfec08feeb6beee4c6cd31ebdd6a047a999a7852fa695de5998ce31285ef2c26234006007f80000000000000000000000000000000000000000000000000000000000000000000de0b6b3a76400000000000006765c793fa10079d0000000c0262cd9156c30081800185018ac59a7ea09b5ac6501839af75793cae6b082f2ba7d1926c41a7342e12c0de0b6b3a76400000000000006765c793fa10079d0000000e3837be5a8b7e63";
      } else if (to == "AYTU-USDT") {
        rawData =
          "b5ee9c7201020d0100020200011f2f11bf9f000000000000000030186a0801018d800b1cd0c19d663c679faa60bdf7150a6e091c613c27fe533438feec274bed3e44061236a30020ac29808739526932c2600d1562da35fc40ece3fc641bf6f74daabb98b1bb58580202012003040201200506020148090a0142bfb06a81e73d3e29b2f15d71141e31ef3714da7fbe2fd98e3a693ef84c66e43399070142bfa1ab4641fa30d9310391025086eec65d200d79268e1b7cd402565e01ba64be3c08007f800a36b3127f0e3ac71ec18d94556830467f9cdc5d1d6bd983711e530fbf1c7ce4e06f05b59d3b200000000000006765c793fa10079d0000000c158993770c65007d800000000000000000000000000000000000000000000000000000000000000000006f05b59d3b200000000000006765c793fa10079d0000000a03724584c50141bf668910e3c88b04c8141d4b5550e44f814b2faf8e70053c9afecf5a3a653ddccf0b0141bf7d1b47ae747aa154279917550af16aa8cc36cbe565ddb7878c5f3363e97035570c007f8013f8cdd1eeb31ac7dd2d42fccb2d7527bb7ce0bb707d5793958fbd27732e6016a06f05b59d3b200000000000006765c793fa10079d0000000c175262576353007d800b1cd0c19d663c679faa60bdf7150a6e091c613c27fe533438feec274bed3e44006f05b59d3b20000000000193e5939a08ce9dbd480000000a14d6cc4897";
      } else if (to == "STON") {
        rawData =
          "b5ee9c720102070100013200011f2f11bf9f000000000000000030186a0801018f8013f8cdd1eeb31ac7dd2d42fccb2d7527bb7ce0bb707d5793958fbd27732e6016a850a60e4d0020ac29808739526932c2600d1562da35fc40ece3fc641bf6f74daabb98b1bb58580202012003040143bff0d5a320fd186c9881c881284377632e9006bc93470dbe6a012b2f00dd325f1e40050143bfc9a24438f222c132050752d5543913e052cbebe39c014f26bfb3d68e994f7733c006007f80000000000000000000000000000000000000000000000000000000000000000000de0b6b3a76400000000000006765c793fa10079d0000000c023c0ba32d3300818013f8cdd1eeb31ac7dd2d42fccb2d7527bb7ce0bb707d5793958fbd27732e6016a0de0b6b3a76400000000000006765c793fa10079d0000000e3bd40a152182a7";
      }
      const bodyCell = Cell.fromBoc(Buffer.from(rawData, "hex"))[0];

      const inMsg = internal({
        to: ContractEnums.TONJETTONCONTRACT,
        value: "0.1001",
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
