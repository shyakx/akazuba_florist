// Perfume products data for Akazuba Florist
// Popular perfumes available in Rwanda with Rwandan Franc pricing

export interface PerfumeProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  category: 'perfumes';
  featured: boolean;
  description: string;
  brand: string;
  type: string; // Men, Women, Unisex
  size: string; // ml
  concentration: string; // EDP, EDT, etc.
  notes: string; // Fragrance notes
}

export const perfumeProducts: PerfumeProduct[] = [
  {
    "id": 101,
    "name": "Chanel N°5 Eau de Parfum",
    "price": 185000,
    "image": "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop",
    "category": "perfumes",
    "featured": true,
    "description": "The legendary fragrance that has defined luxury for generations. A sophisticated blend of rose, jasmine, and aldehydes.",
    "brand": "Chanel",
    "type": "Women",
    "size": "50ml",
    "concentration": "EDP",
    "notes": "Rose, Jasmine, Aldehydes, Vanilla, Sandalwood"
  },
  {
    "id": 102,
    "name": "Dior Sauvage Eau de Toilette",
    "price": 165000,
    "image": "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400&h=400&fit=crop",
    "category": "perfumes",
    "featured": true,
    "description": "A powerful freshness, a raw and noble beauty. An act of creation inspired by wide-open spaces.",
    "brand": "Dior",
    "type": "Men",
    "size": "100ml",
    "concentration": "EDT",
    "notes": "Bergamot, Pepper, Ambroxan, Cedar, Labdanum"
  },
  {
    "id": 103,
    "name": "Yves Saint Laurent Black Opium",
    "price": 175000,
    "image": "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop",
    "category": "perfumes",
    "featured": true,
    "description": "An addictive gourmand fragrance with notes of coffee and vanilla. For the modern woman who dares to be different.",
    "brand": "Yves Saint Laurent",
    "type": "Women",
    "size": "50ml",
    "concentration": "EDP",
    "notes": "Coffee, Vanilla, White Flowers, Pink Pepper, Pear"
  },
  {
    "id": 104,
    "name": "Tom Ford Tobacco Vanille",
    "price": 225000,
    "image": "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop",
    "category": "perfumes",
    "featured": false,
    "description": "A modern take on an old-world men's club. A smooth oriental, tobacco leaf, vanilla, and cocoa.",
    "brand": "Tom Ford",
    "type": "Unisex",
    "size": "50ml",
    "concentration": "EDP",
    "notes": "Tobacco Leaf, Vanilla, Cocoa, Tonka Bean, Dried Fruits"
  },
  {
    "id": 105,
    "name": "Jo Malone London Wood Sage & Sea Salt",
    "price": 145000,
    "image": "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop",
    "category": "perfumes",
    "featured": false,
    "description": "Escape the everyday along the windswept shore. Waves breaking white, the air fresh with sea salt and spray.",
    "brand": "Jo Malone London",
    "type": "Unisex",
    "size": "30ml",
    "concentration": "Cologne",
    "notes": "Sea Salt, Sage, Ambrette Seeds, Sea Fennel"
  },
  {
    "id": 106,
    "name": "Versace Eros Eau de Toilette",
    "price": 125000,
    "image": "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400&h=400&fit=crop",
    "category": "perfumes",
    "featured": false,
    "description": "A fragrance that embodies the strength, passion, and beauty of the Greek god Eros.",
    "brand": "Versace",
    "type": "Men",
    "size": "100ml",
    "concentration": "EDT",
    "notes": "Mint, Green Apple, Tonka Bean, Vanilla, Vetiver"
  },
  {
    "id": 107,
    "name": "Marc Jacobs Daisy Eau de Toilette",
    "price": 135000,
    "image": "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop",
    "category": "perfumes",
    "featured": false,
    "description": "A fresh, feminine fragrance that captures the carefree spirit of a daisy in bloom.",
    "brand": "Marc Jacobs",
    "type": "Women",
    "size": "50ml",
    "concentration": "EDT",
    "notes": "Strawberry, Violet Leaves, Gardenia, Vanilla, Musk"
  },
  {
    "id": 108,
    "name": "Bleu de Chanel Eau de Parfum",
    "price": 195000,
    "image": "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400&h=400&fit=crop",
    "category": "perfumes",
    "featured": true,
    "description": "A woody aromatic fragrance for the modern man. Freedom, strength, and character.",
    "brand": "Chanel",
    "type": "Men",
    "size": "100ml",
    "concentration": "EDP",
    "notes": "Grapefruit, Pink Pepper, Mint, Ginger, Cedar, Sandalwood"
  },
  {
    "id": 109,
    "name": "Viktor&Rolf Flowerbomb",
    "price": 185000,
    "image": "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop",
    "category": "perfumes",
    "featured": false,
    "description": "An explosive floral fragrance that transforms the day into something extraordinary.",
    "brand": "Viktor&Rolf",
    "type": "Women",
    "size": "50ml",
    "concentration": "EDP",
    "notes": "Orchid, Rose, Freesia, Patchouli, Vanilla"
  },
  {
    "id": 110,
    "name": "Acqua di Gio by Giorgio Armani",
    "price": 155000,
    "image": "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400&h=400&fit=crop",
    "category": "perfumes",
    "featured": false,
    "description": "A fresh, aquatic fragrance inspired by the sea, sun, and earth of the Mediterranean.",
    "brand": "Giorgio Armani",
    "type": "Men",
    "size": "100ml",
    "concentration": "EDT",
    "notes": "Bergamot, Neroli, Jasmine, Rosemary, Patchouli, Cedar"
  },
  {
    "id": 111,
    "name": "Miss Dior Eau de Parfum",
    "price": 175000,
    "image": "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop",
    "category": "perfumes",
    "featured": false,
    "description": "A romantic and elegant fragrance that celebrates the spirit of love and femininity.",
    "brand": "Dior",
    "type": "Women",
    "size": "50ml",
    "concentration": "EDP",
    "notes": "Rose, Lily-of-the-Valley, Peony, Pink Pepper, White Musk"
  },
  {
    "id": 112,
    "name": "Le Labo Santal 33",
    "price": 285000,
    "image": "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop",
    "category": "perfumes",
    "featured": false,
    "description": "A sophisticated unisex fragrance with notes of sandalwood, cardamom, and leather.",
    "brand": "Le Labo",
    "type": "Unisex",
    "size": "50ml",
    "concentration": "EDP",
    "notes": "Sandalwood, Cardamom, Violet, Iris, Ambrette, Leather"
  }
];

export default perfumeProducts;
