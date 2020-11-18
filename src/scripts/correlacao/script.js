const areaGrafico = document.querySelector('#graficoCorrelação')

const formManual = document.querySelector('.formManual')
const formArquivo = document.querySelector('.formArquivo')
const textoErroNome = document.querySelector('[data-js=inputNome]')
const textoErroValor = document.querySelector('[data-js=inputValor]')
const sectionGrafico = document.querySelector('.sectGrafico')

const btnCalcular = document.querySelector('#calcular')
const btnLimpar = document.querySelector('.btnLimpar')
const btnManual = document.querySelector('#btnManual')
const btnArquivo = document.querySelector('#btnArquivo')

const btnExcluirThumb = document.querySelector('.btnThumb')
const btnExcluirPopup = document.querySelector('.btnPopup')

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