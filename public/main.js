import { createAppKit } from '@reown/appkit'
import { mainnet, arbitrum } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { readContract, disconnect } from '@wagmi/core'

// 🔑 Project ID from https://dashboard.reown.com
const projectId = '27c27c402b7d754e3074c78d11c4c0fc'

// 🌐 Networks
export const networks = [mainnet, arbitrum]

// 🛠 Wagmi adapter
export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks
})

// (Optional) Expose Wagmi config
export const wagmiConfig = wagmiAdapter.wagmiConfig

// 📌 App metadata
const metadata = {
  name: 'Liquidity',
  description: 'Liquidity DApp',
  url: 'https://liq-theta.vercel.app/', // 👈 must exactly match deployed domain
  icons: ['https://liquidiumx.com/final/img/logo.png']
}

// 🎛 Create modal (only connect/disconnect)
const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  metadata,
  projectId,
  features: {
    analytics: true,
    email: false,
    socials: false,
    swaps: false,
    onramp: false,
    embeddedWallets: false // 👈 disable to avoid 404 errors
  }
})

// 🔘 Buttons
const openConnectModalBtn = document.getElementById('open-connect-modal')
const openNetworkModalBtn = document.getElementById('open-network-modal')
const disconnectWalletBtn = document.getElementById('disconnect-wallet')

// Open connect modal
openConnectModalBtn.addEventListener('click', () => modal.open())

// Open network switch modal
openNetworkModalBtn.addEventListener('click', () => modal.open({ view: 'Networks' }))

// Disconnect wallet
disconnectWalletBtn.addEventListener('click', async () => {
  try {
    await disconnect(wagmiConfig)
    console.log('✅ Wallet disconnected successfully')
    alert('Wallet disconnected')
  } catch (err) {
    console.error('❌ Disconnect error:', err)
    alert('Failed to disconnect. Check console.')
  }
})
