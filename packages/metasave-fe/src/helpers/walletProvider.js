import evmProvider from "./evmProvider";

export const getWalletProvider = (provider) => {
    return evmProvider(provider);
};