import { ethers } from 'ethers'
import { UnlockV11, PublicLockV11 } from "@unlock-protocol/contracts"
import { networks } from "../../utils/networks"
import { web3Service, unlockNetworks } from "./config"

const lockInterface = new ethers.utils.Interface(PublicLockV11.abi)

const LOCK = `
query getLock($lockAddress: String!) {
  locks(where: { address: $lockAddress }) {
    name
  }
}
`;

const KEY_PURCHASES = `
query getMemberships($walletAddress: String!) {
    keyPurchases(where: { purchaser: $walletAddress }) {
      timestamp
      lock {
        address
      }
      id
    }
  }
`;

export async function getMembershipsBynetwork(
  walletAddress: string,
  networkId: number
) {
  const network = networks[networkId];
  const response = await fetch(network.subgraphURI, {
    method: "POST",
    body: JSON.stringify({
      query: KEY_PURCHASES,
      variables: {
        walletAddress,
      },
    }),
  });
  const json = await response.json();
  const items = json.data.keyPurchases.map((item: any) => ({
    ...item,
    network: network.id,
  }));
  return items;
}

export async function getAllMemberships(walletAddress: string) {
  const items = await Promise.all(
    Object.values(networks).map((network) =>
      getMembershipsBynetwork(walletAddress, network.id)
    )
  );
  return items.flat();
}

export async function getLock(lockAddress: string, networkId: number) {
  const network = networks[networkId];
  const response = await fetch(network.subgraphURI, {
    method: "POST",
    body: JSON.stringify({
      query: LOCK,
      variables: {
        lockAddress,
      },
    }),
  });
  const json = await response.json();
  return json.data?.locks?.[0];
}

export async function hasMembership(userAddress: string, paywallConfig: any) {
  for (const [lockAddress, { network }] of Object.entries<{ network: number }>(
    paywallConfig.locks
  )) {
    const keyId = await web3Service.getTokenIdForOwner(
      lockAddress,
      userAddress,
      network
    );
    if (keyId > 0) {
      return true;
    }
  }
  return false;
}

export function buildUnlockLink(address: string, network: number) {
  return `https://app.unlock-protocol.com/demo?network=${network}&lock=${address}`
}