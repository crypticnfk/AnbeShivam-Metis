# AnbeShivam

A Decentralized Platform which uses Quadratic Funding to manage Grants Programs for projects.

## Tech Stack Used

- Truffle Suite
- Next js
- IPFS
- OpenZeppelin Contracts
- react-bootstrap

## AnbeShivam Smart Contract Deployments

**Stardust Testnet**

| Contract | Deployed address  |
| :----- | :- |
| [AnbeShivamMain Contract](https://stardust-explorer.metis.io/address/0x6A17D1b1E31A8473Fccf21b7FAB82757139520f1/transactions) | `0x6A17D1b1E31A8473Fccf21b7FAB82757139520f1` |
| [GODS Token Contract](https://stardust-explorer.metis.io/address/0x0201049b94d6c407bB71745F5Adb8e329b4b39F8) | `0x0201049b94d6c407bB71745F5Adb8e329b4b39F8`|
| [AnbeShivam NFT Contract](https://stardust-explorer.metis.io/address/0x4304EbCb0C6A37D289852aE21Ef5DFc64C5D0573/transactions) | `0x4304EbCb0C6A37D289852aE21Ef5DFc64C5D0573`|



## Run Locally


### Pre-Requisites

- truffle
- ganache-cli

  
Clone the project

```bash
  git clone git@github.com:crypticnfk/AnbeShivam-Metis.git
```

Go to the project directory

```bash
  cd AnbeShivam-Metis
```


### Setting up a local Blockchain
Install dependencies

```bash
  npm install
```

Compile Smart Contracts

```bash
  truffle compile
```

Run ganache (spin up a local blockchain)

```bash
  ganache-cli
```  

Run migrations to deploy the smart contracts locally

```bash
  truffle migrate
```  

### Setting up the client App
 
Go to the client directory

```bash
  cd client
```
Install dependencies

```bash
  npm install
```

Starting a dev server

```bash
  npm run dev
```

Visit http://localhost:3000/ to view the app


## Running Tests

To run tests, run the following command

```bash
  truffle test
```

## Contribute

Contributions are what makes the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

 1. Fork the Project
 2.  Create your Feature Branch (git checkout -b feature/AmazingFeature)
 3. Commit your Changes (git commit -m 'Add some AmazingFeature')
 4.  Push to the Branch (git push origin feature/AmazingFeature)
 5. Open a Pull Request

  
## Feedback

If you have any feedback, please reach out to us at cryptomaniac@anbeshivam.com

  
## License

[MIT](https://choosealicense.com/licenses/mit/)

  
