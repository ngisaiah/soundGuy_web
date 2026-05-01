-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- or via: supabase db push

CREATE TABLE IF NOT EXISTS public.licenses (
  id                       UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                  UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- 'none' | 'active' | 'refunded' | 'revoked'
  status                   TEXT        NOT NULL DEFAULT 'none'
                             CHECK (status IN ('none', 'active', 'refunded', 'revoked')),
  stripe_customer_id       TEXT,
  stripe_session_id        TEXT        UNIQUE,          -- prevents duplicate webhook processing
  stripe_payment_intent_id TEXT,
  purchased_at             TIMESTAMPTZ,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- One license row per user
CREATE UNIQUE INDEX IF NOT EXISTS licenses_user_id_idx
  ON public.licenses (user_id);

CREATE INDEX IF NOT EXISTS licenses_stripe_session_id_idx
  ON public.licenses (stripe_session_id);

CREATE INDEX IF NOT EXISTS licenses_stripe_payment_intent_id_idx
  ON public.licenses (stripe_payment_intent_id);

-- Row Level Security
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read only their own row
CREATE POLICY "users_read_own_license"
  ON public.licenses
  FOR SELECT
  USING (auth.uid() = user_id);

-- Service role (server-side API) handles all writes — no client INSERT/UPDATE policies
