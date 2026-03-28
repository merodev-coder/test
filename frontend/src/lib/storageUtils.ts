import type { Product } from '@/store/useStore';

export interface StorageAggregation {
  type: string;
  subtype: string;
  capacityGB: number;
  count: number;
  totalCapacityGB: number;
  displayName: string;
}

/**
 * Aggregates storage products by type, subtype, and capacity
 * Returns an array of storage groups with counts and total capacity
 */
export function aggregateStorageByType(products: Product[]): StorageAggregation[] {
  const storageMap = new Map<string, StorageAggregation>();

  products
    .filter((product) => product.type === 'storage' && product.storageCapacity && product.storageCapacity > 0)
    .forEach((product) => {
      const capacity = product.storageCapacity!; // We know it's not null from the filter
      const key = `${product.type}-${product.subtype}-${capacity}`;
      const existing = storageMap.get(key);

      if (existing) {
        existing.count += 1;
        existing.totalCapacityGB = existing.count * existing.capacityGB;
      } else {
        const displayName = generateStorageDisplayName(product);
        storageMap.set(key, {
          type: product.type,
          subtype: product.subtype,
          capacityGB: capacity,
          count: 1,
          totalCapacityGB: capacity,
          displayName,
        });
      }
    });

  return Array.from(storageMap.values()).sort((a, b) => b.totalCapacityGB - a.totalCapacityGB);
}

/**
 * Formats storage capacity for display
 */
export function formatStorageCapacity(capacityGB: number): string {
  if (capacityGB >= 1000) {
    const tb = capacityGB / 1000;
    return `${tb}TB`;
  }
  return `${capacityGB}GB`;
}

/**
 * Generates a human-readable display name for storage products
 */
function generateStorageDisplayName(product: Product): string {
  const capacity = formatStorageCapacity(product.storageCapacity || 0);
  const subtype = product.subtype || 'Storage';
  
  // Handle common storage types
  if (subtype.toLowerCase().includes('hdd') || subtype.toLowerCase().includes('hard')) {
    return `HDD ${capacity}`;
  } else if (subtype.toLowerCase().includes('ssd') || subtype.toLowerCase().includes('solid')) {
    return `SSD ${capacity}`;
  } else if (subtype.toLowerCase().includes('nvme') || subtype.toLowerCase().includes('m.2')) {
    return `NVMe ${capacity}`;
  }
  
  return `${subtype} ${capacity}`;
}

/**
 * Gets total storage capacity with aggregation details
 */
export function getTotalStorageWithAggregation(products: Product[]): {
  totalCapacityGB: number;
  aggregations: StorageAggregation[];
  formattedTotal: string;
} {
  const aggregations = aggregateStorageByType(products);
  const totalCapacityGB = aggregations.reduce((sum, agg) => sum + agg.totalCapacityGB, 0);
  
  return {
    totalCapacityGB,
    aggregations,
    formattedTotal: formatStorageCapacity(totalCapacityGB),
  };
}

/**
 * Creates a summary string for storage aggregation
 * Example: "2x 1TB HDD + 1x 500GB SSD = 2.5TB"
 */
export function createStorageSummary(aggregations: StorageAggregation[]): string {
  if (aggregations.length === 0) return '0GB';
  
  const parts = aggregations.map(agg => {
    if (agg.count === 1) {
      return agg.displayName;
    }
    return `${agg.count}x ${agg.displayName}`;
  });
  
  const totalCapacity = aggregations.reduce((sum, agg) => sum + agg.totalCapacityGB, 0);
  const totalFormatted = formatStorageCapacity(totalCapacity);
  
  if (parts.length === 1) {
    return `${parts[0]} = ${totalFormatted}`;
  }
  
  return `${parts.join(' + ')} = ${totalFormatted}`;
}
