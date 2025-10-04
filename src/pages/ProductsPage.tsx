import { useEffect, useState, useCallback } from 'react';
import { ShoppingCart, Check, Heart } from 'lucide-react';
import { supabase, Product, Category, WishlistItem } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type ProductsPageProps = {
  onNavigate: (page: string) => void;
  selectedCategoryId?: string;
  updateCartCount: (increment: number) => void;
  updateWishlistCount: (increment: number) => void;
};

export default function ProductsPage({ onNavigate, selectedCategoryId, updateCartCount, updateWishlistCount }: ProductsPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(selectedCategoryId || 'all');
  const [addedToCart, setAddedToCart] = useState<{ [key: string]: boolean }>({});
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const { user } = useAuth();

  const loadCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (data && !error) {
      setCategories(data);
    }
  };

  const loadProducts = useCallback(async () => {
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (selectedCategory !== 'all') {
      query = query.eq('category_id', selectedCategory);
    }

    const { data, error } = await query;

    if (data && !error) {
      setProducts(data);
    }
  }, [selectedCategory]);

  const loadWishlist = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('wishlist')
      .select('*')
      .eq('user_id', user.id);

    if (data && !error) {
      setWishlistItems(data);
    }
  }, [user]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, loadProducts]);

  useEffect(() => {
    if (user) {
      loadWishlist();
    }
  }, [user, loadWishlist]);

  useEffect(() => {
    if (selectedCategoryId) {
      setSelectedCategory(selectedCategoryId);
    }
  }, [selectedCategoryId]);

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.product_id === productId);
  };

  const handleToggleWishlist = async (productId: string) => {
    if (!user) {
      onNavigate('signup');
      return;
    }

    try {
      const isWishlisted = isInWishlist(productId);
      
      if (isWishlisted) {
        await supabase
          .from('wishlist')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);
        updateWishlistCount(-1); // Decrease count immediately
      } else {
        await supabase
          .from('wishlist')
          .insert({
            user_id: user.id,
            product_id: productId,
          });
        updateWishlistCount(1); // Increase count immediately
      }
      
      loadWishlist();
    } catch {
      // Error handled silently('Error toggling wishlist:', error);
    }
  };

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      onNavigate('signup');
      return;
    }

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

      updateCartCount(1); // Increase count immediately
      setAddedToCart({ ...addedToCart, [productId]: true });
      setTimeout(() => {
        setAddedToCart({ ...addedToCart, [productId]: false });
      }, 2000);
    } catch {
      // Error handled silently('Error adding to cart:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Our Products</h1>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              selectedCategory === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Products
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition overflow-hidden group"
              >
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>
                <div className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 flex-1">
                      {product.name}
                    </h3>
                    <button
                      onClick={() => handleToggleWishlist(product.id)}
                      className={`p-1.5 rounded-full transition ml-2 ${
                        isInWishlist(product.id)
                          ? 'text-red-500 bg-red-50'
                          : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                      }`}
                      title={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  <p className="text-gray-600 text-xs mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary-600">
                      RWF {product.price.toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                        addedToCart[product.id]
                          ? 'bg-primary-500 text-white'
                          : 'bg-primary-600 text-white hover:bg-primary-700'
                      }`}
                    >
                      {addedToCart[product.id] ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3 h-3" />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                  {product.stock_quantity < 10 && product.stock_quantity > 0 && (
                    <p className="text-xs text-primary-600 mt-2">
                      Only {product.stock_quantity} left in stock
                    </p>
                  )}
                  {product.stock_quantity === 0 && (
                    <p className="text-xs text-red-600 mt-2">Out of stock</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
