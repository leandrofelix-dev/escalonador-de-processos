// * Importação dos módulos <fs> para manipulação de arquivos
const fs = require('node:fs');

// * Definição das flags de execução do sistema:
// < urlCSV > [Armazena o endereço do arquivo CSV]
// < modo > [Refere-se ao modo de escalonamento dos processos]
// < modoExecucao > [Refere-se a exibição simplificada ou detalhada]

const urlCSV = process.argv[2];
const modoEscalonamento = process.argv[3];
const modoExecucao = process.argv[4];

const arquivoCSV = fs.readFileSync(urlCSV, 'utf-8');

console.log({ urlCSV, modoEscalonamento, modoExecucao });

// Leitura do arquivo CSV através da biblioteca fs:node
const processos = arquivoCSV.split('\n');

for (let i = 1; i < processos.length; i++) {
    // Separação do objeto processos em um array para cada processo
    let processo = processos[i].split(',');

    // Atribuição dos elementos de cada array() em uma variável distinta
    //Função Number() converte o tipo de variável para StringType
    let idProcesso = processo[0];
    let chegadaProcesso = Number(processo[1]);
    let rajadaProcesso = Number(processo[2]);
    let prioridadeProcesso = Number(processo[3]);

    // Definição das variáveis auxiliares
    let tempoFinalizacao = (chegadaProcesso + rajadaProcesso);

    // Determina a função a ser executada baseada no modo de escalonamento
    switch (modoEscalonamento) {
        case "TEST":
            //Execução da função de teste, para debug da aplicação
            test(i, idProcesso, chegadaProcesso, rajadaProcesso, prioridadeProcesso);
            break;
        case "FCFS":
            fcfs(modoExecucao, idProcesso, tempoFinalizacao);
            break;
        case "SRTF":
            srtf(modoExecucao);
            break;
        case "RR":
            rr();
            break;
        case "SRTPF":
            srtpf(modoExecucao);
            break;
        case "PRIO":
            prio(modoExecucao);
            break;
        case "PRIOP":
            priop(modoExecucao);
            break;

        default:
            console.log("Insira um parâmetro válido");
            break;
    }
}

// Função de debug
function test(i, idProcesso, chegadaProcesso, rajadaProcesso, prioridadeProcesso) {
    console.log("# Processo", i);
    console.log("ID:", idProcesso);
    console.log("Chegada:", chegadaProcesso);
    console.log("Rajada:", rajadaProcesso)
    console.log("Prioridade:", prioridadeProcesso);

    console.log("\n ====================================================== \n");
}

function fcfs(modoExecucao, idProcesso, tempoFinalizacao) {

    /* MODO DE EXECUÇÃO FCFS */

    if (modoExecucao == 1) {
        console.log("O ID do processo é: ", idProcesso, "\n O tempo de finalização do projeto é: ", tempoFinalizacao);
    }
    else {
        console.log("MODO 2");
    }

}

/* ======================================================= */
