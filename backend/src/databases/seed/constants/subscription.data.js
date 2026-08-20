import { SUBSCRIPTION_FEATURES } from '../../../constants/subscription.constant.js';

export const subscriptionPlansData = [
  {
    id: "60e9eb7a8d200d3b5098de40",
    name: "Gói Miễn Phí (Free)",
    description: "Trải nghiệm hệ thống miễn phí với các tính năng cơ bản.",
    price: 0,
    billingCycle: "LIFETIME",
    maxRestaurants: 1,
    featuresData: {
      [SUBSCRIPTION_FEATURES.MENU_MANAGEMENT]: true,
      [SUBSCRIPTION_FEATURES.TABLE_MANAGEMENT]: true,
      [SUBSCRIPTION_FEATURES.ORDER_MANAGEMENT]: true,
      [SUBSCRIPTION_FEATURES.RESERVATION_ONLINE]: true,
    },
    isActive: true
  },
  {
    id: "60e9eb7a8d200d3b5098de41",
    name: "Gói Cơ Bản (Basic)",
    description: "Phù hợp cho thương hiệu nhỏ với 1-2 nhà hàng.",
    price: 500000,
    billingCycle: "MONTHLY",
    maxRestaurants: 2,
    featuresData: {
      [SUBSCRIPTION_FEATURES.MENU_MANAGEMENT]: true,
      [SUBSCRIPTION_FEATURES.TABLE_MANAGEMENT]: true,
      [SUBSCRIPTION_FEATURES.ORDER_MANAGEMENT]: true,
      [SUBSCRIPTION_FEATURES.RESERVATION_ONLINE]: true,
      [SUBSCRIPTION_FEATURES.CUSTOMER_REVIEWS]: true,
      [SUBSCRIPTION_FEATURES.ADVANCED_PROMOTIONS]: true,
      [SUBSCRIPTION_FEATURES.REVENUE_ANALYTICS]: true,
      [SUBSCRIPTION_FEATURES.LOCAL_INVENTORY]: true,
    },
    isActive: true
  },
  {
    id: "60e9eb7a8d200d3b5098de42",
    name: "Gói Chuyên Nghiệp (Pro)",
    description: "Phù hợp cho chuỗi nhà hàng vừa và lớn.",
    price: 1500000,
    billingCycle: "MONTHLY",
    maxRestaurants: 10,
    featuresData: {
      [SUBSCRIPTION_FEATURES.MENU_MANAGEMENT]: true,
      [SUBSCRIPTION_FEATURES.TABLE_MANAGEMENT]: true,
      [SUBSCRIPTION_FEATURES.ORDER_MANAGEMENT]: true,
      [SUBSCRIPTION_FEATURES.RESERVATION_ONLINE]: true,
      [SUBSCRIPTION_FEATURES.CUSTOMER_REVIEWS]: true,
      [SUBSCRIPTION_FEATURES.ADVANCED_PROMOTIONS]: true,
      [SUBSCRIPTION_FEATURES.REVENUE_ANALYTICS]: true,
      [SUBSCRIPTION_FEATURES.LOCAL_INVENTORY]: true,
      [SUBSCRIPTION_FEATURES.EMPLOYEE_PERMISSIONS]: true,
      [SUBSCRIPTION_FEATURES.PAYMENT_INTEGRATION]: true,
      [SUBSCRIPTION_FEATURES.ZALO_SMS_NOTIFICATION]: true,
      [SUBSCRIPTION_FEATURES.CENTRAL_SUPPLY_CHAIN]: true,
      [SUBSCRIPTION_FEATURES.KITCHEN_DISPLAY]: true,
    },
    isActive: true
  },
  {
    id: "60e9eb7a8d200d3b5098de43",
    name: "Gói Không Giới Hạn (Enterprise)",
    description: "Dành cho các tập đoàn lớn, không giới hạn nhà hàng.",
    price: 5000000,
    billingCycle: "YEARLY",
    maxRestaurants: -1,
    featuresData: {
      [SUBSCRIPTION_FEATURES.MENU_MANAGEMENT]: true,
      [SUBSCRIPTION_FEATURES.TABLE_MANAGEMENT]: true,
      [SUBSCRIPTION_FEATURES.ORDER_MANAGEMENT]: true,
      [SUBSCRIPTION_FEATURES.RESERVATION_ONLINE]: true,
      [SUBSCRIPTION_FEATURES.CUSTOMER_REVIEWS]: true,
      [SUBSCRIPTION_FEATURES.ADVANCED_PROMOTIONS]: true,
      [SUBSCRIPTION_FEATURES.REVENUE_ANALYTICS]: true,
      [SUBSCRIPTION_FEATURES.LOCAL_INVENTORY]: true,
      [SUBSCRIPTION_FEATURES.EMPLOYEE_PERMISSIONS]: true,
      [SUBSCRIPTION_FEATURES.PAYMENT_INTEGRATION]: true,
      [SUBSCRIPTION_FEATURES.ZALO_SMS_NOTIFICATION]: true,
      [SUBSCRIPTION_FEATURES.CENTRAL_SUPPLY_CHAIN]: true,
      [SUBSCRIPTION_FEATURES.KITCHEN_DISPLAY]: true,
      [SUBSCRIPTION_FEATURES.AI_CHATBOT_BOOKING]: true,
      [SUBSCRIPTION_FEATURES.AI_INVENTORY_PREDICT]: true,
    },
    isActive: true
  }
];
