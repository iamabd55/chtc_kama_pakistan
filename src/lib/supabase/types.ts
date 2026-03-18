// ─────────────────────────────────────────────
// Database type definitions for Al Nasir Motors Pakistan
// These mirror the Supabase tables
// ─────────────────────────────────────────────

export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    hover_image: string | null;
    display_order: number;
    is_active: boolean;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    brand: "kama" | "joylong" | "kinwin" | "chtc";
    category_id: string;
    short_description: string | null;
    model_year: number | null;
    thumbnail: string;
    images: string[];
    specs: Record<string, string | number>;
    features: string[];
    brochure_url: string | null;
    price_range: string | null;
    is_featured: boolean;
    is_active: boolean;
    meta_title: string | null;
    meta_desc: string | null;
    created_at: string;
    updated_at: string;
    // Joined
    category?: Category;
}

export interface Inquiry {
    id: string;
    full_name: string;
    phone: string;
    email: string | null;
    city: string;
    product_id: string | null;
    inquiry_type:
    | "purchase"
    | "quote"
    | "brochure"
    | "parts"
    | "service"
    | "general";
    message: string | null;
    status: "new" | "contacted" | "in-progress" | "converted" | "closed";
    assigned_to: string | null;
    notes: string | null;
    follow_up_date: string | null;
    source: "web-form" | "whatsapp" | "phone" | "walk-in";
    created_at: string;
    updated_at: string;
}

export interface Dealer {
    id: string;
    name: string;
    city: string;
    province:
    | "Punjab"
    | "Sindh"
    | "KPK"
    | "Balochistan"
    | "AJK"
    | "GB"
    | "ICT";
    address: string;
    phone: string;
    whatsapp: string | null;
    email: string | null;
    google_maps_url: string | null;
    lat: number | null;
    lng: number | null;
    dealer_type: "sales" | "service" | "both";
    brands: string[];
    working_hours: string | null;
    is_active: boolean;
    created_at: string;
}

export interface NewsPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    category: "news" | "event" | "product-launch" | "press-release";
    thumbnail: string;
    author: string;
    tags: string[];
    status: "draft" | "published";
    meta_title: string | null;
    meta_desc: string | null;
    published_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface CareerPost {
    id: string;
    title: string;
    department: string;
    location: string;
    job_type: "full-time" | "part-time" | "contract" | "internship";
    description: string;
    requirements: string[];
    responsibilities: string[];
    salary_range: string | null;
    deadline: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface JobApplication {
    id: string;
    career_post_id: string;
    applicant_name: string;
    email: string;
    phone: string;
    cv_url: string;
    cover_letter: string | null;
    status: "received" | "reviewed" | "shortlisted" | "rejected" | "hired";
    applied_at: string;
    updated_at: string;
}

export interface SiteSettings {
    id: number;
    whatsapp_number: string;
    sales_email: string;
    support_email: string | null;
    office_phone: string | null;
    office_address: string | null;
    google_maps_embed: string | null;
    social_links: Record<string, string>;
    hero_slides: Array<{
        imageUrl: string;
        title: string;
        subtitle: string;
        ctaText: string;
        ctaLink: string;
    }>;
    company_tagline: string | null;
    footer_text: string | null;
    updated_at: string;
}

export interface TeamMember {
    id: string;
    name: string;
    role: string;
    photo_url: string | null;
    bio: string | null;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface ClientLogo {
    id: string;
    name: string;
    logo_url: string;
    website_url: string | null;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface GalleryItem {
    id: string;
    title: string;
    image_url: string;
    category: "product" | "event" | "facility" | "delivery";
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Certification {
    id: string;
    title: string;
    thumbnail_url: string | null;
    document_url: string | null;
    description: string | null;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Testimonial {
    id: string;
    customer_name: string;
    customer_title: string | null;
    company: string | null;
    content: string;
    rating: number | null;
    status: "pending" | "approved" | "rejected";
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface AdminProfile {
    id: string;
    user_id: string;
    email: string;
    full_name: string | null;
    role: "super_admin" | "editor" | "sales" | "hr";
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

