import React from 'react'

interface PriceDisplayProps {
  price: number
  className?: string
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ price, className = "text-2xl font-bold text-pink-600" }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <span className={className} data-price={price} data-formatted={formatPrice(price)}>
      {formatPrice(price)}
    </span>
  )
}

export default PriceDisplay 