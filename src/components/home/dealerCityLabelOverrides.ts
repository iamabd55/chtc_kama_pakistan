export type DealerCityLabelOverride = {
  // Optional absolute map point override (for marker anchor) on the 312.8 x 299.9752 map canvas.
  mapX?: number;
  mapY?: number;
  // Label text offset from marker anchor.
  labelX?: number;
  labelY?: number;
};

// Edit this object to manually fine-tune city label placement on the homepage map.
// Keys must match dealer city names from the database (case-sensitive).
export const dealerCityLabelOverrides: Record<string, DealerCityLabelOverride> = {
  Lahore: { labelX: 12, labelY: -8 },
  Rawalpindi: { labelX: -60, labelY: -45 },
  Islamabad: { labelX: -80, labelY: -18 },
  Faisalabad: { labelX: -55, labelY: -45 },
  Multan: { labelX: 5, labelY: -20 },
  Karachi: { labelX: -60, labelY: -10 },
};
