$src = "C:\Users\GAME\Documents\GitHub\dragable_refresh_button"
$out = "$src\refresh-button.zip"

if (Test-Path $out) { Remove-Item $out }

Compress-Archive -Path @(
  "$src\manifest.json",
  "$src\content.js",
  "$src\styles.css"
) -DestinationPath $out

Write-Host "打包完成: $out"
