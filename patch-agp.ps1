# Find AGP jar
$jarPath = Get-ChildItem "C:\gradle-home\caches\modules-2\files-2.1\com.android.tools.build\gradle\8.12.0" -Recurse -Filter "gradle-8.12.0.jar" -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notlike "*sources*" } |
    Select-Object -First 1 -ExpandProperty FullName

if (-not $jarPath) {
    Write-Host "ERROR: gradle-8.12.0.jar not found"
    exit 1
}
Write-Host "Found: $jarPath"

# Backup
$backup = $jarPath + ".bak"
if (-not (Test-Path $backup)) {
    Copy-Item $jarPath $backup
    Write-Host "Backup: $backup"
}

# Binary patch: replace ' ^\n  ' (20 5e 0a 20 20) with ' ^\r\n ' (20 5e 0d 0a 20)
$bytes = [IO.File]::ReadAllBytes($jarPath)
$old = [byte[]]@(0x20, 0x5e, 0x0a, 0x20, 0x20)
$new = [byte[]]@(0x20, 0x5e, 0x0d, 0x0a, 0x20)

$count = 0
for ($i = 0; $i -le $bytes.Length - 5; $i++) {
    if ($bytes[$i]   -eq $old[0] -and
        $bytes[$i+1] -eq $old[1] -and
        $bytes[$i+2] -eq $old[2] -and
        $bytes[$i+3] -eq $old[3] -and
        $bytes[$i+4] -eq $old[4]) {
        $bytes[$i+2] = 0x0d
        $bytes[$i+3] = 0x0a
        $bytes[$i+4] = 0x20
        $count++
    }
}

if ($count -eq 0) {
    Write-Host "Pattern not found in jar"
    exit 1
}

[IO.File]::WriteAllBytes($jarPath, $bytes)
Write-Host "Patched $count occurrences. Done."
