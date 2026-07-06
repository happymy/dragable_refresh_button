$out = "$PSScriptRoot\refresh-button.zip"

if (Test-Path $out) { Remove-Item $out }

Compress-Archive -Path @(
  "$PSScriptRoot\manifest.json",
  "$PSScriptRoot\content.js",
  "$PSScriptRoot\styles.css"
) -DestinationPath $out

Write-Host "打包完成: $out"
