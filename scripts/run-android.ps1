$ErrorActionPreference = "Stop"

$tempRoot = "C:\temp\threads-build"
$projectRoot = Split-Path -Parent $PSScriptRoot

if (-not (Test-Path -LiteralPath $tempRoot)) {
  New-Item -ItemType Directory -Path $tempRoot -Force | Out-Null
}

$env:TEMP = $tempRoot
$env:TMP = $tempRoot
$env:GRADLE_OPTS = "-Dorg.gradle.daemon=false"

Write-Host "Using TEMP=$env:TEMP"
Write-Host "Using TMP=$env:TMP"
Write-Host "Using GRADLE_OPTS=$env:GRADLE_OPTS"

$staleBuildPaths = @(
  (Join-Path $projectRoot "android\.cxx"),
  (Join-Path $projectRoot "android\app\.cxx"),
  (Join-Path $projectRoot "node_modules\react-native-worklets\android\build"),
  (Join-Path $projectRoot "node_modules\react-native-screens\android\build")
)

foreach ($path in $staleBuildPaths) {
  if (Test-Path -LiteralPath $path) {
    Write-Host "Removing stale native build cache: $path"
    Remove-Item -LiteralPath $path -Recurse -Force
  }
}

$gradleWrapper = Join-Path $projectRoot "android\gradlew.bat"
if (Test-Path -LiteralPath $gradleWrapper) {
  & $gradleWrapper --stop | Out-Null
}

& npx expo run:android @args
exit $LASTEXITCODE
