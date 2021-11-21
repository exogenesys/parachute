# parachute

Parachute is a tool which lets you airdrop SPL tokens to a list of wallet addresses (potentially sponsored by https://solrazr.com/)

Deployed at https://parachute.vercel.app, but it is recommended that you run your own instance so that you don't have to trust any deployment

## How to run your own instance

1. Run `git clone https://github.com/exogenesys/parachute`
2. Run `cd parachute`
3. Run `npm i`
4. Run `npm run serve`
5. Go to `localhost:5000` in your browser

## Notes on Security

- The app uses only official Solana libraries for the entire airdrop logic, i.e. @solana/spl-token, @solana/web3.js
- There is no server anywhere involved in the data-flow of this application, and the deployment on Vercel is static file serving deployment, so none of your data leaves the client side
- The application is open-sourced and to be audited by the community
- The solana related code is decoupled from the rest of the app and entirely written in these two files:
  - https://github.com/exogenesys/parachute/blob/main/src/services/SolanaService/index.ts
  - https://github.com/exogenesys/parachute/blob/main/src/services/AirdropService/index.ts
- Although, the application is deployed at https://parachute.vercel.app, It is recommended to run your own instance of the application so that you know that you’re running the exact same code as you see on Github and you don’t have to trust any deployment
- If you decide to go with the deployment at https://parachute.vercel.app, you can verify the deployments here on the following page: https://github.com/exogenesys/parachute/deployments/activity_log?environment=Production
- The app doesn’t use any persistent client side storage option like localstorage, everything is stored in memory which is forgotten by the app after closing the tab or reloading

## Notes on Scalability

- The app is potentially capable of doing as many airdrops as you want
- Given that the RPC nodes used allows that as well
  - Public RPC nodes are prone to be congested, so speed may be affected
  - Public RPC nodes might rate limite you after a certain number of transfers
  - This is can easily be solved by using private RPC nodes

## Roadmap

- Allow connecting to mainnet
- Allow connecting via custom RPC Nodes
- Estimate and show how much SOL you'd need to do an airdrop
- Fetch wallet address which hold a certain SPL token
- Use electron to make a desktop app
- Dark Mode 🌚
