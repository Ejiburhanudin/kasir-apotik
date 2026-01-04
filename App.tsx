
import React, { useState, useEffect, useMemo } from 'react';
import { User, Product, Transaction, UserRole, AuthState } from './types';
import { INITIAL_PRODUCTS, MOCK_USERS } from './constants';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProductManagement from './components/ProductManagement';
import TransactionFlow from './components/TransactionFlow';
import TransactionHistory from './components/TransactionHistory';
import DatabaseSchema from './components/DatabaseSchema';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({ user: null, isAuthenticated: false });
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Load state from local storage on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('pharma_products');
    const savedTransactions = localStorage.getItem('pharma_transactions');
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
  }, []);

  // Save to local storage when state changes
  useEffect(() => {
    localStorage.setItem('pharma_products', JSON.stringify(products));
    localStorage.setItem('pharma_transactions', JSON.stringify(transactions));
  }, [products, transactions]);

  const handleLogin = (user: User) => {
    setAuth({ user, isAuthenticated: true });
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setAuth({ user: null, isAuthenticated: false });
  };

  const addTransaction = (transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev]);
    // Update stock
    setProducts(prev => prev.map(p => {
      const item = transaction.items.find(i => i.productId === p.id);
      if (item) {
        return { ...p, stock: p.stock - item.quantity };
      }
      return p;
    }));
  };

  if (!auth.isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        role={auth.user?.role || UserRole.KASIR} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
        userName={auth.user?.name || ''}
      />
      
      <main className="flex-1 p-8 ml-64 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center no-print">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 capitalize">{activeTab.replace('-', ' ')}</h1>
            <p className="text-gray-500">Welcome back, {auth.user?.name}</p>
          </div>
          <div className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Role: {auth.user?.role}
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <Dashboard transactions={transactions} products={products} />
        )}

        {activeTab === 'products' && auth.user?.role === UserRole.ADMIN && (
          <ProductManagement products={products} setProducts={setProducts} />
        )}

        {activeTab === 'transaction-new' && (
          <TransactionFlow 
            products={products} 
            user={auth.user!} 
            onComplete={addTransaction} 
          />
        )}

        {activeTab === 'history' && (
          <TransactionHistory 
            transactions={transactions} 
            currentUser={auth.user!} 
          />
        )}

        {activeTab === 'schema' && (
          <DatabaseSchema />
        )}
      </main>
    </div>
  );
};

export default App;
