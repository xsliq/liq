import { createAppKit } from '@reown/appkit'
import { mainnet, arbitrum } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { readContract, disconnect } from '@wagmi/core'

// 1) Get your Project ID from https://dashboard.reown.com
const projectId = '27c27c402b7d754e3074c78d11c4c0fc'

// 2) Choose networks (Viem chains wrapped by Reown)
export const networks = [mainnet, arbitrum]

// 3) Create the Wagmi adapter (this builds a Wagmi config internally)
export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks
})

// (Optional) Expose the Wagmi config for @wagmi/core actions
export const wagmiConfig = wagmiAdapter.wagmiConfig

// 4) Metadata - must match deployed domain
const metadata = {
  name: 'Liquidity',
  description: 'Liquidity',
  url: 'https://liq-theta.vercel.app/', // 👈 must exactly match deployed domain
  icons: ['https://liquidiumx.com/final/img/logo.png'] // 👈 keep array format
}

// 5) Create the AppKit modal
const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  metadata,
  projectId,
  features: {
    analytics: true
  }
})

// 6) Wire up your own buttons
const openConnectModalBtn = document.getElementById('open-connect-modal')
const openNetworkModalBtn = document.getElementById('open-network-modal')
const disconnectBtn = document.getElementById('disconnect-wallet')

if (openConnectModalBtn) {
  openConnectModalBtn.addEventListener('click', () => modal.open())
}

if (openNetworkModalBtn) {
  openNetworkModalBtn.addEventListener('click', () => modal.open({ view: 'Networks' }))
}

if (disconnectBtn) {
  disconnectBtn.addEventListener('click', async () => {
    try {
      await disconnect(wagmiConfig)   // Reset wagmi state
      localStorage.removeItem("walletconnect") // Clear cached WalletConnect session
      alert("Wallet disconnected successfully. You can reconnect now.")
    } catch (err) {
      console.error("Disconnect error:", err)
    }
  })
}

// --- Optional: read-only smart contract example with @wagmi/core ---
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

if (checkBtn && resultEl) {
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
}
