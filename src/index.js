
// * Importação dos módulos <fs> e <neatCsv> para manipulação de arquivos
const fs = require('node:fs');

// * Definição das flags de execução do sistema:
// < urlCSV > [Armazena o endereço do arquivo CSV]
// < modo > [Refere-se ao modo de escalonamento dos processos]
// < modoExecucao > [Refere-se a exibição simplificada ou detalhada]

const urlCSV = process.argv[2];
const modo = process.argv[3];
const modoExecucao = process.argv[4];

let matriz_dos_processos = [];

const arquivo = fs.readFileSync(urlCSV, 'utf-8');
console.log({ urlCSV, modo, modoExecucao });

const processos = arquivo.split('\n');

// Percorre o arquivo "splitado" por vírgulas e atribui seus valores à matriz
for (let i = 1; i < processos.length - 1; i++) {
    matriz_dos_processos[i] = processos[i];

    console.log("Processo", i, ":", matriz_dos_processos[i]);
}



/* ======================================================= */
