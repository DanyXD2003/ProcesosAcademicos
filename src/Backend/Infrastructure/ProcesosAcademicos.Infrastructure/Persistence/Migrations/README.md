# Migraciones EF Core

Migracion base generada:

- `20260220044647_202602202240_InitialAcademicFlow`
- `202602201640_ReportCertificate_DownloadAudit`

Script SQL generado:

- `202602202240_InitialAcademicFlow.sql`
- `202602201640_ReportCertificate_DownloadAudit.sql`

## Convencion de nombres

Usar `YYYYMMDDHHmm_Feature_Change`.

## Siguiente estrategia (faseada)

A partir de la base inicial, los cambios siguientes deben salir en migraciones separadas por bloque funcional:

1. Seguridad y perfiles
2. Cursos y ofertas
3. Pensum/cohortes
4. Inscripciones y notas
5. Reportes y disponibilidad
6. Equivalencias
