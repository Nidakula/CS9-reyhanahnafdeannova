import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const { currentUser } = useAuth(); // Mengambil info user dari context
  const navigate = useNavigate();

  useEffect(() => {
    // Ambil data produk dari backend
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/item"); // Endpoint backend
        const data = await response.json();
        if (response.ok) {
          setProducts(data.payload); // Simpan data produk ke state
        } else {
          console.error("Failed to fetch products:", data.message);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    if (!currentUser) {
      alert("Silahkan login terlebih dahulu untuk melakukan pembelian.");
      navigate("/login");
    } else {
      alert(`Produk "${product.name}" berhasil ditambahkan ke keranjang.`);
    }
  };

  return (
    <div className="container mx-auto p-6 mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-center">Check Our Latest Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-black rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-xl transition"
          >
            {/* Container untuk gambar */}
            <div className="bg-white flex justify-center items-center h-48">
              <img
                src={product.image_url} // Gunakan image_url dari backend
                alt={product.name}
                className="object-contain h-full"
              />
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="text-lg font-semibold mb-2 truncate text-white">{product.name}</h3>
              <p className="text-sm text-gray-300 flex-1 overflow-auto">
                Stok: {product.stock} unit
              </p>
              <span className="text-xl font-bold text-white mt-2">
                Rp {product.price.toLocaleString("id-ID")}
              </span>
              <button
                onClick={() => handleAddToCart(product)}
                className="mt-4 self-start px-3 py-1 bg-gray-200 text-black rounded hover:bg-gray-300 transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}