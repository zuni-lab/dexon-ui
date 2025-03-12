# DEXON UI

A modern decentralized exchange interface built with Next.js, RainbowKit, and Wagmi.

## 🚀 Features


### 💹 Advanced Trading Features
- **Multiple Order Types**:
  - 📊 Market Orders - Execute trades at the best available current price
  - 🎯 Limit Orders - Set specific price targets for trades
  - 🛑 Stop Orders - Automated trades when price reaches trigger level
  - ⏱️ TWAP Orders (Time-Weighted Average Price) - Split large orders over time to minimize price impact

### 🤖 AI Trading Assistant
- **Natural Language Order Placement**:
  - Convert natural language to trading parameters
  - Intelligent price suggestions based on market conditions
  - Context-aware order validation

### 💳 Wallet Integration
- Seamless connection with popular Web3 wallets via RainbowKit
- Secure transaction signing
- Real-time balance updates
- Transaction history tracking

### 📊 Trading Interface
- Real-time price charts and market data
- Trade history

Note: Currently not supported responsive design and mobile devices.


## 🛠 Tech Stack

- **Framework**: Next.js 15
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Web3 Integration**: 
  - RainbowKit v2
  - Wagmi v2
  - Viem
- **UI Components**: 
  - Radix UI
  - Framer Motion
  - Lucide Icons
- **Data Fetching**: TanStack Query (React Query)
- **Form Handling**: React Hook Form
- **Type Checking**: TypeScript
- **Code Quality**: 
  - Biome
  - Lefthook

## 📦 Prerequisites

- Node.js 20.x or higher
- Bun (recommended) or npm

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone git@github.com:zuni-lab/dexon-ui.git
cd dexon-ui
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env
```


Required environment variables:
- `NEXT_PUBLIC_ALCHEMY_ID`: Alchemy API key
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: RainbowKit project ID
- `NEXT_PUBLIC_API_URL`: API URL
- `NEXT_PUBLIC_MONAD_TESTNET_RPC_URL`: Monad testnet RPC URL
- `NEXT_PUBLIC_DEXON_CONTRACT`: Dexon contract address
- `NEXT_PUBLIC_COINGECKO_API_URL`: CoinGecko API URL
- `NEXT_PUBLIC_COINGECKO_API_KEY`: CoinGecko API key

4. Start the development server:
```bash
bun dev
```

## 📝 Available Scripts

- `bun dev`: Start development server
- `bun build`: Build for production
- `bun start`: Start production server
- `bun format`: Format code using Biome
- `bun prepare`: Install git hooks

## 🏗 Project Structure
```bash
dexon-ui/
├── app/ # Next.js app directory
├── components/
├── constants/ # Global constants and configurations
├── hooks/ # Custom React hooks
├── utils/ # Utility functions
├── types/ # TypeScript type definitions
├── state/ # Global state management
├── api/ # API integration
├── public/ # Static assets
└── layouts/ # Layout components
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- [RainbowKit](https://www.rainbowkit.com/)
- [Wagmi](https://wagmi.sh/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)