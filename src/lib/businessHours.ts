// Business hours utility functions
export const BUSINESS_HOURS = {
  open: 8, // 8 AM
  close: 20, // 8 PM (20:00 in 24-hour format)
  timezone: 'Africa/Kigali'
};

export interface BusinessStatus {
  isOpen: boolean;
  nextOpenTime?: string;
  nextCloseTime?: string;
  currentTime: string;
}

/**
 * Check if the business is currently open
 * Business hours: 8 AM - 8 PM, Monday to Sunday (7 days a week)
 */
export const getBusinessStatus = (): BusinessStatus => {
  const now = new Date();
  const kigaliTime = new Date(now.toLocaleString("en-US", { timeZone: "Africa/Kigali" }));
  
  const currentHour = kigaliTime.getHours();
  const currentTimeString = kigaliTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Africa/Kigali'
  });

  const isOpen = currentHour >= BUSINESS_HOURS.open && currentHour < BUSINESS_HOURS.close;

  let nextOpenTime: string | undefined;
  let nextCloseTime: string | undefined;

  if (!isOpen) {
    // Business is closed
    if (currentHour < BUSINESS_HOURS.open) {
      // Before opening time today
      nextOpenTime = `${BUSINESS_HOURS.open}:00 AM`;
      nextCloseTime = `${BUSINESS_HOURS.close - 12}:00 PM`;
    } else {
      // After closing time today
      const tomorrow = new Date(kigaliTime);
      tomorrow.setDate(tomorrow.getDate() + 1);
      nextOpenTime = `${BUSINESS_HOURS.open}:00 AM`;
      nextCloseTime = `${BUSINESS_HOURS.close - 12}:00 PM`;
    }
  } else {
    // Business is open
    nextCloseTime = `${BUSINESS_HOURS.close - 12}:00 PM`;
  }

  return {
    isOpen,
    nextOpenTime,
    nextCloseTime,
    currentTime: currentTimeString
  };
};

/**
 * Get formatted business hours string
 */
export const getBusinessHoursString = (): string => {
  return 'Monday - Sunday: 8:00 AM - 8:00 PM';
};

/**
 * Get short business hours string
 */
export const getShortBusinessHoursString = (): string => {
  return 'Mon-Sun: 8AM-8PM';
};
