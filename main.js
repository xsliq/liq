import { createAppKit } from '@reown/appkit'
import { mainnet, arbitrum } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// 1) Get your Project ID from https://dashboard.reown.com
//    IMPORTANT: origin in metadata.url must match your dev/prod domain(s).
const projectId = '2aca272d18deb10ff748260da5f78bfd'

// 2) Choose networks (Viem chains wrapped by Reown)
export const networks = [mainnet, arbitrum]

// 3) Create the Wagmi adapter (this builds a Wagmi config internally)
export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks
})

// (Optional) Expose the Wagmi config for @wagmi/core actions
export const wagmiConfig = wagmiAdapter.wagmiConfig

// 4) App/site metadata used by wallets
const metadata = {
  name: 'AppKit',
  description: 'AppKit Example',
  url: 'http://192.168.29.113:5173', // change to your domain in prod
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// 5) Create the AppKit modal
const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  metadata,
  projectId,
  features: {
    analytics: true // (Optional) uses your Cloud config by default
    // You can also control socials/email/onramp/swaps/etc. here if needed.
  }
})

// 6) Wire up your own buttons
const openConnectModalBtn = document.getElementById('open-connect-modal')
const openNetworkModalBtn = document.getElementById('open-network-modal')

openConnectModalBtn.addEventListener('click', () => modal.open())
openNetworkModalBtn.addEventListener('click', () => modal.open({ view: 'Networks' }))

// --- Optional: read-only smart contract example with @wagmi/core ---
import { readContract } from '@wagmi/core'

// Example USDT (ERC-20) on Ethereum mainnet
const USDT_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7'

// Minimal ERC-20 ABI for totalSupply()
const ERC20_ABI = [
  {
    type: 'function',
    name: 'totalSupply',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  }
]

const checkBtn = document.getElementById('check-total-supply')
const resultEl = document.getElementById('result')

checkBtn.addEventListener('click', async () => {
  resultEl.textContent = 'Reading totalSupply() from USDT on mainnet...'
  try {
    const data = await readContract(wagmiConfig, {
      address: USDT_ADDRESS,
      abi: ERC20_ABI,
      functionName: 'totalSupply',
      args: []
    })
    resultEl.textContent = `USDT totalSupply: ${data.toString()}`
  } catch (err) {
    console.error(err)
    resultEl.textContent = `Error: ${err?.message || String(err)}`
  }
})
