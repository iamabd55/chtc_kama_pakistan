-- Populate images[] for Kinwin 12.5m Bus so product media is table-driven
-- Run after product slug 'bus-12m' exists

UPDATE public.products
SET images = ARRAY[
  'products/kinwin/bus-12m/driving area.jpg',
  'products/kinwin/bus-12m/exterior-front.jpg',
  'products/kinwin/bus-12m/exterior-left.jpg',
  'products/kinwin/bus-12m/interior-display-screen.jpg',
  'products/kinwin/bus-12m/interior-seats.jpg',
  'products/kinwin/bus-12m/interior-view.jpg',
  'products/kinwin/bus-12m/rear-view-mirror.jpg'
]
WHERE slug = 'bus-12m';
