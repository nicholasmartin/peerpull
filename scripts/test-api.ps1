# ============================================================
# Phase 6.1 API Manual Test Script (PowerShell)
# ============================================================
# Usage:
#   1. Start dev server:  npm run dev
#   2. Run this script:   .\scripts\test-api.ps1
# ============================================================

$BASE_URL = "http://localhost:3000"

# Load Supabase env vars from .env.local
$envFile = Get-Content .env.local -ErrorAction Stop
$SUPABASE_URL = ($envFile | Where-Object { $_ -match "^NEXT_PUBLIC_SUPABASE_URL=" }) -replace "^NEXT_PUBLIC_SUPABASE_URL=", ""
$SUPABASE_ANON_KEY = ($envFile | Where-Object { $_ -match "^NEXT_PUBLIC_SUPABASE_ANON_KEY=" }) -replace "^NEXT_PUBLIC_SUPABASE_ANON_KEY=", ""

# Prompt for credentials
$email = Read-Host "Test user email"
$password = Read-Host "Test user password" -AsSecureString
$plainPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
)

Write-Host ""
Write-Host "=== Step 1: Authenticate via Supabase ===" -ForegroundColor Cyan

$authBody = @{ email = $email; password = $plainPassword } | ConvertTo-Json
try {
    $authResponse = Invoke-RestMethod -Uri "$SUPABASE_URL/auth/v1/token?grant_type=password" `
        -Method POST `
        -Headers @{ "apikey" = $SUPABASE_ANON_KEY; "Content-Type" = "application/json" } `
        -Body $authBody
} catch {
    Write-Host "  FAIL: Could not authenticate. Check email/password." -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit 1
}

$TOKEN = $authResponse.access_token
$USER_ID = $authResponse.user.id
Write-Host "  PASS Authenticated as $email ($USER_ID)" -ForegroundColor Green
Write-Host ""

# Clear password from memory
$plainPassword = $null

$passCount = 0
$failCount = 0

function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Path,
        [string]$Label,
        [int]$ExpectedStatus,
        [string]$Body = "",
        [bool]$UseAuth = $true
    )

    $headers = @{ "Content-Type" = "application/json" }
    if ($UseAuth) {
        $headers["Authorization"] = "Bearer $TOKEN"
    }

    $params = @{
        Uri = "$BASE_URL$Path"
        Method = $Method
        Headers = $headers
    }
    if ($Body -ne "") {
        $params["Body"] = $Body
    }

    try {
        $response = Invoke-WebRequest @params -UseBasicParsing -ErrorAction Stop
        $status = $response.StatusCode
        $responseBody = $response.Content
    } catch {
        $status = [int]$_.Exception.Response.StatusCode
        $responseBody = $_.ErrorDetails.Message
        if (-not $responseBody) {
            try {
                $stream = $_.Exception.Response.GetResponseStream()
                $reader = New-Object System.IO.StreamReader($stream)
                $responseBody = $reader.ReadToEnd()
            } catch {
                $responseBody = "{}"
            }
        }
    }

    if ($status -eq $ExpectedStatus) {
        Write-Host "  PASS $Label (HTTP $status)" -ForegroundColor Green
        $script:passCount++
    } else {
        Write-Host "  FAIL $Label (expected $ExpectedStatus, got $status)" -ForegroundColor Red
        $script:failCount++
    }

    try {
        $responseBody | ConvertFrom-Json | ConvertTo-Json -Depth 5 | Write-Host
    } catch {
        Write-Host $responseBody
    }
    Write-Host ""

    # Store in script scope for chaining
    $script:lastResponseBody = $responseBody
}

# ------- Tests -------

Write-Host "=== Step 2: GET /auth/verify (valid token) ===" -ForegroundColor Cyan
Test-Endpoint -Method GET -Path "/api/v1/auth/verify" -Label "GET /auth/verify" -ExpectedStatus 200

Write-Host "=== Step 3: GET /auth/verify (no token, expect 401) ===" -ForegroundColor Cyan
Test-Endpoint -Method GET -Path "/api/v1/auth/verify" -Label "GET /auth/verify (no token)" -ExpectedStatus 401 -UseAuth $false

Write-Host "=== Step 4: GET /settings ===" -ForegroundColor Cyan
Test-Endpoint -Method GET -Path "/api/v1/settings" -Label "GET /settings" -ExpectedStatus 200

Write-Host "=== Step 5: GET /queue/next ===" -ForegroundColor Cyan
Test-Endpoint -Method GET -Path "/api/v1/queue/next" -Label "GET /queue/next" -ExpectedStatus 200

Write-Host "=== Step 6: CORS Preflight ===" -ForegroundColor Cyan
try {
    $corsResponse = Invoke-WebRequest -Uri "$BASE_URL/api/v1/auth/verify" -Method OPTIONS -UseBasicParsing `
        -Headers @{
            "Origin" = "chrome-extension://testextension"
            "Access-Control-Request-Method" = "GET"
            "Access-Control-Request-Headers" = "Authorization"
        } -ErrorAction Stop

    $corsStatus = $corsResponse.StatusCode
    $acao = $corsResponse.Headers["Access-Control-Allow-Origin"]
    $acam = $corsResponse.Headers["Access-Control-Allow-Methods"]

    if ($corsStatus -eq 204 -and $acao) {
        Write-Host "  PASS OPTIONS CORS preflight (HTTP $corsStatus)" -ForegroundColor Green
        Write-Host "  Access-Control-Allow-Origin: $acao"
        Write-Host "  Access-Control-Allow-Methods: $acam"
        $passCount++
    } else {
        Write-Host "  FAIL OPTIONS CORS preflight (HTTP $corsStatus)" -ForegroundColor Red
        $failCount++
    }
} catch {
    Write-Host "  FAIL OPTIONS CORS preflight: $($_.Exception.Message)" -ForegroundColor Red
    $failCount++
}
Write-Host ""

Write-Host "=== Step 7: POST /upload/signed-url (valid) ===" -ForegroundColor Cyan
Test-Endpoint -Method POST -Path "/api/v1/upload/signed-url" -Label "POST /upload/signed-url" -ExpectedStatus 200 `
    -Body '{"filename":"test-recording.webm","content_type":"video/webm"}'

Write-Host "=== Step 8: POST /upload/signed-url (non-video, expect 400) ===" -ForegroundColor Cyan
Test-Endpoint -Method POST -Path "/api/v1/upload/signed-url" -Label "POST /upload/signed-url (non-video)" -ExpectedStatus 400 `
    -Body '{"filename":"hack.exe","content_type":"application/octet-stream"}'

Write-Host "=== Step 9: POST /queue/submit (empty body, expect 400) ===" -ForegroundColor Cyan
Test-Endpoint -Method POST -Path "/api/v1/queue/submit" -Label "POST /queue/submit (empty body)" -ExpectedStatus 400 `
    -Body '{}'

Write-Host "=== Step 10: POST /external-reviews (create) ===" -ForegroundColor Cyan
Test-Endpoint -Method POST -Path "/api/v1/external-reviews" -Label "POST /external-reviews (create)" -ExpectedStatus 201 `
    -Body '{"video_url":"https://example.com/video.webm","video_duration":120,"target_url":"https://example.com","target_title":"Test Product"}'

# Extract review ID for PATCH/DELETE tests
$reviewId = $null
try {
    $parsed = $lastResponseBody | ConvertFrom-Json
    $reviewId = $parsed.data.id
} catch {}

if ($reviewId) {
    Write-Host "=== Step 11: PATCH /external-reviews/:id ===" -ForegroundColor Cyan
    Test-Endpoint -Method PATCH -Path "/api/v1/external-reviews/$reviewId" -Label "PATCH /external-reviews/:id" -ExpectedStatus 200 `
        -Body '{"target_title":"Updated Product Title"}'

    Write-Host "=== Step 12: DELETE /external-reviews/:id (soft delete) ===" -ForegroundColor Cyan
    Test-Endpoint -Method DELETE -Path "/api/v1/external-reviews/$reviewId" -Label "DELETE /external-reviews/:id" -ExpectedStatus 200
} else {
    Write-Host "  SKIP PATCH/DELETE tests: no review ID from create step" -ForegroundColor Yellow
}

Write-Host "=== Step 13: DELETE /external-reviews (not found, expect 404) ===" -ForegroundColor Cyan
Test-Endpoint -Method DELETE -Path "/api/v1/external-reviews/00000000-0000-0000-0000-000000000000" `
    -Label "DELETE /external-reviews/:id (not found)" -ExpectedStatus 404

# ------- Summary -------
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "            TEST SUMMARY" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Passed: $passCount" -ForegroundColor Green
Write-Host "  Failed: $failCount" -ForegroundColor Red
Write-Host ""

if ($failCount -gt 0) {
    exit 1
}
