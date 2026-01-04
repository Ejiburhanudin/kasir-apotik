
import React, { useMemo } from 'react';
import { Transaction, Product } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

interface DashboardProps {
  transactions: Transaction[];
  products: Product[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, products }) => {
  const stats = useMemo(() => {
    const totalSales = transactions.reduce((acc, t) => acc + t.finalPrice, 0);
    const totalTransactions = transactions.length;
    const itemsSold = transactions.reduce((acc, t) => acc + t.items.reduce((sum, i) => sum + i.quantity, 0), 0);
    
    // Product frequency
    const freq: Record<string, number> = {};
    transactions.forEach(t => {
      t.items.forEach(item => {
        freq[item.productName] = (freq[item.productName] || 0) + item.quantity;
      });
    });

    const topProducts = Object.entries(freq)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Daily Sales Laporan (Last 7 Days)
    const daily: Record<string, number> = {};
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      daily[key] = 0;
    }

    transactions.forEach(t => {
      const date = t.createdAt.split('T')[0];
      if (daily[date] !== undefined) {
        daily[date] += t.finalPrice;
      }
    });

    const salesChartData = Object.entries(daily)
      .map(([date, amount]) => ({ date, amount }))
      .reverse();

    return { totalSales, totalTransactions, itemsSold, topProducts, salesChartData };
  }, [transactions]);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 text-2xl">
            💰
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Penjualan</p>
            <p className="text-2xl font-bold text-gray-800">Rp {stats.totalSales.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 text-2xl">
            📈
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Jumlah Transaksi</p>
            <p className="text-2xl font-bold text-gray-800">{stats.totalTransactions}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 text-2xl">
            📦
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Item Terjual</p>
            <p className="text-2xl font-bold text-gray-800">{stats.itemsSold}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Laporan Penjualan Harian (7 Hari)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.salesChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{fontSize: 10}} />
                <YAxis tick={{fontSize: 10}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value) => [`Rp ${value.toLocaleString()}`, 'Total']}
                />
                <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Produk Paling Sering Dibeli</h3>
          {stats.topProducts.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.topProducts}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({name}) => name}
                  >
                    {stats.topProducts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400 italic">
              Belum ada data transaksi
            </div>
          )}
        </div>
      </div>

      {/* Stock Alert */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Peringatan Stok Rendah</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-bold text-gray-400 border-b border-gray-100 uppercase tracking-wider">
                <th className="px-4 py-3">Nama Produk</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Stok Tersisa</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.filter(p => p.stock < 20).map(product => (
                <tr key={product.id} className="text-sm">
                  <td className="px-4 py-3 font-medium text-gray-800">{product.name}</td>
                  <td className="px-4 py-3 text-gray-500">{product.category}</td>
                  <td className="px-4 py-3">
                    <span className={`font-bold ${product.stock <= 5 ? 'text-red-600' : 'text-orange-600'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      product.stock <= 5 ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                      {product.stock <= 5 ? 'KRITIS' : 'RENDAH'}
                    </span>
                  </td>
                </tr>
              ))}
              {products.filter(p => p.stock < 20).length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-400 italic">Semua stok produk aman</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
