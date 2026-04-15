"use client";

import dynamic from "next/dynamic";

const DefaultLoadingSpinner = () => (
  <div className="w-full h-96 flex items-center justify-center bg-gradient-to-b from-muted/10 to-muted/5">
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const SectionLoadingFallback = (height = "h-96") => () => (
  <div className={`${height} animate-pulse bg-gradient-to-b from-muted/10 to-muted/5`} />
);

export const GalleryPage = dynamic(() => import("@/components/gallery/GalleryClient"), {
  loading: SectionLoadingFallback("h-[600px]"),
});

export const DealerFinder = dynamic(() => import("@/components/find-dealer/DealerDirectory"), {
  loading: SectionLoadingFallback("h-[800px]"),
});

export const ProductFilters = dynamic(() => import("@/components/products/ProductsExplorer"), {
  loading: SectionLoadingFallback("h-64"),
});

export const ProductGrid = dynamic(() => import("@/components/products/CategoryProductGrid"), {
  loading: SectionLoadingFallback("h-96"),
});

export const NewsGrid = dynamic(() => import("@/components/news/NewsListingClient"), {
  loading: SectionLoadingFallback("h-96"),
});

export const InteractiveMap = dynamic(() => import("@/components/find-dealer/DealerLeafletMap"), {
  loading: SectionLoadingFallback("h-[500px]"),
  ssr: false,
});

export const ComparisonTool = dynamic(() => import("@/components/products/ProductGallery"), {
  loading: SectionLoadingFallback("h-96"),
});

export const ConfiguratorTool = dynamic(() => import("@/components/products/ProductInquiryForm"), {
  loading: SectionLoadingFallback("h-full"),
});

export const lazyComponentMap = {
  GalleryPage,
  DealerFinder,
  ProductFilters,
  ProductGrid,
  NewsGrid,
  InteractiveMap,
  ComparisonTool,
  ConfiguratorTool,
};

export default lazyComponentMap;
