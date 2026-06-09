-- RLS Policies for Facelo
-- Run this in the Supabase SQL editor AFTER running db:migrate.
-- Drizzle manages table structure; RLS policies are managed here.

-- ─── FK from users.id to auth.users ─────────────────────────────────────────
ALTER TABLE users
  ADD CONSTRAINT users_id_fkey
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- ─── Enable RLS on all tables ───────────────────────────────────────────────
ALTER TABLE users             ENABLE ROW LEVEL SECURITY;
ALTER TABLE creators          ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories        ENABLE ROW LEVEL SECURITY;
ALTER TABLE products          ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos            ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders            ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items       ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments          ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds           ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_events   ENABLE ROW LEVEL SECURITY;
ALTER TABLE click_events      ENABLE ROW LEVEL SECURITY;
ALTER TABLE traffic_sources   ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_roles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attribution_config ENABLE ROW LEVEL SECURITY;

-- ─── users ──────────────────────────────────────────────────────────────────
-- Authenticated users can read their own row.
-- All writes (insert/update) go through Drizzle with the service-role connection.
CREATE POLICY "users_select_own" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- ─── creators ───────────────────────────────────────────────────────────────
CREATE POLICY "creators_select_approved" ON creators
  FOR SELECT TO anon, authenticated
  USING (status = 'approved');

-- Creators can also read their own row regardless of status
CREATE POLICY "creators_select_own" ON creators
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "creators_update_own" ON creators
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── categories ─────────────────────────────────────────────────────────────
CREATE POLICY "categories_select_public" ON categories
  FOR SELECT TO anon, authenticated
  USING (true);

-- ─── products ───────────────────────────────────────────────────────────────
CREATE POLICY "products_select_active" ON products
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

-- ─── videos ─────────────────────────────────────────────────────────────────
CREATE POLICY "videos_select_approved" ON videos
  FOR SELECT TO anon, authenticated
  USING (is_approved = true);

CREATE POLICY "videos_select_own" ON videos
  FOR SELECT TO authenticated
  USING (creator_id IN (SELECT id FROM creators WHERE user_id = auth.uid()));

CREATE POLICY "videos_insert_own" ON videos
  FOR INSERT TO authenticated
  WITH CHECK (creator_id IN (SELECT id FROM creators WHERE user_id = auth.uid()));

CREATE POLICY "videos_update_own" ON videos
  FOR UPDATE TO authenticated
  USING (creator_id IN (SELECT id FROM creators WHERE user_id = auth.uid()))
  WITH CHECK (creator_id IN (SELECT id FROM creators WHERE user_id = auth.uid()));

-- ─── video_products ──────────────────────────────────────────────────────────
CREATE POLICY "video_products_select" ON video_products
  FOR SELECT TO anon, authenticated
  USING (video_id IN (SELECT id FROM videos WHERE is_approved = true));

CREATE POLICY "video_products_write_own" ON video_products
  FOR ALL TO authenticated
  USING (video_id IN (SELECT id FROM videos WHERE creator_id IN (SELECT id FROM creators WHERE user_id = auth.uid())))
  WITH CHECK (video_id IN (SELECT id FROM videos WHERE creator_id IN (SELECT id FROM creators WHERE user_id = auth.uid())));

-- ─── orders ─────────────────────────────────────────────────────────────────
CREATE POLICY "orders_select_own" ON orders
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "orders_insert_own" ON orders
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ─── order_items ────────────────────────────────────────────────────────────
CREATE POLICY "order_items_select_own" ON order_items
  FOR SELECT TO authenticated
  USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

-- ─── payments ───────────────────────────────────────────────────────────────
CREATE POLICY "payments_select_own" ON payments
  FOR SELECT TO authenticated
  USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

-- ─── refunds ────────────────────────────────────────────────────────────────
CREATE POLICY "refunds_select_own" ON refunds
  FOR SELECT TO authenticated
  USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

-- ─── sessions ───────────────────────────────────────────────────────────────
-- Anonymous browsing creates sessions; authenticated users can also create them.
CREATE POLICY "sessions_insert_public" ON sessions
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "sessions_select_own" ON sessions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL);

-- ─── referral_events ────────────────────────────────────────────────────────
CREATE POLICY "referral_events_insert_public" ON referral_events
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- ─── click_events ────────────────────────────────────────────────────────────
CREATE POLICY "click_events_insert_public" ON click_events
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- ─── traffic_sources ─────────────────────────────────────────────────────────
CREATE POLICY "traffic_sources_insert_public" ON traffic_sources
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- ─── commissions ─────────────────────────────────────────────────────────────
CREATE POLICY "commissions_select_own" ON commissions
  FOR SELECT TO authenticated
  USING (creator_id IN (SELECT id FROM creators WHERE user_id = auth.uid()));

-- ─── admin_roles ─────────────────────────────────────────────────────────────
CREATE POLICY "admin_roles_select_authenticated" ON admin_roles
  FOR SELECT TO authenticated
  USING (true);

-- ─── admin_permissions ───────────────────────────────────────────────────────
CREATE POLICY "admin_permissions_select_authenticated" ON admin_permissions
  FOR SELECT TO authenticated
  USING (true);

-- ─── attribution_config ──────────────────────────────────────────────────────
CREATE POLICY "attribution_config_select_public" ON attribution_config
  FOR SELECT TO anon, authenticated
  USING (true);
