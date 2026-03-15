-- Populate images[] for CHTC Coaster C7 so product media is table-driven
-- Run after product slug 'coaster-c7' exists

UPDATE public.products
SET images = ARRAY[
  'products/chtc/coaster-c7/driving part pic-2-zoomed-out.png',
  'products/chtc/coaster-c7/driving-part-pic-1.png',
  'products/chtc/coaster-c7/driving-part-pic-3.png',
  'products/chtc/coaster-c7/exterior-back-pic-1.png',
  'products/chtc/coaster-c7/exterior-back-pic-2.png',
  'products/chtc/coaster-c7/exterior-front-pic-1.png',
  'products/chtc/coaster-c7/interior-main-pic-1.png',
  'products/chtc/coaster-c7/interior-pic-1.png',
  'products/chtc/coaster-c7/interior-seats-pic-1.png'
]
WHERE slug = 'coaster-c7';
