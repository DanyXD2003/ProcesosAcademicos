#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:5055}"
PASSWORD="${PASSWORD:-Demo123!}"

login() {
  local user="$1"
  curl -fsS -X POST "$BASE_URL/api/v1/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"usernameOrEmail\":\"$user\",\"password\":\"$PASSWORD\"}"
}

extract() {
  local json="$1"
  local key="$2"
  echo "$json" | sed -n "s/.*\"$key\":\"\([^\"]*\)\".*/\1/p" | head -n 1
}

student_login="$(login 20230104)"
student_token="$(extract "$student_login" accessToken)"

professor_login="$(login PR-040)"
professor_token="$(extract "$professor_login" accessToken)"

director_login="$(login DIR-001)"
director_token="$(extract "$director_login" accessToken)"

[ -n "$student_token" ] || { echo "No se pudo obtener token de estudiante"; exit 1; }
[ -n "$professor_token" ] || { echo "No se pudo obtener token de profesor"; exit 1; }
[ -n "$director_token" ] || { echo "No se pudo obtener token de director"; exit 1; }

curl -fsS "$BASE_URL/api/v1/auth/me" -H "Authorization: Bearer $student_token" > /tmp/smoke_student_me.json
curl -fsS "$BASE_URL/api/v1/student/dashboard" -H "Authorization: Bearer $student_token" > /tmp/smoke_student_dashboard.json
curl -fsS "$BASE_URL/api/v1/professor/dashboard" -H "Authorization: Bearer $professor_token" > /tmp/smoke_professor_dashboard.json
curl -fsS "$BASE_URL/api/v1/director/dashboard" -H "Authorization: Bearer $director_token" > /tmp/smoke_director_dashboard.json

printf '%s\n' "Smoke completado. Archivos:"
printf '%s\n' "/tmp/smoke_student_me.json"
printf '%s\n' "/tmp/smoke_student_dashboard.json"
printf '%s\n' "/tmp/smoke_professor_dashboard.json"
printf '%s\n' "/tmp/smoke_director_dashboard.json"
