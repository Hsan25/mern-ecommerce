export const formatIDR = (num: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatDate = (
  date: Date | undefined | number,
  withTime = false
) => {
  if (!withTime) {
    return new Intl.DateTimeFormat("id-ID", {
      // day: "numeric",
      // month: "short",
      // year: "numeric",
      dateStyle: "long",
    }).format(date);
  }
  return new Intl.DateTimeFormat("id-ID", {
    // dateStyle: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(date);
};
export const calculateTaxPrice = (price: number): number => {
  const PPN_RATE = 0.11;
  return price * PPN_RATE;
};
