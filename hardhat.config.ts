import { NamedAccounts } from './data/NamedAccounts';
import { DeploymentNetwork } from './utils/Constants';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-solhint';
import '@nomiclabs/hardhat-waffle';
import '@tenderly/hardhat-tenderly';
import '@typechain/hardhat';
import 'dotenv/config';
import 'hardhat-contract-sizer';
import 'hardhat-deploy';
import 'hardhat-gas-reporter';
import { HardhatUserConfig } from 'hardhat/config';
import { MochaOptions } from 'mocha';
import 'solidity-coverage';

interface EnvOptions {
  ETHEREUM_PROVIDER_URL?: string;
  ETHEREUM_GOERLI_PROVIDER_URL?: string;
  ETHERSCAN_API_KEY?: string;
  GAS_PRICE?: number | 'auto';
  PROFILE?: boolean;
  TENDERLY_FORK_ID?: string;
  TENDERLY_PROJECT?: string;
  TENDERLY_TEST_PROJECT?: string;
  TENDERLY_USERNAME?: string;
}

const {
  ETHEREUM_PROVIDER_URL = '',
  ETHEREUM_GOERLI_PROVIDER_URL = '',
  ETHERSCAN_API_KEY,
  GAS_PRICE: gasPrice,
  PROFILE: isProfiling,
  TENDERLY_FORK_ID = '',
  TENDERLY_PROJECT = '',
  TENDERLY_TEST_PROJECT = '',
  TENDERLY_USERNAME = ''
}: EnvOptions = process.env as any as EnvOptions;

const mochaOptions = (): MochaOptions => {
  let timeout = 600000;
  let grep;
  let reporter;

  if (isProfiling) {
    timeout = 0;
    reporter = 'mocha-silent-reporter';
  }

  return {
    timeout,
    color: true,
    bail: true,
    grep,
    reporter
  };
};

const config: HardhatUserConfig = {
  networks: {
    [DeploymentNetwork.Hardhat]: {
      accounts: {
        count: 20,
        accountsBalance: '10000000000000000000000000000000000000000000000'
      },
      allowUnlimitedContractSize: true,
      saveDeployments: false,
      live: false
    },
    [DeploymentNetwork.Mainnet]: {
      chainId: 1,
      url: ETHEREUM_PROVIDER_URL,
      gasPrice: gasPrice || 'auto',
      saveDeployments: true,
      live: true
    },

    [DeploymentNetwork.Goerli]: {
      chainId: 5,
      url: ETHEREUM_GOERLI_PROVIDER_URL,
      saveDeployments: true,
      live: true
    },

    [DeploymentNetwork.Tenderly]: {
      chainId: 1,
      url: `https://rpc.tenderly.co/fork/${TENDERLY_FORK_ID}`,
      autoImpersonate: true,
      saveDeployments: true,
      live: true
    }
  },

  paths: {
    deploy: ['deploy/scripts']
  },

  tenderly: {
    forkNetwork: '1',
    project: TENDERLY_PROJECT || TENDERLY_TEST_PROJECT,
    username: TENDERLY_USERNAME
  },

  solidity: {
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
        runs: 100000
      },
      viaIR: true,
      metadata: {
        bytecodeHash: 'none'
      }
    }
  },

  namedAccounts: NamedAccounts,

  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },

  contractSizer: {
    alphaSort: true,
    runOnCompile: false,
    disambiguatePaths: false
  },

  gasReporter: {
    currency: 'USD',
    enabled: isProfiling
  },

  mocha: mochaOptions()
};

export default config;
