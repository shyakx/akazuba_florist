import { useEffect, useState, useCallback } from 'react';
import { CreditCard as Edit2, Trash2, Save, X, ShoppingBag, DollarSign, Package, Users, Eye, Search, MapPin, Phone, Mail, CheckCircle, Clock, Truck, Star, Activity, Calendar } from 'lucide-react';
import { supabase, Product, Category, SiteContent, Order, OrderItem, Profile } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { testEmailJS } from '../lib/emailService';

type AdminPageProps = {
  onNavigate: (page: string) => void;
};

export default function AdminPage({ onNavigate }: AdminPageProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'customers' | 'content'>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingContent, setEditingContent] = useState<{ [key: string]: string }>({});
  const [showProductForm, setShowProductForm] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    totalCustomers: 0,
    lowStockProducts: 0,
    averageOrderValue: 0,
    monthlyRevenue: 0
  });
  const [emailTestResult, setEmailTestResult] = useState<string>('');
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [productImagePreview, setProductImagePreview] = useState<string>('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [orderFilter, setOrderFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeletedProducts, setShowDeletedProducts] = useState(false);
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Profile | null>(null);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const { profile } = useAuth();

  const handleNavigate = useCallback((page: string) => {
    onNavigate(page);
  }, [onNavigate]);

  const handleTestEmail = async () => {
    setEmailTestResult('Testing email...');
    try {
      const success = await testEmailJS();
      if (success) {
        setEmailTestResult('✅ Test email sent successfully! Check your inbox.');
      } else {
        setEmailTestResult('❌ Test email failed. Check console for errors.');
      }
    } catch (error) {
      setEmailTestResult('❌ Test email failed: ' + (error as Error).message);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProductImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProductImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (!profile?.is_admin) {
      handleNavigate('home');
      return;
    }
    loadProducts();
    loadCategories();
    loadSiteContent();
    loadOrders();
    loadAnalytics();
    loadCustomers();
  }, [profile, handleNavigate]);

  const loadProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && !error) {
      setProducts(data);
    }
  };

  const loadCategories = async () => {
    const { data, error } = await supabase.from('categories').select('*').order('name');

    if (data && !error) {
      setCategories(data);
    }
  };

  const loadSiteContent = async () => {
    const { data, error } = await supabase.from('site_content').select('*').order('page');

    if (data && !error) {
      setSiteContent(data);
      const contentMap: { [key: string]: string } = {};
      data.forEach((item: SiteContent) => {
        contentMap[`${item.page}-${item.section}`] = item.content;
      });
      setEditingContent(contentMap);
    }
  };

  const loadOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && !error) {
      setOrders(data);
    }
  };

  const loadCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_admin', false)
        .order('created_at', { ascending: false });

      if (data && !error) {
        setCustomers(data);
      }
    } catch {
      // Error handled silently('Error loading customers:', error);
    }
  };

  const loadCustomerOrders = async (customerId: string) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', customerId)
        .order('created_at', { ascending: false });

      if (data && !error) {
        setCustomerOrders(data);
      }
    } catch {
      // Error handled silently('Error loading customer orders:', error);
    }
  };

  const handleViewCustomer = (customer: Profile) => {
    setSelectedCustomer(customer);
    loadCustomerOrders(customer.id);
    setShowCustomerDetails(true);
  };

  const loadAnalytics = async () => {
    try {
      // Load total products
      const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Load total orders
      const { count: orderCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      // Load total revenue
      const { data: revenueData } = await supabase
        .from('orders')
        .select('total')
        .eq('status', 'delivered');

      // Load order status counts
      const { count: pendingCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      const { count: confirmedCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'confirmed');

      const { count: processingCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'processing');

      const { count: shippedCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'shipped');

      const { count: deliveredCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'delivered');

      // Load total customers
      const { count: customerCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_admin', false);

      // Load low stock products
      const { count: lowStockCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .lt('stock_quantity', 10)
        .eq('is_active', true);

      // Load monthly revenue
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const { data: monthlyRevenueData } = await supabase
        .from('orders')
        .select('total')
        .eq('status', 'delivered')
        .gte('created_at', `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`)
        .lt('created_at', `${currentYear}-${String(currentMonth + 2).padStart(2, '0')}-01`);

      const totalRevenue = revenueData?.reduce((sum, order) => sum + order.total, 0) || 0;
      const monthlyRevenue = monthlyRevenueData?.reduce((sum, order) => sum + order.total, 0) || 0;
      const averageOrderValue = orderCount ? totalRevenue / orderCount : 0;

      setAnalytics({
        totalProducts: productCount || 0,
        totalOrders: orderCount || 0,
        totalRevenue,
        pendingOrders: pendingCount || 0,
        confirmedOrders: confirmedCount || 0,
        processingOrders: processingCount || 0,
        shippedOrders: shippedCount || 0,
        deliveredOrders: deliveredCount || 0,
        totalCustomers: customerCount || 0,
        lowStockProducts: lowStockCount || 0,
        averageOrderValue: Math.round(averageOrderValue),
        monthlyRevenue
      });
    } catch {
      // Error handled silently('Error loading analytics:', error);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);
      
      loadOrders();
      loadAnalytics();
    } catch {
      // Error handled silently('Error updating order status:', error);
    }
  };

  const loadOrderDetails = async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select('*, products(*)')
        .eq('order_id', orderId);

      if (data && !error) {
        setOrderItems(data);
      }
    } catch {
      // Error handled silently('Error loading order details:', error);
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    loadOrderDetails(order.id);
    setShowOrderDetails(true);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) {
        console.error('Error deleting order:', error);
        return;
      }

      // Remove from local state
      setOrders(orders.filter(order => order.id !== orderId));
      
      // Close modal if the deleted order was selected
      if (selectedOrder?.id === orderId) {
        setShowOrderDetails(false);
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = orderFilter === 'all' || order.status === orderFilter;
    const matchesSearch = searchTerm === '' || 
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleSaveProduct = async () => {
    if (!editingProduct) return;

    try {
      let imageUrl = editingProduct.image_url;

      // Handle image upload if a new file is selected
      if (productImageFile) {
        const fileExt = productImageFile.name.split('.').pop();
        const fileName = `${Date.now()}_${editingProduct.name?.replace(/\s+/g, '_') || 'product'}.${fileExt}`;
        
        try {
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(fileName, productImageFile);

          if (uploadError) {
            console.error('Upload error:', uploadError);
            // If upload fails, keep the existing image_url or use a placeholder
            if (!editingProduct.image_url) {
              imageUrl = 'https://via.placeholder.com/300x300/16a34a/ffffff?text=No+Image';
            }
          } else if (uploadData) {
            const { data: { publicUrl } } = supabase.storage
              .from('product-images')
              .getPublicUrl(fileName);
            imageUrl = publicUrl;
          }
        } catch (error) {
          console.error('Image upload failed:', error);
          // If upload fails, keep the existing image_url or use a placeholder
          if (!editingProduct.image_url) {
            imageUrl = 'https://via.placeholder.com/300x300/16a34a/ffffff?text=No+Image';
          }
        }
      }

      const productData = {
        ...editingProduct,
        image_url: imageUrl || 'https://via.placeholder.com/300x300/16a34a/ffffff?text=No+Image',
        updated_at: new Date().toISOString(),
      };

      if (editingProduct.id) {
        await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);
      } else {
        await supabase.from('products').insert(productData);
      }

      // Reset form
      setEditingProduct(null);
      setShowProductForm(false);
      setProductImageFile(null);
      setProductImagePreview('');
      loadProducts();
    } catch {
      // Error handled silently
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product? This will hide it from customers but you can restore it later.')) {
      try {
        // Soft delete - set is_active to false instead of permanent deletion
        await supabase
          .from('products')
          .update({ 
            is_active: false,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);
        
        loadProducts();
        alert('Product deleted successfully. It has been hidden from customers but can be restored later.');
      } catch {
        // Error handled silently('Error deleting product:', error);
        alert('Error deleting product. Please try again.');
      }
    }
  };

  const handleRestoreProduct = async (id: string) => {
    try {
      await supabase
        .from('products')
        .update({ 
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      loadProducts();
      alert('Product restored successfully!');
    } catch {
      // Error handled silently('Error restoring product:', error);
      alert('Error restoring product. Please try again.');
    }
  };

  const handleUpdateContent = async (page: string, section: string) => {
    const key = `${page}-${section}`;
    const content = editingContent[key];

    await supabase
      .from('site_content')
      .update({
        content,
        updated_at: new Date().toISOString(),
        updated_by: profile?.id,
      })
      .eq('page', page)
      .eq('section', section);

    loadSiteContent();
  };

  return (
    <div className="h-screen w-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-green-600 to-green-700 shadow-lg flex-shrink-0">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-bold text-lg">A</span>
            </div>
            <div>
              <h1 className="text-white font-semibold text-lg">AKAZUBA</h1>
              <p className="text-green-100 text-xs">Admin Panel</p>
            </div>
          </div>
          
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                activeTab === 'dashboard'
                  ? 'bg-white text-green-700 shadow-md'
                  : 'text-green-100 hover:bg-green-500 hover:text-white'
              }`}
            >
              <Activity className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </button>
            
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                activeTab === 'products'
                  ? 'bg-white text-green-700 shadow-md'
                  : 'text-green-100 hover:bg-green-500 hover:text-white'
              }`}
            >
              <Package className="w-5 h-5" />
              <span className="font-medium">Products</span>
            </button>
            
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                activeTab === 'orders'
                  ? 'bg-white text-green-700 shadow-md'
                  : 'text-green-100 hover:bg-green-500 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="font-medium">Orders</span>
            </button>
            
            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                activeTab === 'customers'
                  ? 'bg-white text-green-700 shadow-md'
                  : 'text-green-100 hover:bg-green-500 hover:text-white'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Customers</span>
            </button>
            
            <button
              onClick={() => setActiveTab('content')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                activeTab === 'content'
                  ? 'bg-white text-green-700 shadow-md'
                  : 'text-green-100 hover:bg-green-500 hover:text-white'
              }`}
            >
              <Edit2 className="w-5 h-5" />
              <span className="font-medium">Content</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 capitalize">{activeTab}</h1>
              <p className="text-gray-600 text-sm">Manage your AKAZUBA FLORIST business</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Welcome back!</p>
                <p className="text-xs text-gray-500">Admin User</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold">A</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Enhanced Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-lg">A</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Welcome back! Admin User</h1>
                  <p className="text-sm text-gray-500">Manage your store efficiently</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Last updated</p>
                  <p className="text-xs text-gray-400">{new Date().toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 overflow-auto flex-1 min-w-0">

        {activeTab === 'dashboard' && (
          <div>
            {/* Key Metrics Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 min-w-0">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Total Products</p>
                    <p className="text-xl font-bold text-gray-900">
                      {analytics.totalProducts}
                    </p>
                    {analytics.lowStockProducts > 0 && (
                      <div className="flex items-center mt-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                        <p className="text-xs text-orange-600 font-medium">
                          {analytics.lowStockProducts} low stock
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-xl">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Total Orders</p>
                    <p className="text-xl font-bold text-gray-900">
                      {analytics.totalOrders}
                    </p>
                    <div className="flex items-center mt-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      <p className="text-xs text-blue-600 font-medium">
                        Avg: RWF {analytics.averageOrderValue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-xl">
                    <ShoppingBag className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Total Revenue</p>
                    <p className="text-xl font-bold text-gray-900">
                      RWF {analytics.totalRevenue.toLocaleString()}
                    </p>
                    <div className="flex items-center mt-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <p className="text-xs text-green-600 font-medium">
                        This month: RWF {analytics.monthlyRevenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 p-4 rounded-xl">
                    <DollarSign className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Total Customers</p>
                    <p className="text-xl font-bold text-gray-900">
                      {analytics.totalCustomers}
                    </p>
                    <div className="flex items-center mt-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                      <p className="text-xs text-purple-600 font-medium">Registered users</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-xl">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Status Overview */}
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-3 mb-6 min-w-0">
              <div className="bg-white rounded-lg shadow-sm p-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-yellow-100 p-1.5 rounded-lg">
                    <Clock className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600">Pending</p>
                    <p className="text-sm font-bold text-gray-900">{analytics.pendingOrders}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600">Confirmed</p>
                    <p className="text-sm font-bold text-gray-900">{analytics.confirmedOrders}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary-100 p-2 rounded-lg">
                    <Activity className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600">Processing</p>
                    <p className="text-sm font-bold text-gray-900">{analytics.processingOrders}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Truck className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600">Shipped</p>
                    <p className="text-sm font-bold text-gray-900">{analytics.shippedOrders}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary-100 p-2 rounded-lg">
                    <Star className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600">Delivered</p>
                    <p className="text-sm font-bold text-gray-900">{analytics.deliveredOrders}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Test Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-br from-green-100 to-green-200 p-3 rounded-xl">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Email Notification Test</h3>
                  <p className="text-sm text-gray-600">Test your email notification system</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleTestEmail}
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Test Email Notification
                </button>
                {emailTestResult && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-sm text-gray-600">{emailTestResult}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-4 min-w-0">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Recent Orders</h3>
                <div className="space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-xs font-medium text-gray-800">{order.customer_name}</p>
                        <p className="text-xs text-gray-600">#{order.order_number.slice(-8)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-gray-800">RWF {order.total.toLocaleString()}</p>
                        <span className={`px-1 py-0.5 text-xs rounded-full ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'processing' ? 'bg-primary-100 text-primary-800' :
                          order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'delivered' ? 'bg-primary-100 text-primary-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Top Products</h3>
                <div className="space-y-3">
                  {products.slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-xs font-medium text-gray-800">{product.name}</p>
                        <p className="text-xs text-gray-600">Stock: {product.stock_quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-gray-800">RWF {product.price.toLocaleString()}</p>
                        <span className={`px-1 py-0.5 text-xs rounded-full ${
                          product.is_active ? 'bg-primary-100 text-primary-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
              <div className="flex space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto min-w-0">
                <table className="w-full min-w-max">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">Order #</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-40">Customer</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-20">Payment</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">Total</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">Status</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-20">Date</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-3 py-3 whitespace-nowrap text-xs font-medium text-gray-900">
                          {order.order_number.slice(-8)}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div>
                            <div className="text-xs font-medium text-gray-900 truncate">{order.customer_name}</div>
                            <div className="text-xs text-gray-500 truncate">{order.customer_email}</div>
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <span className={`inline-flex px-1 py-0.5 text-xs font-semibold rounded-full ${
                            order.payment_method === 'momo' ? 'bg-primary-100 text-primary-800' :
                            order.payment_method === 'bk' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.payment_method.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-900">
                          RWF {order.total.toLocaleString()}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className={`text-xs font-semibold rounded-full px-1 py-0.5 border-0 ${
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'processing' ? 'bg-primary-100 text-primary-800' :
                              order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                              order.status === 'delivered' ? 'bg-primary-100 text-primary-800' :
                              'bg-red-100 text-red-800'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-xs font-medium">
                          <div className="flex items-center space-x-1">
                            <button 
                              onClick={() => handleViewOrder(order)}
                              className="text-indigo-600 hover:text-indigo-900 flex items-center px-2 py-1 rounded text-xs hover:bg-indigo-50 transition-colors"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </button>
                            <button 
                              onClick={() => handleDeleteOrder(order.id)}
                              className="text-red-600 hover:text-red-900 flex items-center px-2 py-1 rounded text-xs hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Customer Management</h2>
              <div className="text-sm text-gray-600">
                Total Customers: {customers.length}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto min-w-0">
                <table className="w-full min-w-max">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-40">Customer</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-48">Email</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">Member Since</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-20">Total Orders</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">Total Spent</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-20">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {customers.map((customer) => {
                      const customerOrderStats = orders.filter(order => order.user_id === customer.id);
                      const totalSpent = customerOrderStats.reduce((sum, order) => sum + order.total, 0);
                      
                      return (
                        <tr key={customer.id} className="hover:bg-gray-50">
                          <td className="px-3 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-6 w-6">
                                <div className="h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center">
                                  <Users className="h-3 w-3 text-primary-600" />
                                </div>
                              </div>
                              <div className="ml-2">
                                <div className="text-xs font-medium text-gray-900 truncate">
                                  {customer.full_name || 'No Name'}
                                </div>
                                <div className="text-xs text-gray-500">
                                  ID: {customer.id.slice(0, 6)}...
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-900 truncate">
                            {customer.email}
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-500">
                            {new Date(customer.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-900">
                            {customerOrderStats.length}
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-900">
                            RWF {totalSpent.toLocaleString()}
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap text-xs font-medium">
                            <button 
                              onClick={() => handleViewCustomer(customer)}
                              className="text-indigo-600 hover:text-indigo-900 flex items-center text-xs"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <button
                onClick={() => {
                  setEditingProduct({
                    name: '',
                    description: '',
                    price: 0,
                    image_url: '',
                    stock_quantity: 0,
                    category_id: categories[0]?.id || '',
                    is_active: true,
                  });
                  setProductImageFile(null);
                  setProductImagePreview('');
                  setShowProductForm(true);
                }}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Add New Product
              </button>
              
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showDeletedProducts}
                    onChange={(e) => setShowDeletedProducts(e.target.checked)}
                    className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-600">Show deleted products</span>
                </label>
              </div>
            </div>

            {showProductForm && editingProduct && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {editingProduct.id ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <p className="text-gray-600">
                      {editingProduct.id ? 'Update product information' : 'Create a new product for your store'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowProductForm(false);
                      setEditingProduct(null);
                      setProductImageFile(null);
                      setProductImagePreview('');
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={editingProduct.name || ''}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, name: e.target.value })
                      }
                      placeholder="Enter product name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Category</label>
                    <select
                      value={editingProduct.category_id || ''}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, category_id: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Price (RWF)</label>
                    <input
                      type="number"
                      step="100"
                      value={editingProduct.price || ''}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })
                      }
                      placeholder="25,000"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editingProduct.stock_quantity || ''}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          stock_quantity: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Description
                    </label>
                    <textarea
                      value={editingProduct.description || ''}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, description: e.target.value })
                      }
                      rows={4}
                      placeholder="Describe your product..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Product Image
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-green-400 transition-colors duration-200">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                      />
                      <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                    </div>
                    {productImagePreview && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-3">Preview:</p>
                        <div className="relative inline-block">
                          <img
                            src={productImagePreview}
                            alt="Product preview"
                            className="w-32 h-32 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                          />
                          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            New
                          </div>
                        </div>
                      </div>
                    )}
                    {editingProduct.image_url && !productImagePreview && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-3">Current image:</p>
                        <img
                          src={editingProduct.image_url}
                          alt="Current product"
                          className="w-32 h-32 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                        />
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editingProduct.is_active || false}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, is_active: e.target.checked })
                        }
                        className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Active Product</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setShowProductForm(false);
                      setEditingProduct(null);
                      setProductImageFile(null);
                      setProductImagePreview('');
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProduct}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {editingProduct.id ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto min-w-0">
                <table className="w-full min-w-max">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 w-48">
                        Product
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 w-24">
                        Category
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 w-20">
                        Price
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 w-16">
                        Stock
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 w-20">
                        Status
                      </th>
                      <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 w-24">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {products
                      .filter(product => showDeletedProducts || product.is_active)
                      .map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50 transition">
                        <td className="px-3 py-3">
                          <div className="flex items-center space-x-2">
                            <img
                              src={product.image_url || 'https://via.placeholder.com/300x300/16a34a/ffffff?text=No+Image'}
                              alt={product.name}
                              className="w-8 h-8 rounded object-cover"
                              onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/300x300/16a34a/ffffff?text=No+Image';
                              }}
                            />
                            <div>
                              <div className="text-xs font-medium text-gray-800 truncate">{product.name}</div>
                              <div className="text-xs text-gray-500 line-clamp-1">
                                {product.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-xs text-gray-700">
                          {categories.find((c) => c.id === product.category_id)?.name}
                        </td>
                        <td className="px-3 py-3 text-xs font-semibold text-gray-800">
                          RWF {product.price.toLocaleString()}
                        </td>
                        <td className="px-3 py-3 text-xs text-gray-700">{product.stock_quantity}</td>
                        <td className="px-3 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              product.is_active
                                ? 'bg-primary-100 text-primary-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {product.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex justify-end space-x-1">
                            <button
                              onClick={() => {
                                setEditingProduct(product);
                                setShowProductForm(true);
                              }}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                              title="Edit Product"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            {product.is_active ? (
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                                title="Delete Product (Soft Delete)"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleRestoreProduct(product.id)}
                                className="p-1 text-primary-600 hover:bg-primary-50 rounded transition"
                                title="Restore Product"
                              >
                                <Save className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Site Content</h2>

            <div className="space-y-6">
              {siteContent.map((item) => (
                <div key={item.id} className="border-b pb-6 last:border-b-0">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 capitalize">
                        {item.page} - {item.section.replace(/_/g, ' ')}
                      </h3>
                    </div>
                    <button
                      onClick={() => handleUpdateContent(item.page, item.section)}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition text-sm font-medium"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                  </div>
                  <textarea
                    value={editingContent[`${item.page}-${item.section}`] || ''}
                    onChange={(e) =>
                      setEditingContent({
                        ...editingContent,
                        [`${item.page}-${item.section}`]: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Enhanced Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold">Order Details</h3>
                  <p className="text-green-100 mt-1">Order #{selectedOrder.order_number}</p>
                </div>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="text-white hover:text-green-200 transition-colors p-2 rounded-lg hover:bg-green-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Order Status Banner */}
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      selectedOrder.status === 'pending' ? 'bg-yellow-500' :
                      selectedOrder.status === 'confirmed' ? 'bg-blue-500' :
                      selectedOrder.status === 'processing' ? 'bg-primary-500' :
                      selectedOrder.status === 'shipped' ? 'bg-purple-500' :
                      selectedOrder.status === 'delivered' ? 'bg-green-500' :
                      'bg-red-500'
                    }`}></div>
                    <span className="text-lg font-semibold text-gray-800">Order Status</span>
                  </div>
                  <span className={`px-4 py-2 text-sm font-semibold rounded-full ${
                    selectedOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    selectedOrder.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                    selectedOrder.status === 'processing' ? 'bg-primary-100 text-primary-800' :
                    selectedOrder.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                    selectedOrder.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedOrder.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Order Information */}
                <div className="lg:col-span-1">
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Package className="w-5 h-5 mr-2 text-green-600" />
                      Order Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Order Number:</span>
                        <span className="font-medium text-gray-900">{selectedOrder.order_number}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Payment Method:</span>
                        <span className="font-medium text-gray-900">{selectedOrder.payment_method.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-bold text-lg text-green-600">RWF {selectedOrder.total.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Order Date:</span>
                        <span className="font-medium text-gray-900">{new Date(selectedOrder.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Order Time:</span>
                        <span className="font-medium text-gray-900">{new Date(selectedOrder.created_at).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="lg:col-span-1">
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-green-600" />
                      Customer Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{selectedOrder.customer_name}</div>
                          <div className="text-sm text-gray-500">Customer</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{selectedOrder.customer_email}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{selectedOrder.customer_phone}</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                        <div>
                          <div className="text-gray-700 font-medium">{selectedOrder.delivery_address}</div>
                          <div className="text-sm text-gray-500">{selectedOrder.delivery_city}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Actions */}
                <div className="lg:col-span-1">
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-green-600" />
                      Order Actions
                    </h4>
                    <div className="space-y-3">
                      <select
                        value={selectedOrder.status}
                        onChange={(e) => {
                          updateOrderStatus(selectedOrder.id, e.target.value);
                          setSelectedOrder({...selectedOrder, status: e.target.value as Order['status']});
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button
                        onClick={() => handleDeleteOrder(selectedOrder.id)}
                        className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Order
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Order Items */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <ShoppingBag className="w-5 h-5 mr-2 text-green-600" />
                  Order Items ({orderItems.length} items)
                </h4>
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  {orderItems.map((item, index) => (
                    <div key={item.id} className={`p-6 ${index !== orderItems.length - 1 ? 'border-b border-gray-100' : ''}`}>
                      <div className="flex items-center space-x-6">
                        {/* Large Product Image */}
                        <div className="flex-shrink-0">
                          <img 
                            src={item.products?.image_url || 'https://via.placeholder.com/300x300/16a34a/ffffff?text=No+Image'} 
                            alt={item.products?.name || 'Product'}
                            className="w-24 h-24 object-cover rounded-xl shadow-md"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/300x300/16a34a/ffffff?text=No+Image';
                            }}
                          />
                        </div>
                        
                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h5 className="text-lg font-semibold text-gray-900 mb-1">
                            {item.products?.name || 'Unknown Product'}
                          </h5>
                          {item.products?.description && (
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                              {item.products.description}
                            </p>
                          )}
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Quantity: <span className="font-medium text-gray-900">{item.quantity}</span></span>
                            <span>Price: <span className="font-medium text-gray-900">RWF {(item.products?.price || 0).toLocaleString()}</span></span>
                          </div>
                        </div>
                        
                        {/* Total Price */}
                        <div className="flex-shrink-0 text-right">
                          <div className="text-xl font-bold text-green-600">
                            RWF {((item.quantity * (item.products?.price || 0))).toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.quantity} × RWF {(item.products?.price || 0).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <Edit2 className="w-5 h-5 mr-2 text-green-600" />
                    Order Notes
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-700">{selectedOrder.notes}</p>
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex justify-end pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Details Modal - Matching Order Details Style */}
      {showCustomerDetails && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold">Customer Details</h3>
                  <p className="text-green-100 mt-1">Customer #{selectedCustomer.id.slice(-8)}</p>
                </div>
                <button
                  onClick={() => setShowCustomerDetails(false)}
                  className="text-white hover:text-green-200 transition-colors p-2 rounded-lg hover:bg-green-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Customer Status Banner */}
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-lg font-semibold text-gray-800">Customer Status</span>
                  </div>
                  <span className="px-4 py-2 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                    ACTIVE CUSTOMER
                  </span>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Customer Information */}
                <div className="lg:col-span-1">
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-green-600" />
                      Customer Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Customer Name:</span>
                        <span className="font-medium text-gray-900">{selectedCustomer.full_name || 'No Name'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Email Address:</span>
                        <span className="font-medium text-gray-900">{selectedCustomer.email}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Member Since:</span>
                        <span className="font-medium text-gray-900">{new Date(selectedCustomer.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Customer ID:</span>
                        <span className="font-medium text-gray-900">{selectedCustomer.id.slice(0, 8)}...</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Statistics */}
                <div className="lg:col-span-1">
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <ShoppingBag className="w-5 h-5 mr-2 text-green-600" />
                      Order Statistics
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Orders:</span>
                        <span className="font-medium text-gray-900">{customerOrders.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Spent:</span>
                        <span className="font-bold text-lg text-green-600">RWF {customerOrders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Average Order:</span>
                        <span className="font-medium text-gray-900">
                          RWF {customerOrders.length > 0 ? Math.round(customerOrders.reduce((sum, order) => sum + order.total, 0) / customerOrders.length).toLocaleString() : '0'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Last Order:</span>
                        <span className="font-medium text-gray-900">
                          {customerOrders.length > 0 ? new Date(customerOrders[0].created_at).toLocaleDateString() : 'No orders'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Actions */}
                <div className="lg:col-span-1">
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-green-600" />
                      Customer Actions
                    </h4>
                    <div className="space-y-3">
                      <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                        <Mail className="w-4 h-4 mr-2" />
                        Send Email
                      </button>
                      <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                        <Phone className="w-4 h-4 mr-2" />
                        Call Customer
                      </button>
                      <button className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center">
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Order History */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-green-600" />
                  Order History ({customerOrders.length} orders)
                </h4>
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  {customerOrders.length > 0 ? (
                    customerOrders.map((order, index) => (
                      <div key={order.id} className={`p-6 ${index !== customerOrders.length - 1 ? 'border-b border-gray-100' : ''}`}>
                        <div className="flex items-center space-x-6">
                          {/* Order Info */}
                          <div className="flex-1 min-w-0">
                            <h5 className="text-lg font-semibold text-gray-900 mb-1">
                              {order.order_number}
                            </h5>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(order.created_at).toLocaleDateString()}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{new Date(order.created_at).toLocaleTimeString()}</span>
                              </span>
                            </div>
                          </div>

                          {/* Order Status */}
                          <div className="flex-shrink-0">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'processing' ? 'bg-primary-100 text-primary-800' :
                              order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {order.status.toUpperCase()}
                            </span>
                          </div>

                          {/* Total Price */}
                          <div className="flex-shrink-0 text-right">
                            <div className="text-xl font-bold text-green-600">
                              RWF {order.total.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.payment_method.toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-lg font-medium">No orders found</p>
                      <p className="text-gray-400 text-sm">This customer hasn't placed any orders yet.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowCustomerDetails(false)}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
          </div>
        </div>
      </div>
    </div>
  );
}
