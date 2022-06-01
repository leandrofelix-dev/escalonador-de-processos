
// * Importação do módulo para manipulação de arquivos
const fs = require('node:fs');

// * Definição das flags de execução do sistema:
// < urlCSV > [Armazena o endereço do arquivo CSV]
// < modo > [Refere-se ao modo de escalonamento dos processos]
// < modoExecucao > [Refere-se a exibição simplificada ou detalhada]

const urlCSV = process.argv[2];
const modo = process.argv[3];
const modoExecucao = process.argv[4];

const arquivo = fs.readFileSync(urlCSV, 'utf-8');
console.log({ urlCSV, modo, modoExecucao });

const lines = arquivo.split('\n');
console.log('Linhas: ', lines.lenght);

lines.forEach(line => console.log(line));

