# AYTU-FI TESTNET TX BOT

AYTU-FI TESTNET TX bot for adding more tx on chain 
what is aytu-fi ? Aytu-fi is TESTNET ON Ton Testnet Network, How to join ?
- Go to : https://beta.aytu.fi/leaderboard
- Connect New Wallet ( Tonkeeper )
- Join Zealy : https://zealy.io/cw/aytufi/invite/ISniGTeTUOzUKXEn-eq2G
- Complete Task
- Earn XP
- Join Testnet and Zealy to collect Aytu Point
- The more AP you earn, the higher allocation you’ll get 
- LFG

📖 Details : https://x.com/AytuFi/status/1816766510024495513

## TABLE OF CONTENTS
- [AYTU-FI TESTNET TX BOT](#aytu-fi-testnet-tx-bot)
  - [TABLE OF CONTENTS](#table-of-contents)
  - [BOT FEATURE](#bot-feature)
  - [PREREQUISITE](#prerequisite)
  - [TIPS](#tips)
  - [SETUP](#setup)
  - [HOW TO UPDATE](#how-to-update)
  - [NOTE (PLEASE READ THIS BEFORE USING BOT)](#note-please-read-this-before-using-bot)
  - [CONTRIBUTE](#contribute)
  - [SUPPORT](#support)


## BOT FEATURE

- Auto Swap (TON - aUSDT, TON - AytuUSDT, TON - aSTONK)
- Auto Add Liquidity **(REMOVED DUE HIGH GAS FEE SPEND)**
- Multi Account Support

## PREREQUISITE

- Git
- Node JS > v22
- TON Testnet Balance > 2 TON (ON YOUR V4R2 Address) you can use tonkeeper browser extension to switch from mainnet to testnet also for change the Contract Address Type
- At least 1 Tx on TON testnet, so your wallet contract will be deployed.

## TIPS 
- Request TON Faucet on [Test Giver Bot](https://t.me/testgiver_ton_bot) Ensure send to your V4R2 Address
- Request aSCALE and aNOT faucet from aytu-fi website
- after receiving both
- Swap all(if Pool reserve is enough, if not enough just swap any amount ex: 3000) aSCALE to TON also aNOT to TON (make sure the TONKEEPE confirmation say +TON received, otherwise you will not receive any TON)
- add Pool Liquidity. if you add liquidity to any pool you will get TVL , it will help you to get TON testnet token so you wouldn't net requesting TON token to ton faucet everytime.

## SETUP

- run `git clone https://github.com/Widiskel/aytu-fi-testnet-bot.git`
- run `cd aytu-fi-testnet-bot`
- run `npm install`
- run `cp account_tmp.js account.js`
- fill up account.js `nano account.js` fill with your account Seed Phrase
- finnaly run `npm run start`

## HOW TO UPDATE

to update just run `git pull` or if it failed because of unstaged commit, just run `git stash` and then `git pull`. after that do `npm install` or `npm update`.

## NOTE (PLEASE READ THIS BEFORE USING BOT)
Keep filling up your wallet using TON faucet bot [HERE](https://t.me/testgiver_ton_bot), you can request faucet here every 60 minutes. this bot will keep running even if your wallet don't have balance, but it not doing any TX if you don't have 2 faucet. 

**Address displayed on bot is not your Wallet Address, but your Wallet Contract Address.**

## CONTRIBUTE

Feel free to fork and contribute adding more feature thanks.

## SUPPORT

want to support me for creating another bot ? Star and fork my repo or buy me a coffee on

EVM : `0x0fd08d2d42ff086bf8c6d057d02d802bf217559a`

SOLANA : `3tE3Hs7P2wuRyVxyMD7JSf8JTAmEekdNsQWqAnayE1CN`
