// * Importação dos módulos <fs> para manipulação de arquivos
const fs = require('node:fs');

// FUNCOES SORT
function menorChegada(a, b) {
    if (a.chegada < b.chegada) {
        return -1;
    }
    if (a.chegada > b.chegada) {
        return 1;
    }
    return 0;
}

function menorRajada(a, b) {
    if (a.rajada < b.rajada) {
        return -1;
    }
    if (a.rajada > b.rajada) {
        return 1;
    }
    return 0;
}

// * Definição das flags de execução do sistema:
// < urlCSV > [Armazena o endereço do arquivo CSV]
// < modo > [Refere-se ao modo de escalonamento dos processos]
// < modoExecucao > [Refere-se a exibição simplificada ou detalhada]

const urlCSV = process.argv[2];
const modoEscalonamento = process.argv[3];
const modoExecucao = Number(process.argv[4]);

const arquivoCSV = fs.readFileSync(urlCSV, 'utf-8');

// Armazena todas as instancias de processos
var processos = new Array();

// Armazena o tempo
var tempo = 1;

class Processo {

    constructor(id, chegada, rajada, prioridade) {
        this.id = id;
        this.chegada = chegada;
        this.rajada = rajada;
        this.prioridade = prioridade;
        this.comeco = undefined;
        this.termino = undefined;
        this.contexto = undefined;
        this.terminado = false;
    }

    debug() {
        console.log("id -> ", this.id, "chegada ->", this.chegada, "rajada -> ", this.rajada, "prioridade ->", this.prioridade);
    }
}

console.log({ urlCSV, modoEscalonamento, modoExecucao });

// Leitura do arquivo CSV através da biblioteca fs:node
const arquivo = arquivoCSV.split('\n');

// Para  cada linha do arquivo csv
// exceto a primeira, pois são os cabeçalhos
for (let linha = 1; linha < arquivo.length; linha++) {
    // PID | chegada | rajada | prioridade
    let split = arquivo[linha].split(",");

    // cria um processo com os dados acima
    let processo = new Processo(split[0][1], split[1], split[2], split[3][0]);

    // envia o processo para a variavel global processos
    processos.push(processo);
}

// Determina a função a ser executada baseada no modo de escalonamento
switch (modoEscalonamento) {
    case "TEST":
        //Execução da função de teste, para debug da aplicação
        test();
        break;
    case "FCFS":
        fcfs(modoExecucao);
        break;
    case "SRTF":
        srtf();
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

/* MODO DE DEBUG PARA O DESENVOLVIMENTO */
function test() {
    console.log("oi");
}

function fcfs(modoExecucao) {
    // filtra todos os processos na ordem de chegada
    let ordemChegada = processos.sort(menorChegada);

    // enquanto o ultimo processo nao for terminado
    while (!ordemChegada[ordemChegada.length - 1].terminado) {
        // checa se o primeiro processo terminou
        if (ordemChegada[0].terminado) {
            // se tiver terminado, tira o processo da fila
            ordemChegada.shift();
        }

        // se nao tiver terminado, executa outra vez
        ordemChegada[0].rajada--;

        // checa se foi a ultima execucao
        if (ordemChegada[0].rajada == 0) {
            // se for, anota que terminou
            ordemChegada[0].terminado = true;
            ordemChegada[0].termino = tempo;
        }

        // aumenta o tempo
        tempo++;
    }
}


function srtfp(modoExecucao) {
    // armazena quem ja chegou
    let chegados = new Array;

    // enquanto o ultimo processo nao for terminado
    while (!processos[processos.length - 1].terminado) {
        // adiciona os processos que ja chegaram ao array chegados
        for (processo of processos) {
            if (tempo == processo.chegada) {
                chegados.push(processo);
            }
        }

        // filtra o array dos chegados
        let ordemRajada = chegados.sort(menorRajada)

        ordemRajada[0].debug();
        // checa se o primeiro processo terminou
        if (ordemRajada[0].terminado) {
            // se tiver terminado, tira o processo da fila
            ordemRajada.shift();
        }

        // se nao tiver terminado, executa outra vez
        ordemRajada[0].rajada--;

        // checa se foi a ultima execucao
        if (ordemRajada[0].rajada == 0) {
            // se for, anota que terminou
            ordemRajada[0].terminado = true;
            ordemRajada[0].termino = tempo;
        }

        // aumenta o tempo
        tempo++;
    }

    console.log(processos[processos.length -1].termino);

}

function srtf(modoExecucao) {
    // armazena quem ja chegou
    let chegados = new Array;
    // armazena na ordem de menor rajada
    let ordemRajada = new Array;

    // calcula o tempo maximo de execucao
    let tempoMaximo = 0;

    for(processo of processos){
        tempoMaximo+=parseInt(processo.rajada);
    }

    console.log(tempoMaximo)
    // enquanto o ultimo processo nao for terminado
    while (tempo <= tempoMaximo) {

        // adiciona os processos que ja chegaram ao array chegados
        for (processo of processos) {
            if (tempo == processo.chegada) {
                chegados.push(processo);
            }
        }

        // filta a primeira vez
        if (tempo == 1){
            ordemRajada = chegados.sort(menorRajada);
        }

        console.log(tempo);
        ordemRajada[0].debug();
        // checa se o primeiro processo terminou
        if (ordemRajada[0].terminado) {
            // se tiver terminado, tira o processo da fila
            ordemRajada.shift();

            // filtra o array dos chegados
            ordemRajada = chegados.sort(menorRajada)
        }

        // se nao tiver terminado, executa outra vez
        ordemRajada[0].rajada--;

        // checa se foi a ultima execucao
        if (ordemRajada[0].rajada == 0) {
            // se for, anota que terminou
            ordemRajada[0].terminado = true;
            ordemRajada[0].termino = tempo;
        }

        // aumenta o tempo
        tempo++;
    }
    // console.log(processos[processos.length -1].termino);

}
/* ======================================================= */