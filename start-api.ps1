# Script para iniciar a API FastAPI
# Execute este script na raiz do projeto

Write-Host "Iniciando API FastAPI..." -ForegroundColor Green

$possibleApiFolders = @("Backend", "Banco + API")
$apiFolder = $null
$initialLocation = Get-Location

foreach ($folder in $possibleApiFolders) {
    $candidatePath = Join-Path $initialLocation $folder
    $mainFile = Join-Path $candidatePath "main.py"
    if (Test-Path $mainFile) {
        $apiFolder = $candidatePath
        break
    }
}

if (-not $apiFolder) {
    Write-Host "ERRO: Nenhuma pasta de API válida encontrada." -ForegroundColor Red
    Write-Host "Certifique-se de que 'Backend' ou 'Banco + API' contenha o arquivo main.py." -ForegroundColor Yellow
    exit 1
}

Set-Location $apiFolder

function Invoke-PythonCommand {
    param(
        [string[]]$Arguments
    )

    if ($script:PythonCommand -eq "python") {
        & python @Arguments
    } else {
        & py -3 @Arguments
    }
}

$script:PythonCommand = "python"
$pythonVersion = $null

try {
    $pythonVersion = & python --version 2>&1
} catch {
    try {
        $pythonVersion = & py -3 --version 2>&1
        $script:PythonCommand = "py -3"
    } catch {
        Write-Host "ERRO: Python não encontrado! Instale Python 3.8+" -ForegroundColor Red
        exit 1
    }
}

$versionMatch = [regex]::Match($pythonVersion, '(\d+\.\d+\.\d+)')
if (-not $versionMatch.Success) {
    Write-Host "ERRO: Não foi possível identificar a versão do Python." -ForegroundColor Red
    exit 1
}

$versionNumber = [version]$versionMatch.Value
if ($versionNumber -lt [version]"3.8.0") {
    Write-Host "ERRO: É necessário Python 3.8 ou superior (encontrado $versionNumber)." -ForegroundColor Red
    exit 1
}

Write-Host "Python encontrado: $pythonVersion" -ForegroundColor Green

Write-Host "`nVerificando dependências..." -ForegroundColor Cyan
$venvPath = Join-Path $apiFolder "venv"
$activateScript = Join-Path $venvPath "Scripts\Activate.ps1"

if (Test-Path $venvPath) {
    if (-not (Test-Path $activateScript)) {
        Write-Host "Ambiente virtual corrompido. Removendo..." -ForegroundColor Yellow
        Remove-Item $venvPath -Recurse -Force
    }
}

if (-not (Test-Path $venvPath)) {
    Write-Host "Criando ambiente virtual..." -ForegroundColor Yellow
    Invoke-PythonCommand -Arguments @("-m", "venv", "venv")
}

if (-not (Test-Path $activateScript)) {
    Write-Host "ERRO: Ambiente virtual não foi criado corretamente." -ForegroundColor Red
    exit 1
}

Write-Host "Ativando ambiente virtual..." -ForegroundColor Yellow
& $activateScript

$requirementsCandidates = @("requirements.txt", "..\requirements.txt")
$requirementsFile = $null

foreach ($candidate in $requirementsCandidates) {
    $resolved = Resolve-Path -Path $candidate -ErrorAction SilentlyContinue
    if ($resolved) {
        $requirementsFile = $resolved.Path
        break
    }
}

if (-not $requirementsFile) {
    Write-Host "ERRO: Arquivo requirements.txt não encontrado." -ForegroundColor Red
    exit 1
}

Write-Host "Instalando dependências a partir de '$requirementsFile'..." -ForegroundColor Yellow
Invoke-PythonCommand -Arguments @("-m", "pip", "install", "-r", $requirementsFile)

Write-Host "`nIniciando servidor na porta 8000..." -ForegroundColor Green
Write-Host "Documentação: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "Pressione Ctrl+C para parar o servidor`n" -ForegroundColor Yellow

Invoke-PythonCommand -Arguments @("-m", "uvicorn", "main:app", "--reload", "--port", "8000")
