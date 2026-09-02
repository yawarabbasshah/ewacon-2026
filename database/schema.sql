CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Admins Table (superadmin, research_manager, event_manager, finance)
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name varchar(150) NOT NULL,
  email varchar(255) UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role varchar(40) NOT NULL DEFAULT 'event_manager' CHECK (role IN ('superadmin', 'event_manager', 'research_manager', 'finance')),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Sponsorship / Exhibitor Packages Table
CREATE TABLE IF NOT EXISTS sponsorship_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(50) UNIQUE NOT NULL,
  price numeric(12,2) NOT NULL,
  currency varchar(10) DEFAULT 'SAR',
  description text,
  benefits jsonb NOT NULL DEFAULT '[]'
);

-- 3. Booths Table
CREATE TABLE IF NOT EXISTS booths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booth_no varchar(30) UNIQUE NOT NULL,
  booth_type varchar(40) NOT NULL DEFAULT 'standard',
  location varchar(100),
  width_m numeric(6,2),
  depth_m numeric(6,2),
  status varchar(30) NOT NULL DEFAULT 'available' CHECK (status IN ('available','reserved','occupied')),
  notes text
);

-- 4. Registrations Table (Visitor: Free; Exhibitor: Paid with package; Abstract: Researcher)
CREATE TABLE IF NOT EXISTS registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_no varchar(30) UNIQUE NOT NULL,
  registration_type varchar(30) NOT NULL CHECK (registration_type IN ('visitor','exhibitor','abstract')),
  status varchar(30) NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending','confirmed','cancelled')),
  full_name varchar(150) NOT NULL,
  organization varchar(200),
  job_title varchar(150),
  email varchar(255) NOT NULL,
  phone varchar(50),
  country varchar(100),
  package_id uuid REFERENCES sponsorship_packages(id) ON DELETE SET NULL,
  billing_contact varchar(255),
  notes text,
  -- Abstract Researcher details
  abstract_title text,
  abstract_text text,
  author_name varchar(150),
  affiliation varchar(200),
  address text,
  attachment_name varchar(255),
  attachment_data text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 5. Booth Assignments
CREATE TABLE IF NOT EXISTS booth_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booth_id uuid NOT NULL REFERENCES booths(id) ON DELETE CASCADE,
  registration_id uuid NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  assigned_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(booth_id),
  UNIQUE(registration_id)
);

-- 6. Payments Table (Exhibitors only; Visitors are free)
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  amount numeric(12,2) NOT NULL,
  status varchar(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','failed','refunded')),
  method varchar(40) DEFAULT 'bank_transfer',
  gateway_reference varchar(150),
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 7. Audit Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
  id bigserial PRIMARY KEY,
  admin_id uuid REFERENCES admins(id) ON DELETE SET NULL,
  action varchar(100) NOT NULL,
  entity_type varchar(80),
  entity_id uuid,
  details jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_reg_email ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_reg_type ON registrations(registration_type);
CREATE INDEX IF NOT EXISTS idx_reg_status ON registrations(status);
CREATE INDEX IF NOT EXISTS idx_pay_status ON payments(status);

-- Seed Packages
INSERT INTO sponsorship_packages(name, price, description, benefits) VALUES
('Platinum Exhibitor Package', 300000, 'The most comprehensive package — full coverage across all materials with prime main exhibition pavilion.', '["Logo on attendee badges","Main Stage Exhibition Booth","Interactive digital screen and branded directional flags","Logo on scientific poster template","Logo on venue directional signage","Logo on website and registration form","Social media promotion"]'),
('Gold Exhibitor Package', 100000, 'Strong visual presence across core conference materials and companion exhibition.', '["Logo on attendee badges","Exhibition booth/table","Interactive digital screen and directional flags","Logo on scientific poster template","Logo on venue signage","Logo on website and registration form","Social media promotion"]'),
('Silver Exhibitor Package', 50000, 'An accessible entry point for presence within the companion exhibition.', '["Logo on attendee badges","Exhibition booth/table","Interactive screen and directional flags","Logo on scientific poster template","Logo on venue signage","Logo on website and registration form","Social media promotion"]')
ON CONFLICT (name) DO UPDATE SET price = EXCLUDED.price, description = EXCLUDED.description, benefits = EXCLUDED.benefits;

-- Seed Booths B-01 to B-18
INSERT INTO booths (booth_no, booth_type, width_m, depth_m, status)
SELECT 
  'B-' || LPAD(i::text, 2, '0'),
  CASE WHEN i IN (1, 2) THEN 'platinum' ELSE 'standard' END,
  CASE WHEN i IN (1, 2) THEN 6.00 ELSE 3.00 END,
  3.00,
  'available'
FROM generate_series(1, 18) AS s(i)
ON CONFLICT (booth_no) DO NOTHING;
