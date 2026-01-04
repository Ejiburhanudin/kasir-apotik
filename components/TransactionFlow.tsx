
import React, { useState, useMemo } from 'react';
import { Product, User, Transaction, TransactionDetail } from '../types';
import { DISCOUNT_THRESHOLD, DISCOUNT_PERCENTAGE } from '../constants';
import Receipt from './Receipt';

interface TransactionFlowProps {
  products: Product[];
  user: User;
  onComplete: (transaction: Transaction) => void;
}

const TransactionFlow: React.FC<TransactionFlowProps> = ({ products, user, onComplete }) => {
  const [cart, setCart] = useState<TransactionDetail[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);

  const totals = useMemo(() => {
    const totalPrice = cart.reduce((acc, item) => acc + item.subtotal, 0);
    const discount = totalPrice >= DISCOUNT_THRESHOLD ? totalPrice * DISCOUNT_PERCENTAGE : 0;
    const finalPrice = totalPrice - discount;
    return { totalPrice, discount, finalPrice };
  }, [cart]);

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      alert('Stok habis!');
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert('Stok tidak mencukupi!');
          return prev;
        }
        return prev.map(item => item.productId === product.id 
          ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.price }
          : item
        );
      }
      return [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        productId: product.id,
        productName: product.name,
        quantity: 1,
        price: product.price,
        subtotal: product.price
      }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleProcessTransaction = () => {
    // VALIDATION: Minimal 3 produk berbeda (Sesuai Persyaratan Soal)
    if (cart.length < 3) {
      alert('Transaksi minimal harus berisi 3 jenis produk yang berbeda.');
      return;
    }

    setIsProcessing(true);
    
    const transaction: Transaction = {
      id: `TRX-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      items: [...cart],
      totalPrice: totals.totalPrice,
      discount: totals.discount,
      finalPrice: totals.finalPrice,
      createdAt: new Date().toISOString()
    };

    // Simulate delay
    setTimeout(() => {
      onComplete(transaction);
      setLastTransaction(transaction);
      setCart([]);
      setIsProcessing(false);
    }, 1000);
  };

  if (lastTransaction) {
    return (
      <div className="flex flex-col items-center">
        <div className="bg-green-50 text-green-700 px-6 py-4 rounded-2xl border border-green-100 mb-8 flex items-center space-x-3">
          <span className="text-2xl">✅</span>
          <div>
            <p className="font-bold">Transaksi Berhasil!</p>
            <p className="text-sm">Stok otomatis diperbarui & diskon telah diterapkan jika ada.</p>
          </div>
        </div>
        
        <Receipt transaction={lastTransaction} />
        
        <button
          onClick={() => setLastTransaction(null)}
          className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg no-print"
        >
          Transaksi Baru
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Product Selection */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Pilih Produk</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map(product => (
              <button
                key={product.id}
                disabled={product.stock === 0}
                onClick={() => addToCart(product)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  product.stock === 0 
                    ? 'bg-gray-50 border-gray-100 opacity-50 cursor-not-allowed'
                    : 'bg-white border-gray-200 hover:border-blue-500 hover:shadow-md'
                }`}
              >
                <div className="text-xs font-bold text-blue-600 uppercase mb-1">{product.category}</div>
                <div className="font-bold text-gray-800 truncate">{product.name}</div>
                <div className="text-sm text-gray-500 mt-1">Rp {product.price.toLocaleString()}</div>
                <div className="mt-3 flex justify-between items-center">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    product.stock < 10 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                  }`}>
                    Stock: {product.stock}
                  </span>
                  <span className="text-xl">➕</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cart / Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Keranjang Belanja</h3>
          
          <div className="space-y-4 max-h-96 overflow-y-auto mb-6 pr-2">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-400 italic text-sm">Keranjang kosong</div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex justify-between items-start pb-3 border-b border-gray-50">
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800">{item.productName}</p>
                    <p className="text-xs text-gray-500">{item.quantity}x @ Rp {item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-sm font-bold text-gray-800">Rp {item.subtotal.toLocaleString()}</p>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-[10px] text-red-500 hover:underline mt-1"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="space-y-2 pt-4 border-t border-gray-100">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>Rp {totals.totalPrice.toLocaleString()}</span>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600 font-medium">
                <span>Diskon Belanja > 100rb (10%)</span>
                <span>- Rp {totals.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t border-gray-100 mt-2">
              <span>Total Akhir</span>
              <span>Rp {totals.finalPrice.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <div className="text-[10px] text-gray-400 italic mb-2">
              *Syarat: Minimal 3 jenis produk berbeda.
            </div>
            <button
              onClick={handleProcessTransaction}
              disabled={isProcessing || cart.length === 0}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${
                isProcessing || cart.length === 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 transform hover:-translate-y-1'
              }`}
            >
              {isProcessing ? 'Memproses...' : 'Proses Pembayaran'}
            </button>
            <button
              onClick={() => setCart([])}
              className="w-full py-2 text-sm text-gray-400 font-medium hover:text-gray-600"
            >
              Reset Keranjang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionFlow;
