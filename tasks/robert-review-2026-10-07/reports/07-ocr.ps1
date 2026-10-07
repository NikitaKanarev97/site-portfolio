param([string]$ImageRoot = 'public', [string]$Output = 'tasks/robert-review-2026-10-07/reports/07-ocr.json')
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null = [Windows.Storage.StorageFile,Windows.Storage,ContentType=WindowsRuntime]
$null = [Windows.Graphics.Imaging.BitmapDecoder,Windows.Graphics.Imaging,ContentType=WindowsRuntime]
$null = [Windows.Media.Ocr.OcrEngine,Windows.Media.Ocr,ContentType=WindowsRuntime]
$null = [Windows.Globalization.Language,Windows.Globalization,ContentType=WindowsRuntime]
$asTask = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.IsGenericMethod -and $_.GetParameters().Count -eq 1 } | Select-Object -First 1
function AwaitOperation($operation, [Type]$type) {
  $task = $asTask.MakeGenericMethod($type).Invoke($null, @($operation))
  $task.Wait()
  $task.Result
}
$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
if ($null -eq $engine) { throw 'No installed Windows OCR language' }
Write-Output ('OCR language: ' + $engine.RecognizerLanguage.LanguageTag)
$records = @()
$images = @(Get-ChildItem -LiteralPath $ImageRoot -Recurse -File | Where-Object { $_.Extension -in '.png', '.jpg', '.jpeg', '.webp' })
foreach ($item in $images) {
  $stream = $null
  try {
    $file = AwaitOperation ([Windows.Storage.StorageFile]::GetFileFromPathAsync($item.FullName)) ([Windows.Storage.StorageFile])
    $stream = AwaitOperation ($file.OpenAsync([Windows.Storage.FileAccessMode]::Read)) ([Windows.Storage.Streams.IRandomAccessStream])
    $decoder = AwaitOperation ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)) ([Windows.Graphics.Imaging.BitmapDecoder])
    $bitmap = AwaitOperation ($decoder.GetSoftwareBitmapAsync()) ([Windows.Graphics.Imaging.SoftwareBitmap])
    $result = AwaitOperation ($engine.RecognizeAsync($bitmap)) ([Windows.Media.Ocr.OcrResult])
    $records += [pscustomobject]@{file=$item.FullName; text=$result.Text; error=$null}
    $bitmap.Dispose()
  } catch {
    $records += [pscustomobject]@{file=$item.FullName; text=''; error=$_.Exception.Message}
  } finally { if ($stream) { $stream.Dispose() } }
  if ($records.Count % 50 -eq 0) { Write-Output ('Read ' + $records.Count + '/' + $images.Count) }
}
$records | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath $Output -Encoding utf8
Write-Output ('Recorded ' + $records.Count + ' images; errors ' + @($records | Where-Object error).Count)
$records | Where-Object { $_.text -match '(?i)\bconcept|\u043a\u043e\u043d\u0446\u0435\u043f\u0442|pet.project|not a live|\u043f\u043e\u0440\u0442\u0444\u043e\u043b\u0438\u043e.\u0432\u0435\u0440\u0441' } | ForEach-Object { Write-Output ($_.file + ': ' + $_.text) }
