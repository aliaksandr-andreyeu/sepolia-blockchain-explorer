export type BlockSummary = {
  number: string;
  hash: string;
  timestamp: string;
  transactionCount: number;
  gasUsed: string;
  gasLimit: string;
};

export type NetworkStats = {
  blockNumber: string;
  gasPrice: string;
  latestBlockAge: string;
};

export type TransactionSummary = {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  blockNumber: string;
  timestamp: string;
};

export type TransferSummary = {
  uniqueId: string;
  hash: string;
  from: string;
  to: string | null;
  value: string;
  category: string;
  blockNumber: string;
  timestamp: string | null;
  direction: "in" | "out";
};
