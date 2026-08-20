import { useQuery } from '@tanstack/react-query';
import { getRestaurantCrmAnalyticsService, getBrandCrmAnalyticsService, getBrandLoyaltyTransactionsService } from '../service/crm.get.service';

export const useGetRestaurantCrmAnalytics = (restaurantId: string | null) => {
  return useQuery({
    queryKey: ['crmAnalytics', 'restaurant', restaurantId],
    queryFn: () => getRestaurantCrmAnalyticsService(restaurantId!),
    enabled: !!restaurantId,
    staleTime: 60 * 1000,
  });
};

export const useGetBrandCrmAnalytics = (brandId: string | null) => {
  return useQuery({
    queryKey: ['crmAnalytics', 'brand', brandId],
    queryFn: () => getBrandCrmAnalyticsService(brandId!),
    enabled: !!brandId,
    staleTime: 60 * 1000,
  });
};

export const useGetBrandLoyaltyTransactions = (brandId: string | null) => {
  return useQuery({
    queryKey: ['loyaltyTransactions', 'brand', brandId],
    queryFn: () => getBrandLoyaltyTransactionsService(brandId!),
    enabled: !!brandId,
    staleTime: 60 * 1000,
  });
};
