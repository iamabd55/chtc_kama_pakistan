import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Products from "./pages/Products";
import AfterSales from "./pages/AfterSales";
import FindDealer from "./pages/FindDealer";
import Fabrication from "./pages/Fabrication";
import About from "./pages/About";
import News from "./pages/News";
import Contact from "./pages/Contact";
import GetQuote from "./pages/GetQuote";
import Careers from "./pages/Careers";
import Brands from "./pages/Brands";
import Gallery from "./pages/Gallery";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:category" element={<Products />} />
          <Route path="/after-sales" element={<AfterSales />} />
          <Route path="/find-dealer" element={<FindDealer />} />
          <Route path="/fabrication" element={<Fabrication />} />
          <Route path="/about" element={<About />} />
          <Route path="/about/:section" element={<About />} />
          <Route path="/news" element={<News />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/get-quote" element={<GetQuote />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/brands/:brand" element={<Brands />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
