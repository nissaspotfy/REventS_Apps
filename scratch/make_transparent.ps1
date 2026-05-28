Add-Type -AssemblyName System.Drawing
$inputPath = "C:\ANISSA NURSAFITRI\revents\public\logo.png"
$outputPath = "C:\ANISSA NURSAFITRI\revents\public\logo_trans.png"

if (-not (Test-Path $inputPath)) {
    Write-Host "File not found: $inputPath"
    exit 1
}

$bmp = [System.Drawing.Bitmap]::FromFile($inputPath)
$width = $bmp.Width
$height = $bmp.Height

Write-Host "Image size: $width x $height"

# Let's inspect a few pixels around the border to find the background color
$bgColors = @()
for ($x = 0; $x -lt 10; $x++) {
    for ($y = 0; $y -lt 10; $y++) {
        $c = $bmp.GetPixel($x, $y)
        $bgColors += "$($c.R),$($c.G),$($c.B)"
    }
}

# Group and find the most common color
$mostCommon = $bgColors | Group-Object | Sort-Object Count -Descending | Select-Object -First 1
Write-Host "Most common border color: $($mostCommon.Name) (Count: $($mostCommon.Count))"

# Let's parse the R, G, B values of the background
$parts = $($mostCommon.Name) -split ','
$bgR = [int]$parts[0]
$bgG = [int]$parts[1]
$bgB = [int]$parts[2]

# Create a new transparent bitmap
$newBmp = New-Object System.Drawing.Bitmap($width, $height)
$g = [System.Drawing.Graphics]::FromImage($newBmp)
$g.Clear([System.Drawing.Color]::Transparent)

for ($x = 0; $x -lt $width; $x++) {
    for ($y = 0; $y -lt $height; $y++) {
        $c = $bmp.GetPixel($x, $y)
        
        # Check if the pixel is close to the background color
        # We can use a tolerance distance in RGB space
        $dist = [Math]::Sqrt([Math]::Pow($c.R - $bgR, 2) + [Math]::Pow($c.G - $bgG, 2) + [Math]::Pow($c.B - $bgB, 2))
        
        # If it is not background, copy it
        if ($dist -gt 40) {
            $newBmp.SetPixel($x, $y, $c)
        }
    }
}

$g.Dispose()
$bmp.Dispose()

# Save as PNG
$newBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$newBmp.Dispose()

Write-Host "Saved transparent image to: $outputPath"
