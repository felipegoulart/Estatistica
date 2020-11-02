import { dropFile } from './dropArquivo.js'
import funcoesTratarDados from './tratarDados.js'
import funcoesCalculo from './calculos.js'
import funcoesDOM from './tabelas.js'

const formManual = document.querySelector('.formManual')
const formArquivo = document.querySelector('.formArquivo')
const textoErroNome = document.querySelector('[data-js=inputNome]')
const textoErroValor = document.querySelector('[data-js=inputValor]')
const sectionGrafico = document.querySelector('.sectGrafico')

const inputNome = document.querySelector('#nomeVariavel')
const inputValores = document.querySelector('#valores')
const inputArquivo = document.querySelector('#inputArquivo')

const selectSeparatriz = document.querySelector('#separatrizes')
const inputRangeSeparatriz = document.querySelector('#range')
const inputNumSeparatriz = document.querySelector('#numSeparatriz')
const dropzone = document.querySelector('.dropzone')
let arquivo = null // recebe os arquivos posteriormente

const btnCalcular = document.querySelector('#calcular')
const btnLimpar = document.querySelector('.btnLimpar')
const btnManual = document.querySelector('#btnManual')
const btnArquivo = document.querySelector('#btnArquivo')

const btnExcluirThumb = document.querySelector('.btnThumb')
const btnExcluirPopup = document.querySelector('.btnPopup')

let formAtivado = false
let validacao = false
let tipoForm = null

const dados = { // O objeto vai conter todos os dados dos calculos
    nome: '',
    vetorDados: [],
    tipoVar: '',
    tipoCalc: '',
    maiorFi: '',
    fiTotal: '',
    meioVet: '',
    media: '',
    moda: '',
    mediana: '',
    se: '',
    vetorFi: [],
    vetorFsPerc: [],
    vetorFreAc: [],
    vetorFreAcPerc: [],
    valoresAgrupados: {},
    vetorObjetos: [],
    dadosContinua: {}
}

let vetorValoresInput = []
let nome, valores

// ----------Revelar Formulário--------- \\
// Ativar formulário para inserção de dados
function ativaForm() {
    if(!formAtivado){
        document.querySelector('.formularios').classList.remove('esconder')
        formAtivado = true
    }
}

btnManual.addEventListener('click', () => {
    ativaForm()
    if(formManual.classList.contains('esconder')) {
        formManual.classList.remove('esconder')
    }
    formArquivo.classList.add('esconder')
    tipoForm = 'manual'
})

btnArquivo.addEventListener('click', () => {
    ativaForm()
    if(formArquivo.classList.contains('esconder')) {
        formArquivo.classList.remove('esconder')
    }
    formManual.classList.add('esconder')
    tipoForm = 'arquivo'
}) 

// ----------Validar Entrada Manual--------- \\
// valida se valores estão separado por virgula
inputValores.addEventListener('change', () => {

    if(inputValores.value.indexOf(';') == -1 
        && inputValores.value.trim().indexOf(' ') != -1) {   
            textoErroValor.innerText = 'Separe os elementos com ;'
            inputValores.classList.add('erro')
    } else {
        textoErroValor.innerText = ''
        inputValores.classList.remove('erro')
    }
})

inputNome.addEventListener('change', () => {
    if(inputNome.value.trim()) {
        textoErroNome.innerText = ''
        inputNome.classList.remove('erro')
    }
})

const recebeArquivo = inputArquivo => {
    arquivo = inputArquivo
    const nomeArq = arquivo.name

    dropzone.classList.add('dragging')

    atualizarThumb(nomeArq)
    capturaDadosArquivo(arquivo)
}
const capturaDadosArquivo = arquivo => {
    const reader = new FileReader()
        
    reader.readAsText(arquivo)
    
    reader.onloadend = () => {
        vetorValoresInput = reader.result.split('\n')
    }
}

inputArquivo.addEventListener('change', () => {
    recebeArquivo(inputArquivo.files[0])
})

dropFile(dropzone, recebeArquivo, atualizarThumb, capturaDadosArquivo)

/*
    Ao inserir um arquivo no dropZone aparece uma thumbnail com o nome do arquivo.
    As Duas funções a seguir são responsáveis por atualizar o nome do arquivo na thumb 
deletar quando for necessário
*/
function atualizarThumb (nomeArquivo) {
    document.querySelector('.nomeArquivo--thumb').innerText = nomeArquivo

    document.querySelector('.textoDropzone').classList.add('esconder')
    document.querySelector('.thumbnail').classList.remove('esconder')
}

function excluirThumb () {
    arquivo = null
    validacao = false
    document.querySelector('.dropzone').classList.remove('dragging')
    document.querySelector('.textoDropzone').classList.remove('esconder')
    document.querySelector('.thumbnail').classList.add('esconder')
}

btnExcluirThumb.addEventListener('click', excluirThumb)
btnLimpar.addEventListener('click', excluirThumb)

btnExcluirPopup.addEventListener('click', () => document.querySelector('.popup')
    .classList.add('esconder'))

// ----------Controlador Separatrizes--------- \\
function defineValoresInputSeparatrizes(input, value) {
    input.min = value
    input.step = value
    input.value = value
}
selectSeparatriz.addEventListener('change', () => {
   switch (selectSeparatriz.value) {
        case 'quartil':
            defineValoresInputSeparatrizes(inputNumSeparatriz, 25)
            defineValoresInputSeparatrizes(inputRangeSeparatriz, 25)
            break;

        case 'quintil':
            defineValoresInputSeparatrizes(inputNumSeparatriz, 20)
            defineValoresInputSeparatrizes(inputRangeSeparatriz, 20)
            break;

        case 'decil':
            defineValoresInputSeparatrizes(inputNumSeparatriz, 10)
            defineValoresInputSeparatrizes(inputRangeSeparatriz, 10)
            break;
    
        case 'percentil':
            defineValoresInputSeparatrizes(inputNumSeparatriz, 1)
            defineValoresInputSeparatrizes(inputRangeSeparatriz, 1)
            break;
   }
})

inputRangeSeparatriz.addEventListener('input', () => {
    inputNumSeparatriz.value = inputRangeSeparatriz.value
})

inputNumSeparatriz.addEventListener('input', () => {
    inputRangeSeparatriz.value = inputNumSeparatriz.value
})


const validarEntradas = () => {
    if(tipoForm == 'manual') {
        if(!inputNome.value.trim()) {
            inputNome.classList.add('erro')
            inputNome.focus()

            textoErroNome.classList.add('erro')
            textoErroNome.innerText = 'Preencha o NOME'

            validacao = false
        }
        else if (!inputValores.value.trim()) {
            inputValores.classList.add('erro')
            inputValores.focus()

            textoErroValor.classList.add('erro')
            textoErroValor.innerText = 'Preencha os VALORES'

            validacao = false
        }
        else { // caso todos as verificações passe, ele vai executar a função para captura e limpeza dos dados
            [nome, valores] = funcoesTratarDados // Recebe os dados limpos dos inputs 
                .capturaDadosInputManual(inputValores, inputNome)
            validacao = true
        }
    }
    else {
        if(!arquivo) { // Testa se o input tem algum arquivo
            alert('Insira um arquivo!')

            validacao = false
        }
        else {
            [nome, valores] = funcoesTratarDados // Recebe os dados limpos do arquivo 
                .separarDadosArquivo(vetorValoresInput)
            validacao = true
        }
    }

    if (validacao) {
        funcoesTratarDados.salvarDadosNoObjeto(dados, nome, valores)
        if(dados.tipoVar == 'continua') funcoesCalculo.calculaContinua(dados) 
        
        else funcoesCalculo.calculaFreqSi(dados)
    }
    
}

const atualizarValorSeparatriz = () => {
    const tipoVariavel = JSON.parse(sessionStorage.getItem('tipoVar'))
        
        let quadrante = inputRangeSeparatriz.valueAsNumber
        let se = Math.round(quadrante * (dados.fiTotal -1) / 100)
        
        if(tipoVariavel == 'continua') {
            const separatriz = funcoesCalculo
                .calculaSeparatrizContinua(dados, se)
            funcoesDOM.atualizarValorSeparatriz(separatriz)
            
        } else if (tipoVariavel == 'discreta') {
            const separatriz = funcoesCalculo
                .calculaSeparatrizDiscreta(se)
            funcoesDOM.atualizarValorSeparatriz(separatriz)
            
        } else {
            const separatriz = funcoesCalculo
                .calculaSeparatrizQualitativa(se)
            funcoesDOM.atualizarValorSeparatriz(separatriz)
        }
        
}

// Botão calcular, responsável por realizar os calculos, gerar tabela e gráficos
btnCalcular.addEventListener('click', () => {
    validarEntradas()

    inputRangeSeparatriz.addEventListener('input', atualizarValorSeparatriz)
    inputNumSeparatriz.addEventListener('input', atualizarValorSeparatriz)
      
    if(dados.tipoVar == 'ordinal') {
        document.querySelector('.popup').classList.remove('esconder')
        funcoesDOM.editarTabela()
    }

    if(sectionGrafico.classList.contains('esconder')) {
        sectionGrafico.classList.remove('esconder')
    }

    if(document.querySelector('.sectionMedias').classList.contains('esconder')) {
        document.querySelector('.sectionMedias').classList.remove('esconder')
    }

    if(document.querySelector('.sectionSeparatrizes').classList.contains('esconder')) {
        document.querySelector('.sectionSeparatrizes').classList.remove('esconder')
    }
    
    //zerar variaveis
    vetorValoresInput = []
    dados.nome = ''
    dados.vetorDados = []
    dados.tipoVar = ''
    dados.tipoCalc = ''
    dados.valoresAgrupados = {}
})