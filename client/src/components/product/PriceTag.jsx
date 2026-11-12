// client/src/components/product/PriceTag.jsx
import { formatCurrency } from '../../utils/formatCurrency';

const PriceTag = ({ basePrice, salePrice, size = 'md' }) => {
  const hasSale = salePrice && Number(salePrice) < Number(basePrice);
  const currentPrice = hasSale ? salePrice : basePrice;

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl',
  };

  return (
    <div className="flex items-baseline gap-2.5 flex-wrap">
      <span className={`font-extrabold text-lime-400 font-display ${sizeClasses[size]}`}>
        {formatCurrency(currentPrice)}
      </span>
      {hasSale && (
        <span className="text-xs text-zinc-500 line-through">{formatCurrency(basePrice)}</span>
      )}
    </div>
  );
};

export default PriceTag;
