import { createAppKit } from '@reown/appkit'
import { mainnet, arbitrum } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { disconnect, getAccount } from '@wagmi/core'

// 🔑 Project ID from https://dashboard.reown.com
const projectId = '27c27c402b7d754e3074c78d11c4c0fc'

// 🌐 Networks
export const networks = [mainnet, arbitrum]

// 🛠 Wagmi adapter
export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks
})

// Expose Wagmi config
export const wagmiConfig = wagmiAdapter.wagmiConfig

// 📌 App metadata
const metadata = {
  name: 'Liquidity',
  description: 'Liquidity DApp',
  url: 'https://liq-theta.vercel.app', // 👈 must match deployed domain
  icons: ['https://liquidiumx.com/final/img/logo.png']
}

// 🎛 Create modal
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
    embeddedWallets: false // disable buggy feature
  }
})

// 🔘 Button
const walletBtn = document.getElementById('wallet-btn')

// Update button state
async function updateButton() {
  const account = getAccount(wagmiConfig)
  if (account?.address) {
    walletBtn.textContent = `Disconnect (${account.address.slice(0, 6)}...)`
  } else {
    walletBtn.textContent = 'Connect Wallet'
  }
}

// Handle button click
walletBtn.addEventListener('click', async () => {
  const account = getAccount(wagmiConfig)

  if (account?.address) {
    // 🔴 Disconnect flow
    try {
      await disconnect(wagmiConfig)
      if (modal?.clearCachedSession) {
        await modal.clearCachedSession()
      }
      localStorage.removeItem('wagmi.store')
      localStorage.removeItem('walletconnect')
      localStorage.removeItem('wc@2:client:0.3//session')
      console.log('✅ Disconnected + cache cleared')
    } catch (err) {
      console.error('❌ Disconnect error:', err)
      alert('Failed to disconnect. Check console.')
    }
  } else {
    // 🟢 Connect flow
    modal.open()
  }

  updateButton()
})

// Init
updateButton()
