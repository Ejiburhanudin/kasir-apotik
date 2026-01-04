
import React, { useState } from 'react';
import { Product } from '../types';

interface ProductManagementProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const ProductManagement: React.FC<ProductManagementProps> = ({ products, setProducts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null);
  const [error, setError] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const { id, name, price, stock, category } = currentProduct as Product;

    // VALIDATION: Nama harus unik
    const isDuplicateName = products.some(p => p.name.toLowerCase() === name.toLowerCase() && p.id !== id);
    if (isDuplicateName) {
      setError('Produk dengan nama yang sama sudah ada.');
      return;
    }

    // VALIDATION: Stok tidak boleh 1 (Persyaratan Soal)
    if (Number(stock) === 1) {
      setError('Stok produk tidak boleh bernilai 1.');
      return;
    }

    if (id) {
      // Update
      setProducts(prev => prev.map(p => p.id === id ? { ...p, name, price, stock, category } : p));
    } else {
      // Create
      const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
      setProducts(prev => [...prev, { id: newId, name, price: Number(price), stock: Number(stock), category }]);
    }

    setIsModalOpen(false);
    setCurrentProduct(null);
    setError('');
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Yakin ingin menghapus produk ini?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const openModal = (product?: Product) => {
    if (product) {
      setCurrentProduct(product);
    } else {
      setCurrentProduct({ name: '', price: 0, stock: 0, category: 'Obat Bebas' });
    }
    setIsModalOpen(true);
    setError('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">Manajemen Produk</h3>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <span>➕</span>
          <span>Tambah Produk</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Nama Produk</th>
              <th className="px-6 py-4">Kategori</th>
              <th className="px-6 py-4 text-right">Harga</th>
              <th className="px-6 py-4 text-center">Stok</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-semibold text-gray-800">{product.name}</td>
                <td className="px-6 py-4 text-gray-500 text-sm">{product.category}</td>
                <td className="px-6 py-4 text-right font-medium text-gray-900">Rp {product.price.toLocaleString()}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    product.stock < 10 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                  }`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4 text-center space-x-3">
                  <button onClick={() => openModal(product)} className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                  <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800 font-medium">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100">
              <h4 className="text-xl font-bold text-gray-800">{currentProduct?.id ? 'Edit' : 'Tambah'} Produk</h4>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-medium border border-red-100">{error}</div>}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  value={currentProduct?.name || ''}
                  onChange={(e) => setCurrentProduct(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  value={currentProduct?.category || 'Obat Bebas'}
                  onChange={(e) => setCurrentProduct(prev => ({ ...prev, category: e.target.value }))}
                >
                  <option>Obat Bebas</option>
                  <option>Obat Terbatas</option>
                  <option>Antibiotik</option>
                  <option>Suplemen</option>
                  <option>Obat Lambung</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    value={currentProduct?.price || 0}
                    onChange={(e) => setCurrentProduct(prev => ({ ...prev, price: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    value={currentProduct?.stock || 0}
                    onChange={(e) => setCurrentProduct(prev => ({ ...prev, stock: Number(e.target.value) }))}
                  />
                  <p className="text-[10px] text-gray-400 mt-1 italic">*Stok tidak boleh bernilai 1</p>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
