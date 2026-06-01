New-Item -ItemType Directory -Path "C:\cmd-wrapper" -Force | Out-Null

$fixBat = @'
$files = Get-ChildItem 'C:\projects\threads\node_modules' -Recurse -Filter 'prefab_command.bat' -ErrorAction SilentlyContinue
foreach ($f in $files) {
    $b = [IO.File]::ReadAllBytes($f.FullName)
    $r = [Collections.Generic.List[byte]]::new()
    for ($i = 0; $i -lt $b.Length; $i++) {
        if ($b[$i] -eq 10 -and ($i -eq 0 -or $b[$i-1] -ne 13)) { $r.Add(13) }
        $r.Add($b[$i])
    }
    [IO.File]::WriteAllBytes($f.FullName, $r.ToArray())
}
'@
[IO.File]::WriteAllText("C:\cmd-wrapper\fix-bat.ps1", $fixBat, [Text.Encoding]::UTF8)

$cmdBat = "@echo off`r`npowershell -ExecutionPolicy Bypass -File `"C:\cmd-wrapper\fix-bat.ps1`"`r`nC:\Windows\System32\cmd.exe %*`r`n"
[IO.File]::WriteAllText("C:\cmd-wrapper\cmd.bat", $cmdBat, [Text.Encoding]::ASCII)

Write-Host "Done: C:\cmd-wrapper created"
