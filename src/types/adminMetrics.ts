export interface UserGrowthMetrics {
  newSignups7Days: number;
  newSignups30Days: number;
  totalUsers: number;
  totalActiveUsers: number;
  totalActiveTrials: number;
}

export interface ConversionMetrics {
  trialToPayConversionRate: number;
  newSubscribersMonthly: number;
  newSubscribersAnnual: number;
  avgConversionTime: number;
}

export interface RevenueMetrics {
  mrr: number;
  arr: number;
  arpu: number;
}

export interface ChurnMetrics {
  cancellationsThisMonth: number;
  churnRate: number;
  avgRetentionMonths: number;
}

export interface OptionalMetrics {
  planPreference: {
    monthly: number;
    annual: number;
  };
  expiringTrials: Array<{
    id: string;
    name: string;
    email: string;
    expiresAt: string;
    daysLeft: number;
  }>;
}

export interface AdminDashboardMetrics {
  userGrowth: UserGrowthMetrics;
  conversion: ConversionMetrics;
  revenue: RevenueMetrics;
  churn: ChurnMetrics;
  optional: OptionalMetrics;
}
