
import React from 'react';
import { Transaction, User, UserRole } from '../types';

interface TransactionHistoryProps {
  transactions: Transaction[];
  currentUser: User;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions, currentUser }) => {
  // Logic: Admin can see all, Kasir only sees their own (Sesuai Persyaratan Soal)
  const filteredTransactions = currentUser.role === UserRole.ADMIN 
    ? transactions 
    : transactions.filter(t => t.userId === currentUser.id);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-800">
          {currentUser.role === UserRole.ADMIN ? 'Seluruh Riwayat Transaksi' : 'Riwayat Transaksi Saya'}
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">ID Transaksi</th>
              <th className="px-6 py-4">Waktu</th>
              {currentUser.role === UserRole.ADMIN && <th className="px-6 py-4">Kasir</th>}
              <th className="px-6 py-4 text-center">Item</th>
              <th className="px-6 py-4 text-right">Total Akhir</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredTransactions.map((trx) => (
              <tr key={trx.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs font-bold text-blue-600">{trx.id}</td>
                <td className="px-6 py-4 text-gray-500 text-sm">
                  {new Date(trx.createdAt).toLocaleString('id-ID')}
                </td>
                {currentUser.role === UserRole.ADMIN && (
                  <td className="px-6 py-4 text-gray-700 font-medium">{trx.userName}</td>
                )}
                <td className="px-6 py-4 text-center text-sm font-medium">
                  {trx.items.length} Macam
                </td>
                <td className="px-6 py-4 text-right font-bold text-gray-800">
                  Rp {trx.finalPrice.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="text-blue-600 hover:underline text-sm font-bold">Detail</button>
                </td>
              </tr>
            ))}
            {filteredTransactions.length === 0 && (
              <tr>
                <td colSpan={currentUser.role === UserRole.ADMIN ? 6 : 5} className="px-6 py-12 text-center text-gray-400 italic">
                  Belum ada riwayat transaksi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;
