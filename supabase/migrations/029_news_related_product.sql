-- Optional relation from news posts to a catalog product.
-- Enables a precise "View Product Details" CTA on eligible news articles.

ALTER TABLE news_posts
ADD COLUMN IF NOT EXISTS related_product_id uuid REFERENCES products(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_news_posts_related_product_id
ON news_posts(related_product_id);
