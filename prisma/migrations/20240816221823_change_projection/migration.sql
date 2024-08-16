DROP INDEX idx_close_call_report_location;

ALTER TABLE "CloseCallReport"
DROP COLUMN "location";

ALTER TABLE "CloseCallReport"
ADD COLUMN "location" geometry(Point, 3857) NOT NULL
GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint("longitude", "latitude"), 3857)) STORED;

CREATE INDEX idx_close_call_report_location
ON "CloseCallReport"
USING GIST("location");
