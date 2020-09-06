const formManual = document.querySelector('.formManual')
const formArquivo = document.querySelector('.formArquivo')
const textoErroNome = document.querySelector('[data-js=inputNome]')
const textoErroValor = document.querySelector('[data-js=inputValor]')

const inputNome = document.querySelector('#nomeVariavel')
const inputValores = document.querySelector('#valores')
const inputArquivo = document.querySelector('#inputArquivo')

const btnCalcular = document.querySelector('#calcular')

let formAtivado = false
let tipoForm
let dadosEntrada = {}

// Ativar formulário para inserção de dados
function ativaForm() {
    if(!formAtivado){
        document.querySelector('.formularios').classList.remove('esconder')
        formAtivado = true
    }
}

function exibirFormManual() {
    ativaForm()
    if(formManual.classList.contains('esconder')) {
        formManual.classList.remove('esconder')
    }
    formArquivo.classList.add('esconder')
    tipoForm = 'manual'
}
function exibirFormArquivo() {
    ativaForm()
    if(formArquivo.classList.contains('esconder')) {
        formArquivo.classList.remove('esconder')
    }
    formManual.classList.add('esconder')
    tipoForm = 'arquivo'
}

// valida se valores estão separado por virgula
inputValores.addEventListener('change', () => {

    if(inputValores.value.indexOf(',') == -1 
        && inputValores.value.trim().indexOf(' ') != -1) {   
            textoErroValor.innerText = 'Separe os elementos com ,'
            inputValores.classList.add('erro')
    } else {
        textoErroValor.innerText = ''
        inputValores.classList.remove('erro')

    }
})

btnCalcular.addEventListener('click', () => {
    switch (tipoForm) {
        case 'manual':
            if(!inputNome.value.trim()) {
                inputNome.classList.add('erro')
                textoErroNome.classList.add('erro')
                textoErroNome.innerText = 'Preencha o NOME'
            } else if (!inputValores.value.trim()) {
                inputValores.classList.add('erro')
                textoErroValor.classList.add('erro')
                textoErroValor.innerText = 'Preencha os VALORES'
            } else {
                dadosEntrada.nome = inputNome.value.trim()
                dadosEntrada.valores = inputValores.value.trim().split(',')
                dadosEntrada.tipoVar = document.querySelector
                    ('input[name="tipoVariavel"]:checked').value
                dadosEntrada.tipoCalc = document.querySelector('#tipoCalculo').value
            }
            break
        case 'arquivo':
            let arrayDadosArquivo
            let reader = new FileReader()

            console.log(arrayDadosArquivo);
            reader.onload = () => {
                arrayDadosArquivo = reader.result.split('\n')
                return arrayDadosArquivo
            }
            reader.readAsText(inputArquivo.files[0])
            console.log();
            break
        default: 
            alert('Algo de errado não está certo')
    }
})
