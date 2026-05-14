import React, { useEffect, useState } from "react";
import { productsApi, Product } from "../../api/productsApi";

export const LatestProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsApi.getProducts();
        // Sort by createdAt if available, otherwise just take first 4
        const sorted = data.sort((a, b) => 
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        ).slice(0, 4);
        setProducts(sorted);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-wider">Latest Products</h4>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Recently added items to your store</p>
        </div>
        <button className="text-xs font-black text-orange-600 uppercase tracking-widest hover:underline">View All</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="h-[320px] rounded-[32px] bg-gray-50 dark:bg-white/[0.02] animate-pulse" />
          ))
        ) : (
          products.map((product) => (
            <div key={product.id} className="group relative bg-white dark:bg-[#0A0A0A] rounded-[32px] border border-gray-100 dark:border-white/[0.05] overflow-hidden shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-md text-[9px] font-black uppercase tracking-widest text-orange-600 dark:text-orange-500 shadow-sm">
                    {product.category}
                  </span>
                </div>
              </div>
              
              <div className="p-5">
                <h5 className="text-base font-black text-gray-900 dark:text-white mb-1 line-clamp-1">{product.name}</h5>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-4">{product.brand}</span>
                
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-gray-900 dark:text-white">${product.price}</span>
                  <div className="flex items-center gap-1">
                    <div className={`h-2 w-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-[10px] font-bold text-gray-500 uppercase">{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                  </div>
                </div>
              </div>
              
              {/* Hover Action Overlay */}
              <div className="absolute inset-0 bg-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
