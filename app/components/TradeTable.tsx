"use client";

import React, { useState, useEffect } from "react";

interface Token {
  symbol: string;
  amount: string;
  address: string;
}

interface Trade {
  transactionHash: string;
  timestamp: number;
  type: "BUY" | "SELL";
  tokenSold: Token;
  tokenBought: Token;
  priceImpact: string;
}

interface WebSocketMessage {
  type: "initial" | "newTrade";
  trades?: Trade[];
  trade?: Trade;
}

const TradeTable = () => {
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    const ws = new WebSocket(
      "ws://ec2-98-84-208-109.compute-1.amazonaws.com:3000"
    );

    ws.onmessage = (event) => {
      const data: WebSocketMessage = JSON.parse(event.data);

      if (data.type === "initial" && data.trades) {
        setTrades(data.trades);
      } else if (data.type === "newTrade" && data.trade) {
        setTrades((prevTrades) => [data.trade!, ...prevTrades]);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  const openEtherscan = (hash: string) => {
    window.open(`https://etherscan.io/tx/${hash}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="w-full h-screen overflow-auto">
        <table className="w-full border-collapse">
          <thead className="bg-black sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Token Sold
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Amount Sold
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Token Bought
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Amount Bought
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {trades.map((trade) => (
              <tr
                key={`${trade.transactionHash}-${trade.timestamp}`}
                className="hover:bg-gray-900 cursor-pointer font-bold animate-fade-in"
                onClick={() => openEtherscan(trade.transactionHash)}
              >
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${
                    trade.type === "BUY" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {trade.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">
                  {trade.tokenSold.symbol}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">
                  {Number(trade.tokenSold.amount).toLocaleString(undefined, {
                    maximumFractionDigits: 6,
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">
                  {trade.tokenBought.symbol}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">
                  {Number(trade.tokenBought.amount).toLocaleString(undefined, {
                    maximumFractionDigits: 6,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TradeTable;
