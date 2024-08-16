-- create and migrate new column
ALTER TABLE "CloseCallReport"
ADD COLUMN "location" geography(Point, 4326) NOT NULL
GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint("longitude", "latitude"), 4326)::geography) STORED;

CREATE INDEX idx_close_call_report_location
ON "CloseCallReport"
USING GIST("location");
