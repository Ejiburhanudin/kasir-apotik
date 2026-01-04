
import React from 'react';
import { Transaction } from '../types';

interface ReceiptProps {
  transaction: Transaction;
}

const Receipt: React.FC<ReceiptProps> = ({ transaction }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center">
      {/* Visual Representation */}
      <div className="bg-white p-8 rounded shadow-sm border border-gray-200 w-80 font-mono text-xs print:shadow-none print:border-none">
        <div className="text-center border-b-2 border-dashed border-gray-300 pb-4 mb-4">
          <h2 className="text-lg font-bold">PHARMA FLOW</h2>
          <p>Jl. Sehat No. 123, Jakarta</p>
          <p>Telp: 021-123456</p>
        </div>

        <div className="mb-4 space-y-1">
          <div className="flex justify-between">
            <span>NO: {transaction.id}</span>
          </div>
          <div className="flex justify-between">
            <span>TGL: {new Date(transaction.createdAt).toLocaleDateString()}</span>
            <span>JAM: {new Date(transaction.createdAt).toLocaleTimeString()}</span>
          </div>
          <div className="flex justify-between">
            <span>KASIR: {transaction.userName}</span>
          </div>
        </div>

        <div className="border-b-2 border-dashed border-gray-300 mb-4">
          {transaction.items.map(item => (
            <div key={item.id} className="mb-2">
              <div className="flex justify-between font-bold">
                <span>{item.productName}</span>
              </div>
              <div className="flex justify-between">
                <span>{item.quantity} x Rp {item.price.toLocaleString()}</span>
                <span>Rp {item.subtotal.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-1 mb-4 border-b-2 border-dashed border-gray-300 pb-2">
          <div className="flex justify-between font-bold">
            <span>SUBTOTAL</span>
            <span>Rp {transaction.totalPrice.toLocaleString()}</span>
          </div>
          {transaction.discount > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>DISKON (10%)</span>
              <span>-Rp {transaction.discount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-bold pt-1">
            <span>TOTAL</span>
            <span>Rp {transaction.finalPrice.toLocaleString()}</span>
          </div>
        </div>

        <div className="text-center italic mt-4">
          <p>Terima Kasih Atas Kunjungan Anda</p>
          <p>Semoga Lekas Sembuh</p>
        </div>
      </div>

      <button
        onClick={handlePrint}
        className="mt-6 flex items-center space-x-2 bg-gray-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-black transition-colors no-print"
      >
        <span>🖨️</span>
        <span>Cetak Struk (PDF)</span>
      </button>
    </div>
  );
};

export default Receipt;
