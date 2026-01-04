
import React from 'react';

const DatabaseSchema: React.FC = () => {
  const migrationsCode = `
// Database Migrations (Laravel 12 Style)

Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->string('password');
    $table->enum('role', ['admin', 'kasir']);
    $table->timestamps();
});

Schema::create('products', function (Blueprint $table) {
    $table->id();
    $table->string('name')->unique();
    $table->integer('stock');
    $table->decimal('price', 12, 2);
    $table->timestamps();
});

Schema::create('transactions', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained('users');
    $table->decimal('total_price', 15, 2);
    $table->decimal('discount', 15, 2)->default(0);
    $table->decimal('final_price', 15, 2);
    $table->timestamps();
});

Schema::create('transaction_details', function (Blueprint $table) {
    $table->id();
    $table->foreignId('transaction_id')->constrained('transactions')->onDelete('cascade');
    $table->foreignId('product_id')->constrained('products');
    $table->integer('quantity');
    $table->decimal('price', 12, 2);
    $table->decimal('subtotal', 15, 2);
    $table->timestamps();
});
  `;

  const seederCode = `
// Database Seeder (Laravel 12 Style)

public function run(): void
{
    // Minimal 5 Produk sesuai permintaan
    Product::insert([
        ['name' => 'Paracetamol 500mg', 'stock' => 100, 'price' => 5000, 'created_at' => now()],
        ['name' => 'Amoxicillin 500mg', 'stock' => 50, 'price' => 12000, 'created_at' => now()],
        ['name' => 'Cetirizine Syrup', 'stock' => 30, 'price' => 25000, 'created_at' => now()],
        ['name' => 'Vitamin C 1000mg', 'stock' => 200, 'price' => 1500, 'created_at' => now()],
        ['name' => 'Antacid Doen', 'stock' => 80, 'price' => 3000, 'created_at' => now()],
    ]);

    User::create([
        'name' => 'Admin Apotek',
        'email' => 'admin@apotek.com',
        'password' => bcrypt('password'),
        'role' => 'admin',
    ]);
}
  `;

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Struktur Database (Laravel 12 Migration)</h3>
        <p className="text-sm text-gray-500 mb-6">Berikut adalah kode sumber desain database untuk diimplementasikan di Laravel:</p>
        
        <div className="bg-gray-900 rounded-xl p-6 overflow-x-auto">
          <pre className="text-blue-400 text-xs font-mono leading-relaxed">
            {migrationsCode}
          </pre>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Seeder & Data Contoh</h3>
        <div className="bg-gray-900 rounded-xl p-6 overflow-x-auto">
          <pre className="text-green-400 text-xs font-mono leading-relaxed">
            {seederCode}
          </pre>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl">
          <h4 className="font-bold text-blue-800 mb-2">Relasi Tabel</h4>
          <ul className="text-xs text-blue-600 space-y-1 list-disc pl-4">
            <li>Transaction ➔ User (Many to One)</li>
            <li>Transaction ➔ Product (Many to Many via Detail)</li>
          </ul>
        </div>
        <div className="p-6 bg-green-50 border border-green-100 rounded-2xl">
          <h4 className="font-bold text-green-800 mb-2">Role Permissions</h4>
          <ul className="text-xs text-green-600 space-y-1 list-disc pl-4">
            <li>Admin: CRUD Produk, Laporan, Kasir</li>
            <li>Kasir: Penjualan, Riwayat Pribadi</li>
          </ul>
        </div>
        <div className="p-6 bg-purple-50 border border-purple-100 rounded-2xl">
          <h4 className="font-bold text-purple-800 mb-2">Business Logic</h4>
          <ul className="text-xs text-purple-600 space-y-1 list-disc pl-4">
            <li>Stok tidak boleh bernilai 1 (Validation)</li>
            <li>Diskon 10% jika Belanja > 100.000</li>
            <li>Minimal 3 jenis produk per transaksi</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DatabaseSchema;
