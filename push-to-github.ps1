# Script đơn giản để push code lên GitHub
Write-Host "🚀 Push My Shop lên GitHub" -ForegroundColor Green

# Kiểm tra Git
try {
    git --version > $null
    Write-Host "✅ Git OK" -ForegroundColor Green
}
catch {
    Write-Host "❌ Cài đặt Git trước: https://git-scm.com" -ForegroundColor Red
    exit 1
}

# Khởi tạo Git repo nếu chưa có
if (!(Test-Path ".git")) {
    git init
    Write-Host "✅ Khởi tạo Git repository" -ForegroundColor Green
}

# Cấu hình Git
$name = git config user.name
if (!$name) {
    $name = Read-Host "Nhập tên của bạn"
    git config user.name $name
}

$email = git config user.email
if (!$email) {
    $email = Read-Host "Nhập email của bạn"
    git config user.email $email
}

# Thêm files
git add .
Write-Host "✅ Đã thêm files" -ForegroundColor Green

# Commit
git commit -m "My Shop E-commerce project" 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Commit thành công" -ForegroundColor Green
}
else {
    Write-Host "⚠️  Không có gì để commit hoặc đã commit rồi" -ForegroundColor Yellow
}

# Hướng dẫn tạo repo
Write-Host "`n📋 Tạo repository trên GitHub:" -ForegroundColor Cyan
Write-Host "1. Vào https://github.com" -ForegroundColor White
Write-Host "2. Nhấn '+' → 'New repository'" -ForegroundColor White
Write-Host "3. Tên: my-shop-ecommerce" -ForegroundColor Yellow
Write-Host "4. Nhấn 'Create repository'" -ForegroundColor White

# Nhập URL repo
$repoUrl = Read-Host "`nhttps://github.com/Phu2312003/my_shop"

if ($repoUrl) {
    # Thêm remote
    git remote add origin $repoUrl 2>$null
    if ($LASTEXITCODE -ne 0) {
        git remote set-url origin $repoUrl
    }

    # Push
    Write-Host "`n⏳ Đang push..." -ForegroundColor Blue
    git push -u origin main 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "🎉 THÀNH CÔNG! Code đã lên GitHub!" -ForegroundColor Green
        Write-Host "🔗 $repoUrl" -ForegroundColor Cyan
    }
    else {
        git push -u origin master 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "🎉 THÀNH CÔNG! Code đã lên GitHub!" -ForegroundColor Green
            Write-Host "🔗 $repoUrl" -ForegroundColor Cyan
        }
        else {
            Write-Host "❌ Push thất bại. Kiểm tra URL và thử lại." -ForegroundColor Red
        }
    }
}
else {
    Write-Host "❌ Cần URL repository" -ForegroundColor Red
}

Read-Host "`nNhấn Enter để thoát"
