import { useEffect, useState } from 'react';
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import { supabase, WishlistItem, Product } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type WishlistPageProps = {
  onNavigate: (page: string) => void;
};

type WishlistItemWithProduct = WishlistItem & {
  products: Product;
};

export default function WishlistPage({ onNavigate }: WishlistPageProps) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadWishlist();
    }
  }, [user]);

  const loadWishlist = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('wishlist')
      .select('*, products(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data && !error) {
      setWishlistItems(data as WishlistItemWithProduct[]);
    }
    setLoading(false);
  };

  const handleRemoveFromWishlist = async (itemId: string) => {
    await supabase
      .from('wishlist')
      .delete()
      .eq('id', itemId);
    
    loadWishlist();
  };

  const handleAddToCart = async (productId: string) => {
    if (!user) return;

    try {
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .maybeSingle();

      if (existingItem) {
        await supabase
          .from('cart_items')
          .update({
            quantity: existingItem.quantity + 1,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingItem.id);
      } else {
        await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity: 1,
          });
      }

      // Show success message (you could add a toast notification here)
      alert('Added to cart!');
    } catch {
      // Error handled silently('Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading wishlist...</div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <Heart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6">Start adding products to your wishlist</p>
          <button
            onClick={() => onNavigate('products')}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={() => onNavigate('products')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Products</span>
          </button>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-8">My Wishlist</h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden group"
            >
              <div className="aspect-square overflow-hidden bg-gray-100">
                <img
                  src={item.products.image_url}
                  alt={item.products.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                  {item.products.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.products.description}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-green-500">
                    RWF {item.products.price.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAddToCart(item.products.id)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {item.products.stock_quantity < 10 && item.products.stock_quantity > 0 && (
                  <p className="text-xs text-green-600 mt-2">
                    Only {item.products.stock_quantity} left in stock
                  </p>
                )}
                {item.products.stock_quantity === 0 && (
                  <p className="text-xs text-red-600 mt-2">Out of stock</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
