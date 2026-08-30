$ErrorActionPreference = 'Stop'

Write-Host '======================================================'
Write-Host ' LenspireCRM - Emergency Owner Password Reset'
Write-Host '======================================================'
Write-Host 'Use this only when normal administrator recovery is unavailable.'

$setupToken = [Environment]::GetEnvironmentVariable('LENSPIRE_SETUP_TOKEN', 'Process')
if ([string]::IsNullOrWhiteSpace($setupToken)) {
    throw 'LENSPIRE_SETUP_TOKEN is not set in this PowerShell session.'
}

$username = Read-Host 'Enter the exact owner username'
if ([string]::IsNullOrWhiteSpace($username)) {
    throw 'Owner username is required.'
}

$securePassword = Read-Host 'Enter a new strong password (12-128 characters)' -AsSecureString
$passwordPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)

try {
    $passwordText = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($passwordPointer)
    $strong = $passwordText.Length -ge 12 -and
        $passwordText.Length -le 128 -and
        $passwordText -cmatch '[a-z]' -and
        $passwordText -cmatch '[A-Z]' -and
        $passwordText -match '\d' -and
        $passwordText -match '[^A-Za-z0-9]'
    if (-not $strong) {
        throw 'Password must contain uppercase, lowercase, number, and symbol and be 12-128 characters long.'
    }

    $headers = @{ 'x-setup-token' = $setupToken }
    $body = @{ username = $username.Trim(); newPassword = $passwordText } | ConvertTo-Json -Compress
    $result = Invoke-RestMethod `
        -Uri 'https://crm.lenspireai.com/api/auth/reset-password' `
        -Method Post `
        -Headers $headers `
        -ContentType 'application/json' `
        -Body $body `
        -TimeoutSec 30

    if ($result.ok -ne $true) {
        throw 'The recovery endpoint did not confirm the password reset.'
    }

    Write-Host 'Owner password reset completed. Sign in and rotate SETUP_TOKEN immediately.' -ForegroundColor Green
}
finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($passwordPointer)
    Remove-Variable passwordText, body, setupToken -ErrorAction SilentlyContinue
}
