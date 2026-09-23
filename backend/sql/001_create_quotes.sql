BEGIN;

CREATE TABLE quotes (
  id UUID PRIMARY KEY,

  client_id UUID NOT NULL
    REFERENCES clients(id)
    ON DELETE RESTRICT,

  title VARCHAR(120) NOT NULL,
    description TEXT,

  amount NUMERIC(12, 2) NOT NULL,
  CHECK (amount >= 0),

  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  CHECK (
    status IN (
      'draft',
      'sent',
      'approved',
      'rejected',
      'expired'
    )
  ),

  valid_until DATE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_quotes_clients_id
ON quotes(client_id);

CREATE INDEX idx_quotes_status
ON quotes(status);

CREATE INDEX idx_quotes_created_at
ON quotes(created_at DESC);

COMMIT;