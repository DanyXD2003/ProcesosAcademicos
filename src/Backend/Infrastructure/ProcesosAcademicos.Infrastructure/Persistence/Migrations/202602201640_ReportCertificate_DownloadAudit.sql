ALTER TABLE academic_records
    ADD COLUMN "ProfessorNameSnapshot" character varying(160);

CREATE TABLE report_download_events
(
    "Id" uuid NOT NULL,
    "ReportRequestId" uuid NOT NULL,
    "DownloadedAt" timestamp with time zone NOT NULL,
    "IpAddress" character varying(64),
    "UserAgent" character varying(512),
    CONSTRAINT "PK_report_download_events" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_report_download_events_report_requests_ReportRequestId"
        FOREIGN KEY ("ReportRequestId") REFERENCES report_requests ("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_report_download_events_DownloadedAt"
    ON report_download_events ("DownloadedAt");

CREATE INDEX "IX_report_download_events_ReportRequestId"
    ON report_download_events ("ReportRequestId");

UPDATE academic_records ar
SET "ProfessorNameSnapshot" = COALESCE(
    (
        SELECT p."FullName"
        FROM enrollments e
        INNER JOIN course_offerings o ON o."Id" = e."CourseOfferingId"
        LEFT JOIN professors p ON p."Id" = o."ProfessorId"
        WHERE e."StudentId" = ar."StudentId"
          AND o."CourseId" = ar."CourseId"
          AND o."Term" = ar."Period"
        ORDER BY o."CreatedAt" DESC
        LIMIT 1
    ),
    'N/D'
)
WHERE ar."ProfessorNameSnapshot" IS NULL;
