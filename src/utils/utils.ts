const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "UAH",
});

export const formatAsPrice = (price: number) => priceFormatter.format(price);
