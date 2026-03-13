#!/usr/bin/env bash
# ============================================================
# Phase 6.1 API Manual Test Script
# ============================================================
# Usage:
#   1. Start dev server:  npm run dev
#   2. Run this script:   bash scripts/test-api.sh
#
# Prerequisites:
#   - .env.local with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
#   - jq installed (for pretty JSON output)
#   - A valid test user email/password (edit below)
# ============================================================

set -euo pipefail

# ------- CONFIGURE THESE -------
TEST_EMAIL="${TEST_EMAIL:-}"
TEST_PASSWORD="${TEST_PASSWORD:-}"
BASE_URL="${BASE_URL:-http://localhost:3000}"
# --------------------------------

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
NC='\033[0m'

pass() { echo -e "  ${GREEN}PASS${NC} $1"; }
fail() { echo -e "  ${RED}FAIL${NC} $1"; }
info() { echo -e "${CYAN}$1${NC}"; }
warn() { echo -e "${YELLOW}$1${NC}"; }

# Load Supabase env vars
if [ -f .env.local ]; then
  SUPABASE_URL=$(grep NEXT_PUBLIC_SUPABASE_URL .env.local | cut -d= -f2-)
  SUPABASE_ANON_KEY=$(grep NEXT_PUBLIC_SUPABASE_ANON_KEY .env.local | cut -d= -f2-)
else
  echo "ERROR: .env.local not found. Run from project root."
  exit 1
fi

# Prompt for credentials if not set
if [ -z "$TEST_EMAIL" ]; then
  read -rp "Test user email: " TEST_EMAIL
fi
if [ -z "$TEST_PASSWORD" ]; then
  read -rsp "Test user password: " TEST_PASSWORD
  echo
fi

# ============================================================
info "=== Step 1: Authenticate via Supabase ==="
# ============================================================

AUTH_RESPONSE=$(curl -s -X POST \
  "${SUPABASE_URL}/auth/v1/token?grant_type=password" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${TEST_EMAIL}\",\"password\":\"${TEST_PASSWORD}\"}")

TOKEN=$(echo "$AUTH_RESPONSE" | jq -r '.access_token // empty')

if [ -z "$TOKEN" ]; then
  echo "$AUTH_RESPONSE" | jq .
  fail "Could not authenticate. Check email/password."
  exit 1
fi

USER_ID=$(echo "$AUTH_RESPONSE" | jq -r '.user.id')
pass "Authenticated as ${TEST_EMAIL} (${USER_ID})"
echo

RESULTS=()
record() {
  RESULTS+=("$1|$2")
}

# Helper: run a test and check HTTP status
test_endpoint() {
  local method="$1"
  local path="$2"
  local label="$3"
  local expected_status="$4"
  local data="${5:-}"
  local auth="${6:-yes}"

  local auth_header=""
  if [ "$auth" = "yes" ]; then
    auth_header="-H \"Authorization: Bearer ${TOKEN}\""
  fi

  local cmd="curl -s -o /tmp/api_response.json -w '%{http_code}' -X ${method} '${BASE_URL}${path}'"
  cmd+=" -H 'Content-Type: application/json'"
  if [ "$auth" = "yes" ]; then
    cmd+=" -H 'Authorization: Bearer ${TOKEN}'"
  fi
  if [ -n "$data" ]; then
    cmd+=" -d '${data}'"
  fi

  local status
  status=$(eval "$cmd")
  local body
  body=$(cat /tmp/api_response.json)

  if [ "$status" = "$expected_status" ]; then
    pass "${label} (HTTP ${status})"
    record "PASS" "$label"
  else
    fail "${label} (expected ${expected_status}, got ${status})"
    record "FAIL" "$label"
  fi
  echo "$body" | jq . 2>/dev/null || echo "$body"
  echo
}

# ============================================================
info "=== Step 2: Test Auth Verify ==="
# ============================================================

test_endpoint GET "/api/v1/auth/verify" "GET /auth/verify (valid token)" "200"

# ============================================================
info "=== Step 3: Test Auth Verify (no token, expect 401) ==="
# ============================================================

test_endpoint GET "/api/v1/auth/verify" "GET /auth/verify (no token)" "401" "" "no"

# ============================================================
info "=== Step 4: Test Settings ==="
# ============================================================

test_endpoint GET "/api/v1/settings" "GET /settings" "200"

# ============================================================
info "=== Step 5: Test Queue Next ==="
# ============================================================

test_endpoint GET "/api/v1/queue/next" "GET /queue/next" "200"

# ============================================================
info "=== Step 6: Test CORS Preflight ==="
# ============================================================

CORS_STATUS=$(curl -s -o /dev/null -w '%{http_code}' -X OPTIONS \
  "${BASE_URL}/api/v1/auth/verify" \
  -H "Origin: chrome-extension://testextension" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Authorization")

CORS_HEADERS=$(curl -s -D- -o /dev/null -X OPTIONS \
  "${BASE_URL}/api/v1/auth/verify" \
  -H "Origin: chrome-extension://testextension" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Authorization" 2>/dev/null | grep -i "access-control" || true)

if [ "$CORS_STATUS" = "204" ] && [ -n "$CORS_HEADERS" ]; then
  pass "OPTIONS /auth/verify CORS preflight (HTTP ${CORS_STATUS})"
  record "PASS" "CORS preflight"
else
  fail "OPTIONS /auth/verify CORS preflight (HTTP ${CORS_STATUS})"
  record "FAIL" "CORS preflight"
fi
echo "$CORS_HEADERS"
echo

# ============================================================
info "=== Step 7: Test Signed Upload URL ==="
# ============================================================

test_endpoint POST "/api/v1/upload/signed-url" \
  "POST /upload/signed-url (valid)" "200" \
  '{"filename":"test-recording.webm","content_type":"video/webm"}'

# ============================================================
info "=== Step 8: Test Signed Upload URL (invalid content type) ==="
# ============================================================

test_endpoint POST "/api/v1/upload/signed-url" \
  "POST /upload/signed-url (non-video, expect 400)" "400" \
  '{"filename":"hack.exe","content_type":"application/octet-stream"}'

# ============================================================
info "=== Step 9: Test Queue Submit (validation error) ==="
# ============================================================

test_endpoint POST "/api/v1/queue/submit" \
  "POST /queue/submit (empty body, expect 400)" "400" \
  '{}'

# ============================================================
info "=== Step 10: Test External Reviews Create ==="
# ============================================================

test_endpoint POST "/api/v1/external-reviews" \
  "POST /external-reviews (create)" "201" \
  '{"video_url":"https://example.com/video.webm","video_duration":120,"target_url":"https://example.com","target_title":"Test Product"}'

# Extract the created review ID for subsequent tests
REVIEW_ID=$(jq -r '.data.id // empty' /tmp/api_response.json)

if [ -n "$REVIEW_ID" ]; then
  # ============================================================
  info "=== Step 11: Test External Reviews Update ==="
  # ============================================================

  test_endpoint PATCH "/api/v1/external-reviews/${REVIEW_ID}" \
    "PATCH /external-reviews/:id (update)" "200" \
    '{"target_title":"Updated Product Title"}'

  # ============================================================
  info "=== Step 12: Test External Reviews Delete (soft) ==="
  # ============================================================

  test_endpoint DELETE "/api/v1/external-reviews/${REVIEW_ID}" \
    "DELETE /external-reviews/:id (soft delete)" "200"
else
  warn "Skipping PATCH/DELETE tests: no review ID from create step"
  record "SKIP" "PATCH /external-reviews/:id"
  record "SKIP" "DELETE /external-reviews/:id"
fi

# ============================================================
info "=== Step 13: Test External Reviews Delete (not found) ==="
# ============================================================

test_endpoint DELETE "/api/v1/external-reviews/00000000-0000-0000-0000-000000000000" \
  "DELETE /external-reviews/:id (not found, expect 404)" "404"

# ============================================================
info "=========================================="
info "            TEST SUMMARY"
info "=========================================="
# ============================================================

PASS_COUNT=0
FAIL_COUNT=0
SKIP_COUNT=0

for r in "${RESULTS[@]}"; do
  status="${r%%|*}"
  label="${r#*|}"
  if [ "$status" = "PASS" ]; then
    pass "$label"
    ((PASS_COUNT++))
  elif [ "$status" = "FAIL" ]; then
    fail "$label"
    ((FAIL_COUNT++))
  else
    warn "  SKIP $label"
    ((SKIP_COUNT++))
  fi
done

echo
echo -e "Total: ${GREEN}${PASS_COUNT} passed${NC}, ${RED}${FAIL_COUNT} failed${NC}, ${YELLOW}${SKIP_COUNT} skipped${NC}"

if [ "$FAIL_COUNT" -gt 0 ]; then
  exit 1
fi
