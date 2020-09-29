import { dropFile } from './dropArquivo.js'
import funcoesTratarDados from './tratarDados.js'
import funcoesCalculo from './calculos.js'
import { 
    criaTabela, 
    editarTabela, 
    criaCaixasDeMedias 
} from './tabelas.js'
import { 
    geraGrafico, 
    geraGraficoContinua, 
    optGraficoColuna, 
    optGraficoPizza 
} from './graficos.js'
import tratarDados from './tratarDados.js'

const formManual = document.querySelector('.formManual')
const formArquivo = document.querySelector('.formArquivo')
const textoErroNome = document.querySelector('[data-js=inputNome]')
const textoErroValor = document.querySelector('[data-js=inputValor]')
const formDescritiva = document.querySelector('#formDescritiva')
const sectionGrafico = document.querySelector('.sectGrafico')
const areaGrafico = document.querySelector('#grafico')

const inputNome = document.querySelector('#nomeVariavel')
const inputValores = document.querySelector('#valores')
const inputArquivo = document.querySelector('#inputArquivo')

const selectSeparatriz = document.querySelector('#separatrizes')
const inputRangeSeparatriz = document.querySelector('#range')
const inputNumSeparatriz = document.querySelector('#numSeparatriz')
const outputValorSeparatriz = document.querySelector('#resultSepara')
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

const dados = {
    nome: '',
    vetorDados: [],
    tipoVar: '',
    tipoCalc: '',
    valoresAgrupados: {},
    vetorObjetos: null
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


// Botão calcular, responsável por realizar os calculos, gerar tabela e gráficos
btnCalcular.addEventListener('click', () => {
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
        else {
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
    // Atribuindo os dados limpos capturados anteriormente
    dados.nome = nome
    dados.vetorDados = valores
    dados.tipoVar = document.querySelector('input[name="tipoVariavel"]:checked').value
    dados.tipoCalc = document.querySelector('#tipoCalculo').value
    
    // Caso Todas as entradas estejam validadas ele executa os calculos.
    if (validacao) {
        if (dados.tipoVar == 'continua') funcoesCalculo
            .calculaContinua(dados)

        // A soma da Frequência simples é igual para todas menos Continua
        else  funcoesCalculo.calculaFreqSi(dados)
        
        const [vetorFsPerc, vetorFreAc, vetorFreAcPerc] = funcoesCalculo
            .calcFreqPercent(dados)

        dados.vetorObjetos = tratarDados.agrupaValoresEmObjeto(
            dados.valoresAgrupados,
            vetorFsPerc, 
            vetorFreAc, 
            vetorFreAcPerc
        )

        console.log(dados.vetorObjetos );
        criaTabela(
            dados, 
            vetorFsPerc, 
            vetorFreAc, 
            vetorFreAcPerc
        )

        let e = []
        for (let i = 0; i < dados.vetorDados.length; i++){
            let aux = dados.vetorDados[i]
            if (isNaN(aux) == true){
                e = dados.vetorDados.sort()
            }
            else{
                e = dados.vetorDados.sort((a,b) => a-b)
            }
        }
        
        let u = [], w = [], ex = [], ponto = [], fi = []
        let soma = 0, fant = 0, fimd = 0, h = 0, f = 0
        let med = 0, mediana = 0, sep = 0, media = 0, moda = 0
        let ax = 0
        let se = 0
        let desvio = 0
        let cv = 0 
        
        let separatriz = 'quartil'
        let quadrante = inputRangeSeparatriz.value
        outputValorSeparatriz.value = 'Nada Ainda'

        switch (separatriz){
            case 'quartil':
                se = (quadrante*(vetorFreAc[vetorFreAc.length -1]/4)).toFixed()
                break
            case 'quintil':
                se = (quadrante*(vetorFreAc[vetorFreAc.length -1]/5)).toFixed()
                break
            case 'decil':
                se = (quadrante*(vetorFreAc[vetorFreAc.length -1]/10)).toFixed()
                break
            case 'percentil':
                se = (quadrante*(vetorFreAc[vetorFreAc.length -1]/100)).toFixed()
                break
        }

        if (dados.tipoVar === 'discreta'){
            for (let dt in dados.valoresAgrupados){
                u.push(parseInt(dt))
                w.push(dados.valoresAgrupados[dt])
                 
            }
            let z =[]
            for (let o = 0; o < u.length; o++){
                f = parseInt(w[o]) * parseInt(u[o])
                ex.push(f)
            }   
            soma = ex.reduce((total, currentElement) => total + currentElement)
            media = (soma/ vetorFreAc[vetorFreAc.length - 1]).toFixed(2)
            meio = (vetorFreAc[vetorFreAc.length -1]/2).toFixed()
            e = dados.vetorDados.sort((a,b) => a-b)
            mediana = e[meio]
            let au = []
            for(data in dados.valoresAgrupados){
                au.push(dados.valoresAgrupados[data])
            }
            let a = au.reduce(function(a,b){return Math.max(a,b)})
            for(dt in dados.valoresAgrupados){
                if (dados.valoresAgrupados[dt] === a){
                    moda = dt
                }
            }
            sep = e[se]
            if (dados.tipoCalc === 'populacao'){
                for (var o = 0; o < u.length; o++){
                    ax = (u[o] - media)**2 * w[o]
                    z.push(ax)
                }
                soma = z.reduce((total, currentElement) => total + currentElement)
                desvio = Math.sqrt(soma/vetorFreAc[vetorFreAc.length - 1]).toFixed(2)
                cv = ((desvio/media)*100).toFixed(2)
            }else{
                for (var o = 0; o < u.length; o++){
                    ax = (u[o] - media)**2 * w[o]
                    z.push(ax)
                }
                soma = z.reduce((total, currentElement) => total + currentElement)
                desvio = Math.sqrt(soma/(vetorFreAc[vetorFreAc.length - 1] - 1)).toFixed(2)
                cv = ((desvio/media)*100).toFixed(2)
            }

        } else if (dados.tipoVar === 'continua'){
            for (let dt in dados.valoresAgrupados){
                ex.push((dt.split(' |--- ')))
                fi.push(dados.valoresAgrupados[dt])
            }
            med  = Math.trunc(vetorFreAc[vetorFreAc.length-1] /2)
            let x = e[med]
            for (let num in ex){
                u.push(parseInt(ex[num][0]))
                w.push(parseInt(ex[num][1]))   
            }
            for (let z = 0; z <= u.length; z++){
                if (x>= u[z] && x< w[z]){
                    f = u[z]
                    if ((z-1) != -1){
                        fant = fi[z-1]
                    }else{
                        fant = 0
                    }
                    fimd = fi[z]
                    h = w[z] - u[z]
                    break
                }
                
            }
            
            mediana = (f + (((med - fant)/fimd)*h)).toFixed(2)
            sep = (f + (((se - fant)/fimd)*h)).toFixed(2)
            for(let q = 0; q < u.length;q++){
                ponto.push((u[q] + w[q])/2)
                soma = soma + (ponto[q]*fi[q])
            }
            media = (soma / vetorFreAc[vetorFreAc.length - 1]).toFixed(1)
            let au = []
            for(let data in dados.valoresAgrupados){
                au.push(dados.valoresAgrupados[data])
            }
            let a = au.reduce(function(a,b){return Math.max(a,b)})
            let t = au.indexOf(a)
            moda = ((u[t] + w[t])/2).toFixed(0)
            let v = []
            let xi = []
            for (var p = 0; p < u.length; p++){
                ax = parseInt((u[p] + w[p])/2).toFixed(0)
                xi.push(ax)
                v.push(xi[p] * au[p])
            }
            soma = v.reduce((total, currentElement) => total + currentElement)
            let medDesvio = 0
            medDesvio = (soma/vetorFreAc[vetorFreAc.length  - 1]).toFixed(2)
            let z = []
            for (var o = 0; o < u.length; o++){
                ax = (xi[o] - medDesvio)**2 * au[o]
                z.push(ax)
            }
            soma = z.reduce((total, currentElement) => total + currentElement)
            desvio = Math.sqrt(soma/vetorFreAc[vetorFreAc.length - 1]).toFixed(2)
            cv = ((desvio/media)*100).toFixed(2)
            
        }else{
            media = ['Não Possui média']

            if(e.length % 2 == 0){
                let esq = 0
                let dir = e.length - 1
                let meio = 0 
                meio = Math.trunc((esq+dir)/2)
                if (e[meio] == e[meio+1]){
                mediana =[e[meio]]
                }else{
                    mediana = [e[meio],e[meio+1]]
                }
                
            }else{
                let esq = 0
                let dir = e.length - 1
                let meio = 0 
                meio = Math.trunc((esq+dir)/2)
                mediana = e[meio]
            }

            let au = []
            for(let data in dados.valoresAgrupados){
                au.push(dados.valoresAgrupados[data])
            }
            let a = au.reduce(function(a,b){return Math.max(a,b)})
                
            let auxiliar = []
            for(let dt in dados.valoresAgrupados){
                if (dados.valoresAgrupados[dt] === a){
                    auxiliar.push(dt)
                }
            }
                
            if (auxiliar.length === au.length){
                moda.push('Estes dados são amodais')
            }else{
                moda = auxiliar
            }
            sep = e[se]
               

        }
        
        criaCaixasDeMedias([media,moda,mediana])
        let vetorNomeCol = []
        for(let nomeCol in dados.valoresAgrupados) {
            vetorNomeCol.push(nomeCol)
        }

        switch (dados.tipoVar){
            case 'nominal':
                geraGrafico(areaGrafico, 'pie', vetorNomeCol, vetorFsPerc, 'Qualitativa Nominal', optGraficoPizza())
                break
            case 'ordinal':
                geraGrafico(areaGrafico, 'pie', vetorNomeCol, vetorFsPerc, 'Qualitativa Ordinal', optGraficoPizza())
                break
            case 'discreta': 
                geraGrafico(areaGrafico, 'bar', vetorNomeCol, vetorFsPerc, 'Quantitativa Discreta', optGraficoColuna())
                break
            case 'continua': 
                geraGraficoContinua(areaGrafico, 'bar', vetorNomeCol, vetorFsPerc, 'Quantitativa Contínua', optGraficoColuna())
                break
            }

        if(dados.tipoVar == 'ordinal') {
            document.querySelector('.popup').classList.remove('esconder')
            editarTabela()
        }
    
        if(sectionGrafico.classList.contains('esconder')) {
            sectionGrafico.classList.remove('esconder')
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
        
        formDescritiva.reset()
    }
    excluirThumb()
})