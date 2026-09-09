param(
    [string]$Root = (Split-Path -Parent $PSScriptRoot)
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$CanvasWidth = 2000
$CanvasHeight = 1600
$BackupRoot = Join-Path $Root 'cover-originals-2026-09-04'

function Convert-HexColor {
    param([string]$Hex, [int]$Alpha = 255)
    $clean = $Hex.TrimStart('#')
    return [System.Drawing.Color]::FromArgb(
        $Alpha,
        [Convert]::ToInt32($clean.Substring(0, 2), 16),
        [Convert]::ToInt32($clean.Substring(2, 2), 16),
        [Convert]::ToInt32($clean.Substring(4, 2), 16)
    )
}

function New-RoundedRectanglePath {
    param(
        [System.Drawing.RectangleF]$Rect,
        [float]$Radius
    )
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $diameter = $Radius * 2
    if ($diameter -le 0) {
        $path.AddRectangle($Rect)
        return $path
    }
    $arc = New-Object System.Drawing.RectangleF($Rect.X, $Rect.Y, $diameter, $diameter)
    $path.AddArc($arc, 180, 90)
    $arc.X = $Rect.Right - $diameter
    $path.AddArc($arc, 270, 90)
    $arc.Y = $Rect.Bottom - $diameter
    $path.AddArc($arc, 0, 90)
    $arc.X = $Rect.X
    $path.AddArc($arc, 90, 90)
    $path.CloseFigure()
    return $path
}

function New-CoverCanvas {
    param(
        [string]$StartColor,
        [string]$EndColor,
        [float]$Angle,
        [string]$BlobColor,
        [System.Drawing.RectangleF]$BlobRect
    )
    $bitmap = New-Object System.Drawing.Bitmap($CanvasWidth, $CanvasHeight, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $canvasRect = New-Object System.Drawing.Rectangle(0, 0, $CanvasWidth, $CanvasHeight)
    $background = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        $canvasRect,
        (Convert-HexColor $StartColor),
        (Convert-HexColor $EndColor),
        $Angle
    )
    $graphics.FillRectangle($background, $canvasRect)
    $background.Dispose()

    if ($BlobColor) {
        $blob = New-Object System.Drawing.SolidBrush((Convert-HexColor $BlobColor 48))
        $graphics.FillEllipse($blob, $BlobRect)
        $blob.Dispose()
    }

    return [pscustomobject]@{ Bitmap = $bitmap; Graphics = $graphics }
}

function Draw-RoundedImage {
    param(
        [System.Drawing.Graphics]$Graphics,
        [string]$ImagePath,
        [System.Drawing.RectangleF]$Destination,
        [float]$Radius = 28,
        [string]$BorderColor = '#FFFFFF',
        [int]$BorderAlpha = 72,
        [float]$BorderWidth = 2
    )
    $shadowRects = @(
        @{ Offset = 34; Grow = 16; Alpha = 12 },
        @{ Offset = 22; Grow = 10; Alpha = 16 },
        @{ Offset = 12; Grow = 4; Alpha = 22 }
    )
    foreach ($shadowSpec in $shadowRects) {
        $shadowRect = [System.Drawing.RectangleF]::new(
            [float]($Destination.X - $shadowSpec.Grow),
            [float]($Destination.Y + $shadowSpec.Offset - $shadowSpec.Grow),
            [float]($Destination.Width + ($shadowSpec.Grow * 2)),
            [float]($Destination.Height + ($shadowSpec.Grow * 2))
        )
        $shadowPath = New-RoundedRectanglePath $shadowRect ($Radius + $shadowSpec.Grow)
        $shadowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb($shadowSpec.Alpha, 0, 0, 0))
        $Graphics.FillPath($shadowBrush, $shadowPath)
        $shadowBrush.Dispose()
        $shadowPath.Dispose()
    }

    $image = [System.Drawing.Image]::FromFile($ImagePath)
    $clipPath = New-RoundedRectanglePath $Destination $Radius
    $oldClip = $Graphics.Clip
    $Graphics.SetClip($clipPath)
    $Graphics.DrawImage($image, $Destination)
    $Graphics.Clip = $oldClip
    $oldClip.Dispose()
    $image.Dispose()

    $borderPen = New-Object System.Drawing.Pen((Convert-HexColor $BorderColor $BorderAlpha), $BorderWidth)
    $Graphics.DrawPath($borderPen, $clipPath)
    $borderPen.Dispose()
    $clipPath.Dispose()
}

function Save-Cover {
    param(
        [pscustomobject]$Canvas,
        [string]$OutputPath
    )
    $outputDir = Split-Path -Parent $OutputPath
    [System.IO.Directory]::CreateDirectory($outputDir) | Out-Null
    $Canvas.Bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $Canvas.Graphics.Dispose()
    $Canvas.Bitmap.Dispose()
}

function Backup-Cover {
    param([string]$RelativePath)
    $source = Join-Path $Root $RelativePath
    $destination = Join-Path $BackupRoot $RelativePath
    if (-not (Test-Path $destination)) {
        [System.IO.Directory]::CreateDirectory((Split-Path -Parent $destination)) | Out-Null
        Copy-Item -LiteralPath $source -Destination $destination
    }
}

$covers = @(
    'projects/agent-ops-console/00-thumbnail-preview.png',
    'projects/b2b-partner-portal/00-thumbnail-preview.png',
    'projects/vet-clinic-os/00-thumbnail-preview.png',
    'projects/pawly/00-thumbnail-preview.png',
    'projects/common/00-cover.png',
    'projects/synk/00-cover.png',
    'projects/scrib3/00-cover.png',
    'projects/bloomlex/00-cover.png'
)
$covers | ForEach-Object { Backup-Cover $_ }

# 01 — Agent Ops: dense dark enterprise UI, presented as one decisive product surface.
$canvas = New-CoverCanvas '#101416' '#293135' 26 '' (New-Object System.Drawing.RectangleF(1460, -260, 780, 780))
Draw-RoundedImage $canvas.Graphics (Join-Path $Root 'projects/agent-ops-console/01.png') (New-Object System.Drawing.RectangleF(110, 244, 1780, 1112)) 34 '#FF9A78' 72 2
Save-Cover $canvas (Join-Path $Root 'projects/agent-ops-console/00-thumbnail-preview.png')

# 02 — B2B Portal: one large fulfillment decision screen on a cool procurement-blue field.
$canvas = New-CoverCanvas '#F3F7FC' '#C9DAF2' 32 '' (New-Object System.Drawing.RectangleF(-210, 940, 920, 920))
Draw-RoundedImage $canvas.Graphics (Join-Path $Root 'projects/b2b-partner-portal/09.png') (New-Object System.Drawing.RectangleF(110, 244, 1780, 1112)) 34 '#FFFFFF' 225 3
Save-Cover $canvas (Join-Path $Root 'projects/b2b-partner-portal/00-thumbnail-preview.png')

# 03 — Vet Clinic OS: responsive overview dominates, with one clinical calculation detail.
$canvas = New-CoverCanvas '#F6F3EC' '#DDEBE7' 25 '' (New-Object System.Drawing.RectangleF(1390, 980, 760, 760))
Draw-RoundedImage $canvas.Graphics (Join-Path $Root 'projects/vet-clinic-os/01.png') (New-Object System.Drawing.RectangleF(110, 240, 1780, 699)) 30 '#FFFFFF' 240 3
Draw-RoundedImage $canvas.Graphics (Join-Path $Root 'projects/vet-clinic-os/02.png') (New-Object System.Drawing.RectangleF(845, 945, 1010, 576)) 28 '#FFFFFF' 238 3
Save-Cover $canvas (Join-Path $Root 'projects/vet-clinic-os/00-thumbnail-preview.png')

# 04 — Pawly: a mobile journey, with the red line behaving like a walking route rather than a label.
$canvas = New-CoverCanvas '#F7F2EC' '#DED7D0' 20 '' (New-Object System.Drawing.RectangleF(1190, -360, 1040, 1040))
Draw-RoundedImage $canvas.Graphics (Join-Path $Root 'projects/pawly/01.png') (New-Object System.Drawing.RectangleF(335, 140, 1330, 1303)) 32 '#FFFFFF' 220 3
Save-Cover $canvas (Join-Path $Root 'projects/pawly/00-thumbnail-preview.png')

# 05 — Common: editorial white site on a distinctive pale-green field.
$canvas = New-CoverCanvas '#EFF8E9' '#CDEAB8' 30 '' (New-Object System.Drawing.RectangleF(1300, -320, 1000, 1000))
Draw-RoundedImage $canvas.Graphics (Join-Path $Root 'projects/common/01.png') (New-Object System.Drawing.RectangleF(100, 294, 1800, 1012)) 34 '#FFFFFF' 225 3
Save-Cover $canvas (Join-Path $Root 'projects/common/00-cover.png')

# 06 — Synk: the project already owns red; the hand-drawn loop turns the native cactus into the focal point.
$canvas = New-CoverCanvas '#E6CDB6' '#F3E7CC' 24 '' (New-Object System.Drawing.RectangleF(-420, 930, 970, 970))
Draw-RoundedImage $canvas.Graphics (Join-Path $Root 'projects/synk/01.png') (New-Object System.Drawing.RectangleF(100, 294, 1800, 1012)) 34 '#FFF8D3' 220 3
Save-Cover $canvas (Join-Path $Root 'projects/synk/00-cover.png')

# 07 — Scrib3: high-contrast crypto identity with a single coral gesture outside the product frame.
$canvas = New-CoverCanvas '#17151A' '#493C48' 27 '' (New-Object System.Drawing.RectangleF(1370, -430, 1060, 1060))
Draw-RoundedImage $canvas.Graphics (Join-Path $Root 'projects/scrib3/01.png') (New-Object System.Drawing.RectangleF(100, 294, 1800, 1012)) 34 '#D5A8C7' 120 3
Save-Cover $canvas (Join-Path $Root 'projects/scrib3/00-cover.png')

# 08 — Bloomlex: the flower remains the unmistakable visual anchor; the editorial loop is intentionally small.
$canvas = New-CoverCanvas '#151211' '#46352F' 26 '' (New-Object System.Drawing.RectangleF(-320, -340, 1050, 1050))
Draw-RoundedImage $canvas.Graphics (Join-Path $Root 'projects/bloomlex/01.png') (New-Object System.Drawing.RectangleF(100, 294, 1800, 1012)) 34 '#FF8B4D' 110 3
Save-Cover $canvas (Join-Path $Root 'projects/bloomlex/00-cover.png')

$proofItems = @(
    @{ Name = 'Agent Ops'; Path = 'projects/agent-ops-console/00-thumbnail-preview.png' },
    @{ Name = 'B2B Partner Portal'; Path = 'projects/b2b-partner-portal/00-thumbnail-preview.png' },
    @{ Name = 'Vet Clinic OS'; Path = 'projects/vet-clinic-os/00-thumbnail-preview.png' },
    @{ Name = 'Pawly'; Path = 'projects/pawly/00-thumbnail-preview.png' },
    @{ Name = 'Common'; Path = 'projects/common/00-cover.png' },
    @{ Name = 'Synk'; Path = 'projects/synk/00-cover.png' },
    @{ Name = 'Scrib3'; Path = 'projects/scrib3/00-cover.png' },
    @{ Name = 'Bloomlex'; Path = 'projects/bloomlex/00-cover.png' }
)
$proof = New-Object System.Drawing.Bitmap(1600, 1380, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$proofGraphics = [System.Drawing.Graphics]::FromImage($proof)
$proofGraphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$proofGraphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$proofGraphics.Clear((Convert-HexColor '#F4F4F1'))
$proofFont = New-Object System.Drawing.Font('Segoe UI', 22, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$proofBrush = New-Object System.Drawing.SolidBrush((Convert-HexColor '#171717'))
for ($index = 0; $index -lt $proofItems.Count; $index++) {
    $column = $index % 3
    $row = [Math]::Floor($index / 3)
    $x = 40 + ($column * 520)
    $y = 40 + ($row * 440)
    $thumb = [System.Drawing.Image]::FromFile((Join-Path $Root $proofItems[$index].Path))
    $proofGraphics.DrawImage($thumb, [System.Drawing.Rectangle]::new($x, $y, 480, 384))
    $thumb.Dispose()
    $proofGraphics.DrawString($proofItems[$index].Name, $proofFont, $proofBrush, $x, ($y + 394))
}
$proofPath = Join-Path $Root 'cover-proof-sheet.png'
$proof.Save($proofPath, [System.Drawing.Imaging.ImageFormat]::Png)
$proofBrush.Dispose()
$proofFont.Dispose()
$proofGraphics.Dispose()
$proof.Dispose()

Write-Output "Built 8 Upwork covers at 2000x1600. Originals: $BackupRoot"
Write-Output "Proof sheet: $proofPath"
