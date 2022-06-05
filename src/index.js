
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

const processos = arquivoCSV.split('\n');

switch (modoEscalonamento) {
    case "FCFS":
        fcfs(modoExecucao);
        break;
    case "SRTF":
        // srtf(modoExecucao);
        break;
    case "RR":
        // rr();
        break;
    case "SRTPF":
        // srtpf(modoExecucao);
        break;
    case "PRIO":
        // prio(modoExecucao);
        break;
    case "PRIOP":
        // priop(modoExecucao);
        break;

    default:
        console.log("Insira um parâmetro válido");
        break;
}


function fcfs(modoExecucao) {

    /* MODO DE EXECUÇÃO FCFS */

    let processo = processos[1].split(',');
    let chegadaProcesso = Number(processo[1]); //Função Number() converte o tipo de variável para StringType
    let rajadaProcesso = Number(processo[2]);

    let tempoFinalizacao = (chegadaProcesso + rajadaProcesso);
    

    // for (let i = 1; i < processos.length; i++) {
    //     console.log(processos[i]); //! Esse valor no parâmetro do vetor refere-se ao processo individualmente
    //     let tempo_de_finalizacao = (processos[i][1] + processos[i][2]);
    //     console.log("Tempo de execução do processo: ", tempo_de_finalizacao);
    //     console.log("Processo", i, ":", matriz_dos_processos[i]);
    //     processos_splitados[i] = processos[i].split('/n');
    //     console.log("Processo: ", processos_splitados);
    //     console.log("Tempo de execução: ", tempo_de_finalizacao);
    // }

}




/* ======================================================= */
