export interface Asset {
  id: number;
  name: string;
  symbol: string;
  amount: number;
  purchasePrice: number;
  category: string;
  userId: number;
  updatedAt: string;
  currentPrice: number;
  totalValue: number;
  costBasis: number;
  totalGain: number;
  roi: number;
  change24h?: number;
  createdAt: string;
}

export interface SearchResult {
  symbol: string;
  name: string;
  type: string;
  isLocal?: boolean;
}
export interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssetAdded: () => void;
}

export interface AssetProps {
  asset: Asset;
  onDelete: (id: number) => void;
  onEdit: (asset: Asset) => void;
  formatValue: (value: number) => string;
}

export interface EditAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssetUpdated: () => void;
  asset: Asset;
}

export interface User {
  id: number;
  email: string;
  name: string;
  plan?: string;
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export interface AssetDataPoint {
  name: string;
  value: number;
}
export interface ColoredDataPoint extends AssetDataPoint {
  fill: string;
}

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export type Currency = "USD" | "EUR" | "GBP" | "BTC";
export type Theme = "dark" | "light";

export interface SettingsContextType {
  currency: Currency;
  theme: Theme;
  setCurrency: (c: Currency) => void;
  setTheme: (t: Theme) => void;
  formatValue: (value: number) => string;
}

export interface PortfolioHistoryEntry {
  id: number;
  userId: number;
  totalValue: number;
  date: string;
}

export interface ChartDataPoint extends PortfolioHistoryEntry {
  displayDate: string;
}

export interface TooltipPayloadItem {
  value: number;
  name: string;
  payload: ChartDataPoint;
}

export interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
  formatValue: (val: number) => string;
}

export interface PortfolioSummary {
  totalMarketValue: number;
  totalCostBasis: number;
  totalGain: number;
  totalROI: number;
}

export interface TransactionWithAsset {
  id: number;
  type: "BUY" | "SELL";
  amount: number;
  shares: number;
  createdAt: string;
  asset: {
    symbol: string;
    name: string;
  };
}

export interface AssetResponse {
  assets: Asset[];
  summary: PortfolioSummary;
}

export interface Trade {
  symbol: string;
  name: string;
  action: "BUY" | "SELL";
  amount: number;
  shares: number;
}

export interface SavedSimAsset {
  id: number;
  simWeight: number;
}

export interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  trades: Trade[];
}