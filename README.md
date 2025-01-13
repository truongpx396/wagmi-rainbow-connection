# Wagmi Rainbow Connection

This project is a React application that demonstrates the integration of the `Wagmi` library with `RainbowKit` for managing `EVM-Compatible wallets` and interacting with `smart contracts`. The project is built using `Vite`, `TypeScript`, and `React`, and includes features for connecting to various EVM-Compatible networks, transferring `native` tokens, and interacting with `ERC-20` tokens.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Wagmi Implementation](#wagmi-implementation)

- [RainbowKit Implementation](#rainbowkit-implementation)
- [Usage](#usage)
- [Scripts](#scripts)
- [License](#license)

## Features

- Connect to EVM-Compatible wallets using RainbowKit
- Switch between different EVM-Compatible networks
- Transfer native tokens (e.g., ETH, BNB) to specified addresses
- Interact with `ERC-20` tokens (e.g., check balance, transfer tokens)
- Responsive UI with styled components
- TypeScript for type safety and better developer experience
- Prettier and ESLint for code formatting and linting

## Project Structure

```js
|-- .env
|-- .env-example
|-- .gitignore
|-- .prettierrc
|-- .vscode/
|   |-- settings.json
|-- eslint.config.js
|-- index.html
|-- package.json
|-- public/
|-- README.md
|-- src/
|   |-- App.css
|   |-- App.tsx
|   |-- assets/
|   |-- components/
|   |   |-- ContractInteraction.tsx
|   |   |-- NativeTokenTransfer.tsx
|   |   |-- NetworkSelector.css
|   |   |-- NetworkSelector.tsx
|   |   |-- TransactionStatus.css
|   |   |-- TransactionStatus.tsx
|   |   |-- WalletOptions.tsx
|   |-- constants/
|   |   |-- abi/
|   |-- index.css
|   |-- main.tsx
|   |-- pages/
|   |   |-- Home.css
|   |   |-- Home.tsx
|   |   |-- Rainbow.css
|   |   |-- Rainbow.tsx
|   |   |-- Wagmi.css
|   |   |-- Wagmi.tsx
|   |-- vite-env.d.ts
|   |-- walletConfig.ts
|-- tsconfig.app.json
|-- tsconfig.json
|-- tsconfig.node.json
|-- vite.config.ts
```

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```sh
git clone https://github.com/truongpx396/wagmi-rainbow-connection.git
cd wagmi-rainbow-connection
```

2. Install dependencies:

```sh
npm install
# or
yarn install
```

3. Create a `.env` file based on the `.env-example` file and add your project ID:

```sh
cp .env-example .env
```

Update the `VITE_REOWN_PROJECT_ID` variable in the `.env` file with your project ID.

## Configuration

The project uses environment variables for configuration. The `.env` file should contain the following variables:

```sh
VITE_REOWN_PROJECT_ID=YOUR_PROJECT_ID
```

To get `reown` (formerly known WalletConnect) project Id go to [Reown Cloud](https://cloud.reown.com/)

## Wagmi Implementation

The project leverages the Wagmi library to manage EVM-Compatible wallet connections and interactions with smart contracts. Wagmi provides a set of React hooks and utilities that simplify the process of connecting to EVM-Compatible networks, fetching account balances, and executing transactions.

### Key Features

- **Wallet Connection**: Users can connect their EVM-Compatible wallets using various connectors such as MetaMask and WalletConnect.
- **Network Switching**: Users can switch between different EVM-Compatible networks (e.g., Mainnet, Polygon, BSC) seamlessly.
- **Balance Fetching**: The project fetches and displays the native token balance of the connected wallet.
- **Token Transfers**: Users can transfer native tokens (e.g., ETH, BNB) to specified addresses.
- **Contract Interaction**: The project allows users to interact with `ERC-20` tokens, including checking balances and transferring tokens.

### Key Components

- **WalletOptions**: This component provides buttons for users to connect their wallets using different connectors.
- **NetworkSelector**: This component allows users to switch between different EVM-Compatible networks.
- **NativeTokenTransfer**: This component enables users to transfer native tokens to specified addresses.
- **ContractInteraction**: This component allows users to interact with `ERC-20` tokens, including checking balances and transferring tokens.

### Configuration

The Wagmi configuration is defined in the `src/walletConfig.ts` file. It includes the setup for different chains and connectors.

## RainbowKit Implementation

The project leverages RainbowKit to provide a seamless and user-friendly interface for connecting EVM-Compatible wallets. RainbowKit offers a set of React components and hooks that simplify the process of integrating wallet connections into your application.

### Key Features

- **Connect Button**: A customizable button that allows users to connect their EVM-Compatible wallets.
- **Theme Customization**: Easily customizable themes to match the look and feel of your application.
- **Locale Support**: Support for different locales to provide a localized user experience.

### Key Components

- **ConnectButton**: This component provides a button for users to connect their EVM-Compatible wallets.
- **RainbowKitProvider**: This component wraps your application and provides the necessary context for RainbowKit to function.
- **NetworkSelector**: This component allows users to switch between different EVM-Compatible networks.

### Configuration

The RainbowKit configuration is defined in the `src/walletConfig.ts` file. It includes the setup for different chains and connectors.

## Usage

#### Running the Development Server

To start the development server, run:

```sh
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3004`.

#### Building the Project

To build the project for production, run:

```sh
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

### Linting and Formatting

To lint the code, run:

```sh
npm run lint
# or
yarn lint
```

To format the code, run:

```sh
npm run format
# or
yarn format
```

## Scripts

- `dev`: Starts the development server
- `build`: Builds the project for production
- `lint`: Lints the code using ESLint
- `format`: Formats the code using Prettier
- `format:check`: Checks the code formatting using Prettier

## License

This project is licensed under the MIT License.
