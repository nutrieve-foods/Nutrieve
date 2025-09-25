-- enums
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_type') THEN
    CREATE TYPE lead_type AS ENUM ('procurement', 'sales');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_stage') THEN
    CREATE TYPE lead_stage AS ENUM ('hot', 'warm', 'cold');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_status') THEN
    CREATE TYPE lead_status AS ENUM ('open', 'hold', 'wip', 'rejected', 'won', 'lost');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'industry') THEN
    CREATE TYPE industry AS ENUM ('fmcg', 'fnb', 'pharma', 'ayurvedic', 'others');
  END IF;
END $$;

-- tables
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'agent',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lead_sources (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category lead_type NOT NULL
);

CREATE TABLE IF NOT EXISTS leads (
  id BIGSERIAL PRIMARY KEY,
  type lead_type NOT NULL,
  source_id BIGINT REFERENCES lead_sources(id),
  company TEXT,
  person_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'India',
  pincode TEXT,

  stage lead_stage NOT NULL DEFAULT 'cold',
  next_follow_up_at DATE,
  status lead_status NOT NULL DEFAULT 'open',
  tentative_order_qty NUMERIC(18,3),
  tentative_qty_unit TEXT,

  industry industry,
  notes TEXT,

  owner_id BIGINT REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lead_activities (
  id BIGSERIAL PRIMARY KEY,
  lead_id BIGINT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  actor_id BIGINT REFERENCES users(id),
  kind TEXT NOT NULL,
  body TEXT,
  at TIMESTAMPTZ NOT NULL DEFAULT now(),
  meta JSONB
);

-- indexes
CREATE INDEX IF NOT EXISTS ix_leads_type ON leads(type);
CREATE INDEX IF NOT EXISTS ix_leads_owner ON leads(owner_id);
CREATE INDEX IF NOT EXISTS ix_leads_next_fu ON leads(next_follow_up_at);
CREATE INDEX IF NOT EXISTS ix_leads_stage ON leads(stage);
CREATE INDEX IF NOT EXISTS ix_leads_status ON leads(status);