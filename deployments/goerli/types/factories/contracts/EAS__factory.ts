/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type { PromiseOrValue } from "../../common";
import type { EAS, EASInterface } from "../../contracts/EAS";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract ISchemaRegistry",
        name: "registry",
        type: "address",
      },
      {
        internalType: "contract IEIP712Verifier",
        name: "verifier",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "AccessDenied",
    type: "error",
  },
  {
    inputs: [],
    name: "AlreadyRevoked",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidAttestation",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidExpirationTime",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidOffset",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidRegistry",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidRevocation",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidSchema",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidVerifier",
    type: "error",
  },
  {
    inputs: [],
    name: "Irrevocable",
    type: "error",
  },
  {
    inputs: [],
    name: "NotFound",
    type: "error",
  },
  {
    inputs: [],
    name: "NotPayable",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "attester",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "uuid",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "schema",
        type: "bytes32",
      },
    ],
    name: "Attested",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "attester",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "uuid",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "schema",
        type: "bytes32",
      },
    ],
    name: "Revoked",
    type: "event",
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
    ],
    name: "attest",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "payable",
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
    name: "attestByDelegation",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "uuid",
        type: "bytes32",
      },
    ],
    name: "getAttestation",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "uuid",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "schema",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "refUUID",
            type: "bytes32",
          },
          {
            internalType: "uint32",
            name: "time",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "expirationTime",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "revocationTime",
            type: "uint32",
          },
          {
            internalType: "address",
            name: "recipient",
            type: "address",
          },
          {
            internalType: "address",
            name: "attester",
            type: "address",
          },
          {
            internalType: "bool",
            name: "revocable",
            type: "bool",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
        ],
        internalType: "struct Attestation",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getEIP712Verifier",
    outputs: [
      {
        internalType: "contract IEIP712Verifier",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getSchemaRegistry",
    outputs: [
      {
        internalType: "contract ISchemaRegistry",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "uuid",
        type: "bytes32",
      },
    ],
    name: "isAttestationValid",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "uuid",
        type: "bytes32",
      },
    ],
    name: "revoke",
    outputs: [],
    stateMutability: "payable",
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
    name: "revokeByDelegation",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

const _bytecode =
  "0x60c06040523480156200001157600080fd5b5060405162001bbb38038062001bbb8339810160408190526200003491620000b5565b6001600160a01b0382166200005c576040516311a1e69760e01b815260040160405180910390fd5b6001600160a01b038116620000845760405163baa3de5f60e01b815260040160405180910390fd5b6001600160a01b039182166080521660a052620000f4565b6001600160a01b0381168114620000b257600080fd5b50565b60008060408385031215620000c957600080fd5b8251620000d6816200009c565b6020840151909250620000e9816200009c565b809150509250929050565b60805160a051611a86620001356000396000818160aa0152818161046a01526105680152600081816101cb015281816106610152610c530152611a866000f3fe6080604052600436106100965760003560e01c8063d3dcd11411610069578063e30bb5631161004e578063e30bb5631461017d578063f10b5cc8146101bc578063ffa1ad74146101ef57600080fd5b8063d3dcd11414610157578063d87647b21461016a57600080fd5b806315cd31a11461009b57806323156eed146100f4578063a3112a6414610115578063b75c7dc614610142575b600080fd5b3480156100a757600080fd5b507f00000000000000000000000000000000000000000000000000000000000000005b60405173ffffffffffffffffffffffffffffffffffffffff90911681526020015b60405180910390f35b610107610102366004611236565b610245565b6040519081526020016100eb565b34801561012157600080fd5b506101356101303660046112c3565b610263565b6040516100eb919061134a565b6101556101503660046112c3565b61041d565b005b61010761016536600461143a565b61042a565b6101556101783660046114ff565b610505565b34801561018957600080fd5b506101ac6101983660046112c3565b600090815260208190526040902054151590565b60405190151581526020016100eb565b3480156101c857600080fd5b507f00000000000000000000000000000000000000000000000000000000000000006100ca565b3480156101fb57600080fd5b506102386040518060400160405280600481526020017f302e31390000000000000000000000000000000000000000000000000000000081525081565b6040516100eb919061154f565b600061025788888888888888336105d5565b98975050505050505050565b604080516101408101825260008082526020820181905291810182905260608082018390526080820183905260a0820183905260c0820183905260e082018390526101008201929092526101208101919091526000828152602081815260409182902082516101408101845281548152600182015492810192909252600281015492820192909252600382015463ffffffff80821660608401526401000000008204811660808401526801000000000000000082041660a08301526c01000000000000000000000000900473ffffffffffffffffffffffffffffffffffffffff90811660c0830152600483015490811660e083015274010000000000000000000000000000000000000000900460ff1615156101008201526005820180549192916101208401919061039490611569565b80601f01602080910402602001604051908101604052809291908181526020018280546103c090611569565b801561040d5780601f106103e25761010080835404028352916020019161040d565b820191906000526020600020905b8154815290600101906020018083116103f057829003601f168201915b5050505050815250509050919050565b6104278133610a9e565b50565b6040517f2d5c429d00000000000000000000000000000000000000000000000000000000815260009073ffffffffffffffffffffffffffffffffffffffff7f00000000000000000000000000000000000000000000000000000000000000001690632d5c429d906104b3908f908f908f908f908f908f908f908f908f908f908f906004016115bc565b600060405180830381600087803b1580156104cd57600080fd5b505af11580156104e1573d6000803e3d6000fd5b505050506104f58c8c8c8c8c8c8c8c6105d5565b9c9b505050505050505050505050565b6040517f1863f01d0000000000000000000000000000000000000000000000000000000081526004810186905273ffffffffffffffffffffffffffffffffffffffff858116602483015260ff8516604483015260648201849052608482018390527f00000000000000000000000000000000000000000000000000000000000000001690631863f01d9060a401600060405180830381600087803b1580156105ac57600080fd5b505af11580156105c0573d6000803e3d6000fd5b505050506105ce8585610a9e565b5050505050565b600063ffffffff8716158015906105f857504263ffffffff168763ffffffff1611155b1561062f576040517f08e8b93700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6040517fa2ea7c6e000000000000000000000000000000000000000000000000000000008152600481018990526000907f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff169063a2ea7c6e90602401600060405180830381865afa1580156106bd573d6000803e3d6000fd5b505050506040513d6000823e601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01682016040526107039190810190611729565b805190915061073e576040517fbf37b20e00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b806040015115801561074d5750865b15610784576040517f157bd4c300000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60006040518061014001604052806000801b81526020018b81526020018881526020016107ae4290565b63ffffffff1681526020018a63ffffffff168152602001600063ffffffff1681526020018c73ffffffffffffffffffffffffffffffffffffffff1681526020018573ffffffffffffffffffffffffffffffffffffffff168152602001891515815260200187878080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920182905250939094525092935091508190505b61085c8382610ec3565b6000818152602081905260409020549092501561087b57600101610852565b81835261088a84846000610f26565b60008281526020818152604091829020855181559085015160018201559084015160028201556060840151600382018054608087015160a088015160c089015173ffffffffffffffffffffffffffffffffffffffff9081166c01000000000000000000000000026bffffffffffffffffffffffff63ffffffff93841668010000000000000000021667ffffffffffffffff948416640100000000027fffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000909616939097169290921793909317919091169390931792909217905560e0850151600483018054610100880151151574010000000000000000000000000000000000000000027fffffffffffffffffffffff000000000000000000000000000000000000000000909116929093169190911791909117905561012084015184919060058201906109d79082611887565b505089159050610a2657600089815260208190526040902054610a26576040517fc5723b5100000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b8b8673ffffffffffffffffffffffffffffffffffffffff168e73ffffffffffffffffffffffffffffffffffffffff167f8bf46bf4cfd674fa735a3d63ec1c9ad4153f033c290341f3a588b75685141b3585604051610a8691815260200190565b60405180910390a4509b9a5050505050505050505050565b60008281526020819052604090208054610ae4576040517fc5723b5100000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600481015473ffffffffffffffffffffffffffffffffffffffff838116911614610b3a576040517f4ca8886700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600481015474010000000000000000000000000000000000000000900460ff16610b90576040517f157bd4c300000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600381015468010000000000000000900463ffffffff1615610bde576040517f905e710700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6003810180547fffffffffffffffffffffffffffffffffffffffff00000000ffffffffffffffff166801000000000000000063ffffffff42160217905560018101546040517fa2ea7c6e00000000000000000000000000000000000000000000000000000000815260048101919091526000907f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff169063a2ea7c6e90602401600060405180830381865afa158015610caf573d6000803e3d6000fd5b505050506040513d6000823e601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0168201604052610cf59190810190611729565b60408051610140810182528454815260018501546020820152600285015491810191909152600384015463ffffffff80821660608401526401000000008204811660808401526801000000000000000082041660a08301526c01000000000000000000000000900473ffffffffffffffffffffffffffffffffffffffff90811660c0830152600485015490811660e083015274010000000000000000000000000000000000000000900460ff161515610100820152600584018054929350610e5592849291869161012084019190610dcc90611569565b80601f0160208091040260200160405190810160405280929190818152602001828054610df890611569565b8015610e455780601f10610e1a57610100808354040283529160200191610e45565b820191906000526020600020905b815481529060010190602001808311610e2857829003601f168201915b5050505050815250506001610f26565b6001820154600383015460405186815273ffffffffffffffffffffffffffffffffffffffff868116926c01000000000000000000000000900416907ff930a6e2523c9cc298691873087a740550b8fc85a0680830414c148ed927f6159060200160405180910390a450505050565b600082602001518360c001518460e0015185606001518660800151876101000151886040015189610120015189604051602001610f08999897969594939291906119a1565b60405160208183030381529060405280519060200120905092915050565b602083015173ffffffffffffffffffffffffffffffffffffffff8116610f4c5750505050565b3415801590610fc757508073ffffffffffffffffffffffffffffffffffffffff1663ce46e0466040518163ffffffff1660e01b8152600401602060405180830381865afa158015610fa1573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610fc59190611a5c565b155b15610ffe576040517f1574f9f300000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b81156110d7576040517f4fda5cea00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff821690634fda5cea90349061105890879060040161134a565b60206040518083038185885af1158015611076573d6000803e3d6000fd5b50505050506040513d601f19601f8201168201806040525081019061109b9190611a5c565b6110d1576040517fccf3bb2700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b50505050565b6040517f3085d69900000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff821690633085d69990349061112b90879060040161134a565b60206040518083038185885af1158015611149573d6000803e3d6000fd5b50505050506040513d601f19601f8201168201806040525081019061116e9190611a5c565b6110d1576040517fbd8ba84d00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff8116811461042757600080fd5b803563ffffffff811681146111da57600080fd5b919050565b801515811461042757600080fd5b60008083601f8401126111ff57600080fd5b50813567ffffffffffffffff81111561121757600080fd5b60208301915083602082850101111561122f57600080fd5b9250929050565b600080600080600080600060c0888a03121561125157600080fd5b873561125c816111a4565b965060208801359550611271604089016111c6565b94506060880135611281816111df565b93506080880135925060a088013567ffffffffffffffff8111156112a457600080fd5b6112b08a828b016111ed565b989b979a50959850939692959293505050565b6000602082840312156112d557600080fd5b5035919050565b60005b838110156112f75781810151838201526020016112df565b50506000910152565b600081518084526113188160208601602086016112dc565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b6020815281516020820152602082015160408201526040820151606082015260006060830151611382608084018263ffffffff169052565b50608083015163ffffffff811660a08401525060a083015163ffffffff811660c08401525060c083015173ffffffffffffffffffffffffffffffffffffffff811660e08401525060e08301516101006113f28185018373ffffffffffffffffffffffffffffffffffffffff169052565b84015190506101206114078482018315159052565b840151610140848101529050611421610160840182611300565b949350505050565b803560ff811681146111da57600080fd5b60008060008060008060008060008060006101408c8e03121561145c57600080fd5b8b35611467816111a4565b9a5060208c0135995061147c60408d016111c6565b985060608c013561148c816111df565b975060808c0135965060a08c013567ffffffffffffffff8111156114af57600080fd5b6114bb8e828f016111ed565b90975095505060c08c01356114cf816111a4565b93506114dd60e08d01611429565b92506101008c013591506101208c013590509295989b509295989b9093969950565b600080600080600060a0868803121561151757600080fd5b853594506020860135611529816111a4565b935061153760408701611429565b94979396509394606081013594506080013592915050565b6020815260006115626020830184611300565b9392505050565b600181811c9082168061157d57607f821691505b6020821081036115b6577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b600061014073ffffffffffffffffffffffffffffffffffffffff8e1683528c602084015263ffffffff8c1660408401528a151560608401528960808401528060a0840152878184015250610160878982850137600088840182015273ffffffffffffffffffffffffffffffffffffffff871660c08401527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f890116830101905060ff851660e083015261010082019390935261012001529998505050505050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6040516080810167ffffffffffffffff811182821017156116d4576116d4611682565b60405290565b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016810167ffffffffffffffff8111828210171561172157611721611682565b604052919050565b6000602080838503121561173c57600080fd5b825167ffffffffffffffff8082111561175457600080fd5b908401906080828703121561176857600080fd5b6117706116b1565b8251815283830151611781816111a4565b818501526040830151611793816111df565b60408201526060830151828111156117aa57600080fd5b80840193505086601f8401126117bf57600080fd5b8251828111156117d1576117d1611682565b611801857fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f840116016116da565b9250808352878582860101111561181757600080fd5b611826818685018787016112dc565b50606081019190915295945050505050565b601f82111561188257600081815260208120601f850160051c8101602086101561185f5750805b601f850160051c820191505b8181101561187e5782815560010161186b565b5050505b505050565b815167ffffffffffffffff8111156118a1576118a1611682565b6118b5816118af8454611569565b84611838565b602080601f83116001811461190857600084156118d25750858301515b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600386901b1c1916600185901b17855561187e565b6000858152602081207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08616915b8281101561195557888601518255948401946001909101908401611936565b508582101561199157878501517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600388901b60f8161c191681555b5050505050600190811b01905550565b89815260007fffffffffffffffffffffffffffffffffffffffff000000000000000000000000808b60601b166020840152808a60601b166034840152507fffffffff00000000000000000000000000000000000000000000000000000000808960e01b166048840152808860e01b16604c84015286151560f81b60508401528560518401528451611a398160718601602089016112dc565b60e09490941b169190920160718101919091526075019998505050505050505050565b600060208284031215611a6e57600080fd5b8151611562816111df56fea164736f6c6343000811000a";

type EASConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: EASConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class EAS__factory extends ContractFactory {
  constructor(...args: EASConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    registry: PromiseOrValue<string>,
    verifier: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<EAS> {
    return super.deploy(registry, verifier, overrides || {}) as Promise<EAS>;
  }
  override getDeployTransaction(
    registry: PromiseOrValue<string>,
    verifier: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(registry, verifier, overrides || {});
  }
  override attach(address: string): EAS {
    return super.attach(address) as EAS;
  }
  override connect(signer: Signer): EAS__factory {
    return super.connect(signer) as EAS__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): EASInterface {
    return new utils.Interface(_abi) as EASInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): EAS {
    return new Contract(address, _abi, signerOrProvider) as EAS;
  }
}
