@echo off
echo ====================================
echo KOLAQ Backend - E2E Test Runner
echo ====================================
echo.

echo Checking environment...
if not exist ".env" (
    echo ERROR: .env file not found!
    echo Please create .env file with required variables.
    exit /b 1
)

echo.
echo [1/3] Generating Prisma Client...
call npm run db:generate
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Prisma client generation failed!
    exit /b 1
)

echo.
echo [2/3] Running Unit Tests...
call npm test -- --passWithNoTests
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: Some unit tests failed
)

echo.
echo [3/3] Running E2E Tests...
call npm run test:e2e
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: Some E2E tests failed
)

echo.
echo ====================================
echo Test run completed!
echo ====================================
echo.
echo To run specific test suites:
echo   npm run test:e2e -- test/auth.e2e-spec.ts
echo   npm run test:e2e -- test/catalog.e2e-spec.ts
echo   npm run test:e2e -- test/cart-checkout.e2e-spec.ts
echo   npm run test:e2e -- test/orders.e2e-spec.ts
echo   npm run test:e2e -- test/admin.e2e-spec.ts
echo.
pause
