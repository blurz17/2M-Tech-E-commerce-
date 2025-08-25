import { Currency } from "../models/currency.model"; // Added import

export const getDefaultCurrencySymbol = async (): Promise<string> => {
    const defaultCurrency = await Currency.findOne({ isDefault: true });
    return defaultCurrency?.symbol || "$";
};
