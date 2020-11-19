import dropFile from './dropArquivo.js'
import funcoesTratarDados from './tratarDados.js'
import funcoesCalculo from './calculos.js'

const areaGrafico = document.querySelector('#graficoCorrelação')

const formManual = document.querySelector('.formManual')
const formArquivo = document.querySelector('.formArquivo')
// const textoErroNome = document.querySelector('[data-js=inputNome]')
// const textoErroValor = document.querySelector('[data-js=inputValor]')
const sectionGrafico = document.querySelector('.sectGrafico')
const textoCorrelacao = document.querySelector('.textoCorrelacao-js')
const valorRegressaoA = document.querySelector('.valorRegressaoA')
const valorRegressaoB = document.querySelector('.valorRegressaoB')  

const inputArquivo = document.querySelector('#inputArquivoCorrelacao')
const valorRegressaoX = document.querySelector('#valorRegressaoX')
const valorRegressaoY = document.querySelector('#valorRegressaoY')


const dropzone = document.querySelector('.dropzone')
let arquivo = null // recebe os arquivos posteriormente

const btnCalcular = document.querySelector('#calcular')
const btnLimpar = document.querySelector('.btnLimpar')
const btnManual = document.querySelector('#btnManual')
const btnArquivo = document.querySelector('#btnArquivo')

const btnExcluirThumb = document.querySelector('.btnThumb')
const btnExcluirPopup = document.querySelector('.btnPopup')

let vetorValoresInput = []

let formAtivado = false
let validacao = false
let tipoForm = null


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
  if(formManual.classList.contains('esconder')) formManual.classList.remove('esconder')
  
  formArquivo.classList.add('esconder')
  tipoForm = 'manual'
})

btnArquivo.addEventListener('click', () => {
  ativaForm()
  if(formArquivo.classList.contains('esconder')) formArquivo.classList.remove('esconder')
      
  formManual.classList.add('esconder')
  tipoForm = 'arquivo'
}) 


// Tratamento do arquivo recebido
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

// Cria e atualiza a thumbnail do arquivo
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


btnCalcular.addEventListener('click', () => {
  const inputX = document.querySelector('#valoresX')
  const InputY = document.querySelector('#valoresY')

  const [vetorX, vetorY] = funcoesTratarDados.capturaDadosInputManual(inputX, InputY)

  const somaX = funcoesCalculo.calculoSomatoria(vetorX)
  const somaY = funcoesCalculo.calculoSomatoria(vetorY)

  const [somaXY, somaX2, somaY2] = funcoesCalculo.calculoDemaisColunas(vetorX, vetorY)


  const r = funcoesCalculo.calculoCorrelacao(vetorX, somaX, somaY, somaXY, somaX2, somaY2)
  const tipoCorrelacao = funcoesCalculo.tipoCorrelacao(r)
  
  // Exibe o valor da Correlação
  textoCorrelacao.innerHTML = `Correlação ${tipoCorrelacao} de ${(r*100).toFixed(2)}%`

  // Exibe o valor de A e B na área de regressão
  const {a, b} = funcoesCalculo.calculoRegressao(null, vetorX, somaX, somaY, somaXY, somaX2)
  valorRegressaoA.innerHTML = a.toFixed(2)
  valorRegressaoB.innerHTML = b.toFixed(2)


  // realiza o calculo da regressão de acordo com a variavel digitada
  valorRegressaoX.addEventListener('input', () => {
    const regressaoX = valorRegressaoX.value
    debugger
    const {resultadoRegressao} = funcoesCalculo.calculoRegressao(regressaoX, vetorX, somaX, somaY, somaXY, somaX2)

    valorRegressaoY.value = resultadoRegressao.toFixed(2)
  })

  valorRegressaoY.addEventListener('input', () => {
    const regressaoY = valorRegressaoY.value
    const {resultadoRegressao} = funcoesCalculo.calculoRegressao(regressaoY, vetorX, somaX, somaY, somaXY, somaX2)

    valorRegressaoX.value = resultadoRegressao.toFixed(2)
  })


  // Revela as divs ocultas
  if(document.querySelector('.sectionCorrelacao').classList.contains('esconder')) {
    document.querySelector('.sectionCorrelacao').classList.remove('esconder')
  }

  if(document.querySelector('.sectionRegressao').classList.contains('esconder')) {
    document.querySelector('.sectionRegressao').classList.remove('esconder')
  }
  
})