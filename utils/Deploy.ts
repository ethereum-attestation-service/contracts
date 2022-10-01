import { ASRegistry, EAS, EIP712Verifier } from '../components/Contracts';
import Logger from '../utils/Logger';
import { DeploymentNetwork } from './Constants';
import { toWei } from './Types';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber, Contract, ContractInterface, utils } from 'ethers';
import fs from 'fs';
import glob from 'glob';
import { config, deployments, ethers, getNamedAccounts, tenderly } from 'hardhat';
import { ABI, Address, DeployFunction, Deployment as DeploymentData } from 'hardhat-deploy/types';
import path from 'path';

const {
  deploy: deployContract,
  execute: executeTransaction,
  getNetworkName,
  save: saveContract,
  getExtendedArtifact,
  getArtifact,
  run
} = deployments;

const { AbiCoder } = utils;

const tenderlyNetwork = tenderly.network();

interface EnvOptions {
  TEST_FORK?: boolean;
}

const { TEST_FORK: isTestFork }: EnvOptions = process.env as any as EnvOptions;

export enum NewInstanceName {
  EAS = 'EAS',
  ASRegistry = 'ASRegistry',
  EIP712Verifier = 'EIP712Verifier'
}

export const InstanceName = {
  ...NewInstanceName
};

export type InstanceName = NewInstanceName;

const deployed = <F extends Contract>(name: InstanceName) => ({
  deployed: async () => ethers.getContract<F>(name)
});

const DeployedNewContracts = {
  EAS: deployed<EAS>(InstanceName.EAS),
  ASRegistry: deployed<ASRegistry>(InstanceName.ASRegistry),
  EIP712Verifier: deployed<EIP712Verifier>(InstanceName.EIP712Verifier)
};

export const DeployedContracts = {
  ...DeployedNewContracts
};

export const isTenderlyFork = () => getNetworkName() === DeploymentNetwork.Tenderly;
export const isMainnetFork = () => isTenderlyFork();
export const isMainnet = () => getNetworkName() === DeploymentNetwork.Mainnet || isMainnetFork();
export const isGoerli = () => getNetworkName() === DeploymentNetwork.Goerli;
export const isLive = () => (isMainnet() && !isMainnetFork()) || isGoerli();

const TEST_MINIMUM_BALANCE = toWei(10);
const TEST_FUNDING = toWei(10);

export const getNamedSigners = async (): Promise<Record<string, SignerWithAddress>> => {
  const signers: Record<string, SignerWithAddress> = {};

  for (const [name, address] of Object.entries(await getNamedAccounts())) {
    signers[name] = await ethers.getSigner(address);
  }

  return signers;
};

export const fundAccount = async (account: string | SignerWithAddress) => {
  if (!isMainnetFork()) {
    return;
  }

  const address = typeof account === 'string' ? account : account.address;

  const balance = await ethers.provider.getBalance(address);
  if (balance.gte(TEST_MINIMUM_BALANCE)) {
    return;
  }

  const { ethWhale } = await getNamedSigners();

  return ethWhale.sendTransaction({
    value: TEST_FUNDING,
    to: address
  });
};

interface SaveTypeOptions {
  name: InstanceName;
  contract: string;
}

const saveTypes = async (options: SaveTypeOptions) => {
  const { name, contract } = options;

  const { sourceName } = await getArtifact(contract);
  const contractSrcDir = path.dirname(sourceName);

  const typechainDir = path.resolve('./', config.typechain.outDir);

  // for some reason, the types of some contracts are stored in a "Contract.sol" dir, in which case we'd have to use
  // it as the root source dir
  let srcDir;
  let factoriesSrcDir;
  if (fs.existsSync(path.join(typechainDir, sourceName))) {
    srcDir = path.join(typechainDir, sourceName);
    factoriesSrcDir = path.join(typechainDir, 'factories', sourceName);
  } else {
    srcDir = path.join(typechainDir, contractSrcDir);
    factoriesSrcDir = path.join(typechainDir, 'factories', contractSrcDir);
  }

  const typesDir = path.join(config.paths.deployments, getNetworkName(), 'types');
  const destDir = path.join(typesDir, contractSrcDir);
  const factoriesDestDir = path.join(typesDir, 'factories', contractSrcDir);

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  if (!fs.existsSync(factoriesDestDir)) {
    fs.mkdirSync(factoriesDestDir, { recursive: true });
  }

  // save the factory typechain
  fs.copyFileSync(
    path.join(factoriesSrcDir, `${contract}__factory.ts`),
    path.join(factoriesDestDir, `${name}__factory.ts`)
  );

  // save the typechain of the contract itself
  fs.copyFileSync(path.join(srcDir, `${contract}.ts`), path.join(destDir, `${name}.ts`));
};

export interface ArtifactData {
  abi: ABI;
  bytecode: string;
}

interface DeployOptions {
  name: InstanceName;
  contract?: string;
  args?: any[];
  from: string;
  value?: BigNumber;
  contractArtifactData?: ArtifactData;
  legacy?: boolean;
}

const WAIT_CONFIRMATIONS = isLive() ? 2 : 1;

interface FunctionParams {
  name?: string;
  contractName?: string;
  contractArtifactData?: ArtifactData;
  methodName?: string;
  args?: any[];
}

const logParams = async (params: FunctionParams) => {
  const { name, contractName, contractArtifactData, methodName, args = [] } = params;

  if (!name && !contractArtifactData && !contractName) {
    throw new Error('Either name, contractArtifactData, or contractName must be provided!');
  }

  let contractInterface: ContractInterface;

  if (name) {
    ({ interface: contractInterface } = await ethers.getContract(name));
  } else if (contractArtifactData) {
    contractInterface = new utils.Interface(contractArtifactData!.abi);
  } else {
    ({ interface: contractInterface } = await ethers.getContractFactory(contractName!));
  }

  const fragment = methodName ? contractInterface.getFunction(methodName) : contractInterface.deploy;

  Logger.log(`  ${methodName ?? 'constructor'} params: ${args.length === 0 ? '[]' : ''}`);
  if (args.length === 0) {
    return;
  }

  for (const [i, arg] of args.entries()) {
    const input = fragment.inputs[i];
    Logger.log(`    ${input.name} (${input.type}): ${arg.toString()}`);
  }
};

interface TypedParam {
  name: string;
  type: string;
  value: any;
}

const logTypedParams = async (methodName: string, params: TypedParam[] = []) => {
  Logger.log(`  ${methodName} params: ${params.length === 0 ? '[]' : ''}`);
  if (params.length === 0) {
    return;
  }

  for (const { name, type, value } of params) {
    Logger.log(`    ${name} (${type}): ${value.toString()}`);
  }
};

export const deploy = async (options: DeployOptions) => {
  const { name, contract, from, value, args, contractArtifactData } = options;
  const contractName = contract ?? name;

  await fundAccount(from);

  const customAlias = contractName === name ? '' : ` as ${name};`;

  Logger.log(`  deploying ${contractName}${customAlias}`);

  await logParams({ contractName, contractArtifactData, args });

  const res = await deployContract(name, {
    contract: contractArtifactData ?? contractName,
    from,
    value,
    args,
    waitConfirmations: WAIT_CONFIRMATIONS,
    log: true
  });

  const data = { name, contract: contractName };

  await saveTypes(data);

  await verifyTenderlyFork({
    address: res.address,
    implementation: res.implementation,
    ...data
  });

  return res.address;
};

interface ExecuteOptions {
  name: InstanceName;
  methodName: string;
  args?: any[];
  from: string;
  value?: BigNumber;
}

export const execute = async (options: ExecuteOptions) => {
  const { name, methodName, from, value, args } = options;
  const contract = await ethers.getContract(name);

  Logger.info(`  executing ${name}.${methodName} (${contract.address})`);

  await fundAccount(from);

  await logParams({ name, args, methodName });

  return executeTransaction(
    name,
    { from, value, waitConfirmations: WAIT_CONFIRMATIONS, log: true },
    methodName,
    ...(args ?? [])
  );
};

interface Deployment {
  name: InstanceName;
  contract?: string;
  address: Address;
  implementation?: Address;
  skipVerification?: boolean;
}

export const save = async (deployment: Deployment) => {
  const { name, contract, address, skipVerification } = deployment;

  const contractName = contract ?? name;
  const { abi } = await getExtendedArtifact(contractName);

  // save the deployment json data in the deployments folder
  await saveContract(name, { abi, address });

  // publish the contract to a Tenderly fork
  if (!skipVerification) {
    await verifyTenderlyFork(deployment);
  }
};

interface ContractData {
  name: string;
  address: Address;
}

const verifyTenderlyFork = async (deployment: Deployment) => {
  // verify contracts on Tenderly only for mainnet or tenderly mainnet forks deployments
  if (!isTenderlyFork() || isTestFork) {
    return;
  }

  const { name, contract, address, implementation } = deployment;

  const contracts: ContractData[] = [];
  let contractAddress = address;

  contracts.push({
    name: contract ?? name,
    address: contractAddress
  });

  for (const contract of contracts) {
    Logger.log('  verifying on tenderly', contract.name, 'at', contract.address);

    await tenderlyNetwork.verify(contract);
  }
};

export const deploymentTagExists = (tag: string) => {
  const externalDeployments = config.external?.deployments![getNetworkName()];
  const migrationsPath = path.resolve(
    __dirname,
    '../',
    externalDeployments ? externalDeployments[0] : path.join('deployments', getNetworkName()),
    '.migrations.json'
  );

  if (!fs.existsSync(migrationsPath)) {
    return false;
  }

  const migrations = JSON.parse(fs.readFileSync(migrationsPath, 'utf-8'));
  const tags = Object.keys(migrations).map((tag) => deploymentFileNameToTag(tag));

  return tags.includes(tag);
};

const deploymentFileNameToTag = (filename: string) => Number(path.basename(filename).split('-')[0]).toString();

export const getPreviousDeploymentTag = (tag: string) => {
  const files = fs.readdirSync(config.paths.deploy[0]).sort();

  const index = files.map((f) => deploymentFileNameToTag(f)).lastIndexOf(tag);
  if (index === -1) {
    throw new Error(`Unable to find deployment with tag ${tag}`);
  }

  return index === 0 ? undefined : deploymentFileNameToTag(files[index - 1]);
};

export const getLatestDeploymentTag = () => {
  const files = fs.readdirSync(config.paths.deploy[0]).sort();

  return Number(files[files.length - 1].split('-')[0]).toString();
};

export const deploymentMetadata = (filename: string) => {
  const id = path.basename(filename).split('.')[0];
  const tag = deploymentFileNameToTag(filename);
  const prevTag = getPreviousDeploymentTag(tag);

  return {
    id,
    tag,
    dependency: prevTag
  };
};

export const setDeploymentMetadata = (filename: string, func: DeployFunction) => {
  const { id, tag, dependency } = deploymentMetadata(filename);

  func.id = id;
  func.tags = [tag];
  func.dependencies = dependency ? [dependency] : undefined;

  return func;
};

export const runPendingDeployments = async () => {
  const { tag } = deploymentMetadata(getLatestDeploymentTag());

  return run(tag, {
    resetMemory: false,
    deletePreviousDeployments: false,
    writeDeploymentsToFiles: true
  });
};

export const getInstanceNameByAddress = (address: string): InstanceName => {
  const externalDeployments = config.external?.deployments![getNetworkName()];
  const deploymentsPath = externalDeployments ? externalDeployments[0] : path.join('deployments', getNetworkName());

  const deploymentPaths = glob.sync(`${deploymentsPath}/**/*.json`);
  for (const deploymentPath of deploymentPaths) {
    const name = path.basename(deploymentPath).split('.')[0];
    if (name.endsWith('_Implementation') || name.endsWith('_Proxy')) {
      continue;
    }

    const deployment: DeploymentData = JSON.parse(fs.readFileSync(deploymentPath, 'utf-8'));
    if (deployment.address.toLowerCase() === address.toLowerCase()) {
      return name as InstanceName;
    }
  }

  throw new Error(`Unable to find deployment for ${address}`);
};
