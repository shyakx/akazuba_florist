// Perfume products data for Akazuba Florist
// Popular perfumes available in Rwanda with Rwandan Franc pricing

export interface PerfumeProduct {
  id: number
  name: string
  brand: string
  type: 'Men' | 'Women' | 'Unisex'
  size: string
  concentration: 'EDP' | 'EDT' | 'Parfum'
  notes: string
  price: number
  description: string
  image: string
  featured: boolean
}

export const perfumeProducts: PerfumeProduct[] = [
  {
    id: 1,
    name: 'Bleu de Chanel',
    brand: 'Chanel',
    type: 'Men',
    size: '100ml',
    concentration: 'EDP',
    notes: 'Woody, Aromatic, Fresh',
    price: 250000,
    description: 'A sophisticated woody aromatic fragrance for the modern gentleman.',
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop',
    featured: true
  },
  {
    id: 2,
    name: 'Miss Dior',
    brand: 'Dior',
    type: 'Women',
    size: '50ml',
    concentration: 'EDP',
    notes: 'Floral, Fruity, Fresh',
    price: 180000,
    description: 'A romantic floral fragrance that captures the essence of love.',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop',
    featured: true
  },
  {
    id: 3,
    name: 'Acqua di Gio',
    brand: 'Giorgio Armani',
    type: 'Men',
    size: '75ml',
    concentration: 'EDT',
    notes: 'Aquatic, Fresh, Citrus',
    price: 165000,
    description: 'A refreshing aquatic fragrance inspired by the Mediterranean.',
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop',
    featured: true
  },
  {
    id: 4,
    name: 'Black Opium',
    brand: 'Yves Saint Laurent',
    type: 'Women',
    size: '90ml',
    concentration: 'EDP',
    notes: 'Oriental, Vanilla, Coffee',
    price: 220000,
    description: 'An addictive oriental fragrance with coffee and vanilla notes.',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop',
    featured: true
  },
  {
    id: 5,
    name: 'Sauvage',
    brand: 'Dior',
    type: 'Men',
    size: '100ml',
    concentration: 'EDT',
    notes: 'Fresh, Spicy, Woody',
    price: 200000,
    description: 'A powerful and fresh fragrance for the confident man.',
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop',
    featured: true
  },
  {
    id: 6,
    name: 'Good Girl',
    brand: 'Carolina Herrera',
    type: 'Women',
    size: '80ml',
    concentration: 'EDP',
    notes: 'Floral, Oriental, Vanilla',
    price: 190000,
    description: 'A seductive fragrance that celebrates the duality of women.',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop',
    featured: true
  },
  {
    id: 7,
    name: 'Light Blue',
    brand: 'Dolce & Gabbana',
    type: 'Women',
    size: '100ml',
    concentration: 'EDT',
    notes: 'Fresh, Citrus, Floral',
    price: 140000,
    description: 'A fresh and light fragrance perfect for everyday wear.',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop',
    featured: false
  },
  {
    id: 8,
    name: 'Eros',
    brand: 'Versace',
    type: 'Men',
    size: '100ml',
    concentration: 'EDT',
    notes: 'Fresh, Oriental, Woody',
    price: 160000,
    description: 'A passionate and seductive fragrance for the modern man.',
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop',
    featured: false
  },
  {
    id: 9,
    name: 'La Vie Est Belle',
    brand: 'Lancôme',
    type: 'Women',
    size: '100ml',
    concentration: 'EDP',
    notes: 'Floral, Fruity, Gourmand',
    price: 175000,
    description: 'A joyful fragrance that celebrates the beauty of life.',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop',
    featured: false
  },
  {
    id: 10,
    name: '1 Million',
    brand: 'Paco Rabanne',
    type: 'Men',
    size: '100ml',
    concentration: 'EDT',
    notes: 'Fresh, Oriental, Spicy',
    price: 180000,
    description: 'A bold and luxurious fragrance for the confident man.',
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop',
    featured: false
  },
  {
    id: 11,
    name: 'My Way',
    brand: 'Giorgio Armani',
    type: 'Women',
    size: '90ml',
    concentration: 'EDP',
    notes: 'Floral, Vanilla, White Musk',
    price: 170000,
    description: 'A personal and intimate fragrance that tells your story.',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop',
    featured: false
  },
  {
    id: 12,
    name: 'Baccarat Rouge 540',
    brand: 'Maison Francis Kurkdjian',
    type: 'Unisex',
    size: '70ml',
    concentration: 'Parfum',
    notes: 'Amber, Saffron, Jasmine',
    price: 450000,
    description: 'An exclusive and luxurious fragrance with precious ingredients.',
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop',
    featured: false
  }
]
