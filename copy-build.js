const fs = require('fs-extra');
const path = require('path');

// Caminho para o diretório de build gerado pelo Angular CLI
const buildPath = path.join(__dirname, 'dist', 'obizu-client', 'browser');

// Caminho para o diretório onde você deseja copiar o conteúdo
const outputPath = path.join(__dirname, 'obizu-client-build');

// Copia o conteúdo do diretório de build para o diretório de saída
fs.copySync(buildPath, outputPath);

console.log('Build copiado com sucesso para', outputPath);
