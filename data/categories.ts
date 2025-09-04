export interface Category {
  id: string;
  name: string;
  description: string;
  type: 'flowers' | 'perfumes';
  image: string;
  productCount: number;
  color: string;
  features: string[];
  icon: string;
}

export const flowerCategories: Category[] = [
  {
    id: 'wedding',
    name: 'Wedding',
    description: 'Elegant floral arrangements for your special day',
    type: 'flowers',
    image: '/images/flowers/white/white-1.jpg',
    productCount: 0,
    color: 'bg-pink-500',
    features: ['Bridal Bouquets', 'Ceremony Decor', 'Reception Centerpieces', 'Boutonnieres'],
    icon: '💒'
  },
  {
    id: 'funerals',
    name: 'Funerals',
    description: 'Respectful and beautiful arrangements for remembrance',
    type: 'flowers',
    image: '/images/flowers/white/white-2.jpg',
    productCount: 0,
    color: 'bg-gray-500',
    features: ['Sympathy Arrangements', 'Casket Sprays', 'Memorial Wreaths', 'Peaceful Colors'],
    icon: '🕊️'
  },
  {
    id: 'graduation',
    name: 'Graduation',
    description: 'Celebrate academic achievements with beautiful flowers',
    type: 'flowers',
    image: '/images/flowers/yellow/yellow-1.jpg',
    productCount: 0,
    color: 'bg-yellow-500',
    features: ['Achievement Bouquets', 'School Colors', 'Congratulatory Arrangements', 'Gift Sets'],
    icon: '🎓'
  },
  {
    id: 'mothers-day',
    name: 'Mother\'s Day',
    description: 'Show your love with special Mother\'s Day arrangements',
    type: 'flowers',
    image: '/images/flowers/pink/pink-1.jpg',
    productCount: 0,
    color: 'bg-pink-400',
    features: ['Pink & White Roses', 'Mixed Bouquets', 'Gift Packages', 'Same Day Delivery'],
    icon: '👩‍👧‍👦'
  },
  {
    id: 'anniversary',
    name: 'Anniversary',
    description: 'Romantic flowers to celebrate your love story',
    type: 'flowers',
    image: '/images/flowers/red/red-1.jpg',
    productCount: 0,
    color: 'bg-red-500',
    features: ['Red Roses', 'Romantic Arrangements', 'Premium Selection', 'Custom Messages'],
    icon: '💕'
  },
  {
    id: 'birthday',
    name: 'Birthday',
    description: 'Bright and cheerful flowers for birthday celebrations',
    type: 'flowers',
    image: '/images/flowers/mixed/mixed-1.jpg',
    productCount: 0,
    color: 'bg-purple-500',
    features: ['Colorful Mixes', 'Birthday Themes', 'Gift Wrapping', 'Balloon Options'],
    icon: '🎂'
  },
  {
    id: 'valentine',
    name: 'Valentine',
    description: 'Express your love with romantic Valentine\'s flowers',
    type: 'flowers',
    image: '/images/flowers/red/red-2.jpg',
    productCount: 0,
    color: 'bg-red-600',
    features: ['Red Roses', 'Heart Arrangements', 'Chocolate Pairings', 'Love Notes'],
    icon: '💘'
  },
  {
    id: 'date',
    name: 'Date Night',
    description: 'Perfect flowers for romantic evenings and dates',
    type: 'flowers',
    image: '/images/flowers/pink/pink-2.jpg',
    productCount: 0,
    color: 'bg-rose-400',
    features: ['Elegant Singles', 'Small Bouquets', 'Premium Roses', 'Evening Delivery'],
    icon: '🌹'
  },
  {
    id: 'engagement',
    name: 'Engagement',
    description: 'Celebrate your engagement with stunning floral arrangements',
    type: 'flowers',
    image: '/images/flowers/pink/pink-3.jpg',
    productCount: 0,
    color: 'bg-pink-300',
    features: ['Engagement Bouquets', 'Celebration Flowers', 'Gift Sets', 'Premium Roses'],
    icon: '💍'
  },
  {
    id: 'airport-pickup',
    name: 'Airport Pick Up',
    description: 'Welcome your loved ones with beautiful flowers at the airport',
    type: 'flowers',
    image: '/images/flowers/mixed/mixed-2.jpg',
    productCount: 0,
    color: 'bg-blue-400',
    features: ['Welcome Bouquets', 'Same Day Delivery', 'Airport Pickup', 'Travel Safe'],
    icon: '✈️'
  }
];

export const perfumeCategories: Category[] = [
  {
    id: 'date',
    name: 'Date',
    description: 'Seductive and romantic fragrances for special moments',
    type: 'perfumes',
    image: '/images/perfumes/perfume-1.jpg',
    productCount: 0,
    color: 'bg-red-500',
    features: ['Evening Wear', 'Long Lasting', 'Romantic Notes', 'Gift Ready'],
    icon: '💋'
  },
  {
    id: 'male',
    name: 'Male',
    description: 'Masculine fragrances for the modern gentleman',
    type: 'perfumes',
    image: '/images/perfumes/perfume-2.jpg',
    productCount: 0,
    color: 'bg-blue-600',
    features: ['Masculine Notes', 'Long Lasting', 'Professional', 'Confidence Boosting'],
    icon: '👨'
  },
  {
    id: 'female',
    name: 'Female',
    description: 'Elegant and feminine fragrances for women',
    type: 'perfumes',
    image: '/images/perfumes/perfume-3.png',
    productCount: 0,
    color: 'bg-pink-500',
    features: ['Feminine Notes', 'Elegant Scents', 'Long Lasting', 'Gift Ready'],
    icon: '👩'
  },
  {
    id: 'strong-scent',
    name: 'Strong Scent',
    description: 'Bold and powerful fragrances that make a statement',
    type: 'perfumes',
    image: '/images/perfumes/perfume-4.jpeg',
    productCount: 0,
    color: 'bg-purple-600',
    features: ['Bold Fragrance', 'Long Lasting', 'Evening Wear', 'Statement Making'],
    icon: '💪'
  },
  {
    id: 'soft-scent',
    name: 'Soft Scent',
    description: 'Gentle and subtle fragrances for everyday wear',
    type: 'perfumes',
    image: '/images/perfumes/perfume-5.png',
    productCount: 0,
    color: 'bg-green-400',
    features: ['Subtle Fragrance', 'Light & Airy', 'Everyday Wear', 'Office Friendly'],
    icon: '🌸'
  },
  {
    id: 'casual-everyday',
    name: 'Casual/Everyday Wear',
    description: 'Light and refreshing scents for daily wear',
    type: 'perfumes',
    image: '/images/perfumes/perfume-6.jpg',
    productCount: 0,
    color: 'bg-blue-400',
    features: ['Fresh & Clean', 'Light Fragrance', 'Office Friendly', 'All Day Comfort'],
    icon: '☀️'
  },
  {
    id: 'special-occasions',
    name: 'Special Occasions',
    description: 'Premium fragrances for weddings, parties, and celebrations',
    type: 'perfumes',
    image: '/images/perfumes/perfume-7.png',
    productCount: 0,
    color: 'bg-gold-500',
    features: ['Premium Quality', 'Long Lasting', 'Celebration Ready', 'Gift Perfect'],
    icon: '🎉'
  }
];

export const allCategories = [...flowerCategories, ...perfumeCategories];

export const getCategoryById = (id: string): Category | undefined => {
  return allCategories.find(cat => cat.id === id);
};

export const getCategoriesByType = (type: 'flowers' | 'perfumes'): Category[] => {
  return allCategories.filter(cat => cat.type === type);
};

export default allCategories;
