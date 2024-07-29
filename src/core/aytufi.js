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
          "b5ee9c720102070100013100011d2f11bf9f000000000000000022710801018f800185018ac59a7ea09b5ac6501839af75793cae6b082f2ba7d1926c41a7342e12c805a72cd10020ac29808739526932c2600d1562da35fc40ece3fc641bf6f74daabb98b1bb58580202012003040143bff0d5a320fd186c9881c881284377632e9006bc93470dbe6a012b2f00dd325f1e40050143bfec08feeb6beee4c6cd31ebdd6a047a999a7852fa695de5998ce31285ef2c26234006007f80000000000000000000000000000000000000000000000000000000000000000000de0b6b3a76400000000000006765c793fa10079d0000000c0267a46ab9830081800185018ac59a7ea09b5ac6501839af75793cae6b082f2ba7d1926c41a7342e12c0de0b6b3a76400000000000006765c793fa10079d0000000e37d9f54285adfd";
      } else if (to == "AYTU-USDT") {
        rawData =
          "b5ee9c720102070100012c00011d2f11bf9f000000000000000022710801018b800b1cd0c19d663c679faa60bdf7150a6e091c613c27fe533438feec274bed3e440530c10020ac29808739526932c2600d1562da35fc40ece3fc641bf6f74daabb98b1bb58580202012003040143bff0d5a320fd186c9881c881284377632e9006bc93470dbe6a012b2f00dd325f1e40050143bfdf46d1eb9d1ea85509e645d542bc5aaa330db2f959776de1e317ccd8fa5c0d55c006007d800000000000000000000000000000000000000000000000000000000000000000018fae27693b400000000000006765c793fa10079d0000000a071f6ce001007d800b1cd0c19d663c679faa60bdf7150a6e091c613c27fe533438feec274bed3e44002c68af0bb140000000000193e5939a08ce9dbd480000000a03de38730d";
      } else if (to == "STON") {
        rawData =
          "b5ee9c720102070100013100011d2f11bf9f000000000000000022710801018f8013f8cdd1eeb31ac7dd2d42fccb2d7527bb7ce0bb707d5793958fbd27732e6016a806527f270020ac29808739526932c2600d1562da35fc40ece3fc641bf6f74daabb98b1bb58580202012003040143bff0d5a320fd186c9881c881284377632e9006bc93470dbe6a012b2f00dd325f1e40050143bfc9a24438f222c132050752d5543913e052cbebe39c014f26bfb3d68e994f7733c006007f80000000000000000000000000000000000000000000000000000000000000000000de0b6b3a76400000000000006765c793fa10079d0000000c0245034f6ff300818013f8cdd1eeb31ac7dd2d42fccb2d7527bb7ce0bb707d5793958fbd27732e6016a0de0b6b3a76400000000000006765c793fa10079d0000000e3af32457db0f61";
      } else if (to == "NOT") {
        rawData =
          "b5ee9c7201020a0100019800011d2f11bf9f000000000000000022710801018f800a36b3127f0e3ac71ec18d94556830467f9cdc5d1d6bd983711e530fbf1c7ce4e8053d50830020ac29808739526932c2600d1562da35fc40ece3fc641bf6f74daabb98b1bb585802020120030402012005060143bfc9a24438f222c132050752d5543913e052cbebe39c014f26bfb3d68e994f7733c0090142bfb06a81e73d3e29b2f15d71141e31ef3714da7fbe2fd98e3a693ef84c66e43399070142bfa1ab4641fa30d9310391025086eec65d200d79268e1b7cd402565e01ba64be3c08007f800a36b3127f0e3ac71ec18d94556830467f9cdc5d1d6bd983711e530fbf1c7ce4e09403d2b0f4680000000000006765c793fa10079d0000000c188481193a6b007b80000000000000000000000000000000000000000000000000000000000000000000940f311303b00000000000006765c793fa10079d0000000923ab8591007f8013f8cdd1eeb31ac7dd2d42fccb2d7527bb7ce0bb707d5793958fbd27732e6016a09403d2b0f4680000000000006765c793fa10079d0000000c144abf2a53c5";
      } else if (to == "SCALE") {
        rawData =
          "b5ee9c720102070100012d00011d2f11bf9f000000000000000022710801018f80035c1965760ab2457d9e9956fd0f3edd8c3c834843cd9adf085d7f3b76f052f44808d260e50020ac29808739526932c2600d1562da35fc40ece3fc641bf6f74daabb98b1bb58580202037cc803040141be9ab4641fa30d9310391025086eec65d200d79268e1b7cd402565e01ba64be3c8050141bea7bac7f800df180a30821777f6bd4f6d8f16b4a497641026a2b35271f83dc44806007d80000000000000000000000000000000000000000000000000000000000000000001b33519d8fc400000000000006765c793fa10079d0000000a027bbe3e81007d80035c1965760ab2457d9e9956fd0f3edd8c3c834843cd9adf085d7f3b76f052f44008e1bc9bf0400000000000006765c793fa10079d0000000b7bff8174a3";
      }
      const bodyCell = Cell.fromBoc(Buffer.from(rawData, "hex"))[0];

      const inMsg = internal({
        to: ContractEnums.TONJETTONCONTRACT,
        value: "0.10001",
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
