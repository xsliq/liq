import { createAppKit } from '@reown/appkit'
import { mainnet, arbitrum } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { readContract, disconnect as wagmiDisconnect } from '@wagmi/core'

// ✅ Project ID
const projectId = '27c27c402b7d754e3074c78d11c4c0fc'

// ✅ Networks
export const networks = [mainnet, arbitrum]

// ✅ Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({ projectId, networks })
export const wagmiConfig = wagmiAdapter.wagmiConfig

// ✅ Metadata
const metadata = {
  name: 'Liquidity',
  description: 'Liquidity',
  url: 'https://liq-theta.vercel.app/', // must match your live domain
  icons: ['https://liquidiumx.com/final/img/logo.png']
}

// ✅ Modal
const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  metadata,
  projectId,
  features: { analytics: true }
})

// ✅ Buttons
const connectBtn = document.getElementById('open-connect-modal')
const networkBtn = document.getElementById('open-network-modal')
const disconnectBtn = document.getElementById('disconnect-wallet')

// Connect
connectBtn?.addEventListener('click', () => modal.open())

// Network Switch
networkBtn?.addEventListener('click', () => modal.open({ view: 'Networks' }))

// ✅ Disconnect (Fixed)
disconnectBtn?.addEventListener('click', async () => {
  try {
    // 1. wagmi disconnect
    await wagmiDisconnect(wagmiConfig)

    // 2. appkit disconnect
    if (modal && modal.disconnect) {
      await modal.disconnect()
    }

    // 3. clear caches
    localStorage.removeItem("walletconnect")
    localStorage.removeItem("wagmi.store")
    sessionStorage.clear()

    alert("✅ Wallet disconnected successfully. You can reconnect now.")
  } catch (err) {
    console.error("❌ Disconnect error:", err)
    alert("Failed to disconnect. See console for details.")
  }
})

/* -----------------------
   Example Contract Read
-------------------------*/
const USDT_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7'

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

checkBtn?.addEventListener('click', async () => {
  resultEl.textContent = 'Reading totalSupply() from USDT...'
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
