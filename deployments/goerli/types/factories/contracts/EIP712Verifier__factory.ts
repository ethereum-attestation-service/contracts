/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type { PromiseOrValue } from "../../common";
import type {
  EIP712Verifier,
  EIP712VerifierInterface,
} from "../../contracts/EIP712Verifier";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "InvalidSignature",
    type: "error",
  },
  {
    inputs: [],
    name: "VERSION",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "schema",
        type: "bytes32",
      },
      {
        internalType: "uint32",
        name: "expirationTime",
        type: "uint32",
      },
      {
        internalType: "bool",
        name: "revocable",
        type: "bool",
      },
      {
        internalType: "bytes32",
        name: "refUUID",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        internalType: "address",
        name: "attester",
        type: "address",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "attest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAttestTypeHash",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "getDomainSeparator",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "getNonce",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getRevokeTypeHash",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "uuid",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "attester",
        type: "address",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "revoke",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x61014060405234801561001157600080fd5b50604080518082018252600381526245415360e81b602080830191825283518085019094526004845263302e313960e01b908401528151902060e08190527f69c9d575c50b0e9ea4eed8c97451fd7ebd6209b337f7623a1a9a2020232cb4f96101008190524660a0529192917f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f6100ed8184846040805160208101859052908101839052606081018290524660808201523060a082015260009060c0016040516020818303038152906040528051906020012090509392505050565b6080523060c052610120525061010292505050565b60805160a05160c05160e0516101005161012051610b17610151600039600061054a0152600061059901526000610574015260006104cd015260006104f7015260006105210152610b176000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c80632d5c429d1161005b5780632d5c429d14610102578063b83010d314610115578063ed24911d1461013b578063ffa1ad741461014357600080fd5b806312b11a17146100825780631863f01d146100b75780632d0335ab146100cc575b600080fd5b7f227c2175d9fc17b0f2b4bea1a33eaab23cef0d6a13022dd0cd9d60facfb0d6d75b6040519081526020015b60405180910390f35b6100ca6100c53660046108cb565b61018c565b005b6100a46100da366004610919565b73ffffffffffffffffffffffffffffffffffffffff1660009081526020819052604090205490565b6100ca610110366004610994565b610292565b7fbae0931f3a99efd1b97c2f5b6b6e79d16418246b5055d64757e16de5ad11a8ab6100a4565b6100a461040d565b61017f6040518060400160405280600481526020017f302e31390000000000000000000000000000000000000000000000000000000081525081565b6040516100ae9190610a5f565b73ffffffffffffffffffffffffffffffffffffffff841660009081526020818152604080832080546001810190915581517fbae0931f3a99efd1b97c2f5b6b6e79d16418246b5055d64757e16de5ad11a8ab93810193909352908201889052606082018190529190610217906080015b6040516020818303038152906040528051906020012061041c565b90508573ffffffffffffffffffffffffffffffffffffffff1661023c8287878761048b565b73ffffffffffffffffffffffffffffffffffffffff1614610289576040517f8baa579f00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b50505050505050565b60008060008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000815480929190600101919050559050600061038c7f227c2175d9fc17b0f2b4bea1a33eaab23cef0d6a13022dd0cd9d60facfb0d6d760001b8e8e8e8e8e8e8e604051610321929190610acb565b60408051918290038220602083019890985273ffffffffffffffffffffffffffffffffffffffff90961695810195909552606085019390935263ffffffff9091166080840152151560a083015260c082015260e08101919091526101008101849052610120016101fc565b90508573ffffffffffffffffffffffffffffffffffffffff166103b18287878761048b565b73ffffffffffffffffffffffffffffffffffffffff16146103fe576040517f8baa579f00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b50505050505050505050505050565b60006104176104b3565b905090565b60006104856104296104b3565b836040517f19010000000000000000000000000000000000000000000000000000000000006020820152602281018390526042810182905260009060620160405160208183030381529060405280519060200120905092915050565b92915050565b600080600061049c878787876105e7565b915091506104a9816106d6565b5095945050505050565b60003073ffffffffffffffffffffffffffffffffffffffff7f00000000000000000000000000000000000000000000000000000000000000001614801561051957507f000000000000000000000000000000000000000000000000000000000000000046145b1561054357507f000000000000000000000000000000000000000000000000000000000000000090565b50604080517f00000000000000000000000000000000000000000000000000000000000000006020808301919091527f0000000000000000000000000000000000000000000000000000000000000000828401527f000000000000000000000000000000000000000000000000000000000000000060608301524660808301523060a0808401919091528351808403909101815260c0909201909252805191012090565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a083111561061e57506000905060036106cd565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa158015610672573d6000803e3d6000fd5b50506040517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0015191505073ffffffffffffffffffffffffffffffffffffffff81166106c6576000600192509250506106cd565b9150600090505b94509492505050565b60008160048111156106ea576106ea610adb565b036106f25750565b600181600481111561070657610706610adb565b03610772576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601860248201527f45434453413a20696e76616c6964207369676e6174757265000000000000000060448201526064015b60405180910390fd5b600281600481111561078657610786610adb565b036107ed576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e677468006044820152606401610769565b600381600481111561080157610801610adb565b0361088e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c60448201527f75650000000000000000000000000000000000000000000000000000000000006064820152608401610769565b50565b803573ffffffffffffffffffffffffffffffffffffffff811681146108b557600080fd5b919050565b803560ff811681146108b557600080fd5b600080600080600060a086880312156108e357600080fd5b853594506108f360208701610891565b9350610901604087016108ba565b94979396509394606081013594506080013592915050565b60006020828403121561092b57600080fd5b61093482610891565b9392505050565b803580151581146108b557600080fd5b60008083601f84011261095d57600080fd5b50813567ffffffffffffffff81111561097557600080fd5b60208301915083602082850101111561098d57600080fd5b9250929050565b60008060008060008060008060008060006101408c8e0312156109b657600080fd5b6109bf8c610891565b9a5060208c0135995060408c013563ffffffff811681146109df57600080fd5b98506109ed60608d0161093b565b975060808c0135965060a08c013567ffffffffffffffff811115610a1057600080fd5b610a1c8e828f0161094b565b9097509550610a2f905060c08d01610891565b9350610a3d60e08d016108ba565b92506101008c013591506101208c013590509295989b509295989b9093969950565b600060208083528351808285015260005b81811015610a8c57858101830151858201604001528201610a70565b5060006040828601015260407fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f8301168501019250505092915050565b8183823760009101908152919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fdfea164736f6c6343000811000a";

type EIP712VerifierConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: EIP712VerifierConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class EIP712Verifier__factory extends ContractFactory {
  constructor(...args: EIP712VerifierConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<EIP712Verifier> {
    return super.deploy(overrides || {}) as Promise<EIP712Verifier>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): EIP712Verifier {
    return super.attach(address) as EIP712Verifier;
  }
  override connect(signer: Signer): EIP712Verifier__factory {
    return super.connect(signer) as EIP712Verifier__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): EIP712VerifierInterface {
    return new utils.Interface(_abi) as EIP712VerifierInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): EIP712Verifier {
    return new Contract(address, _abi, signerOrProvider) as EIP712Verifier;
  }
}
