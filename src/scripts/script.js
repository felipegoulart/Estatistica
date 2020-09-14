const formManual = document.querySelector('.formManual')
const formArquivo = document.querySelector('.formArquivo')
const textoErroNome = document.querySelector('[data-js=inputNome]')
const textoErroValor = document.querySelector('[data-js=inputValor]')
const formDescritiva = document.querySelector('#formDescritiva')
const sectionGrafico = document.querySelector('.sectGrafico')
const grafico = document.querySelector('#grafico').getContext('2d');

const inputNome = document.querySelector('#nomeVariavel')
const inputValores = document.querySelector('#valores')
const inputArquivo = document.querySelector('#inputArquivo')

const btnCalcular = document.querySelector('#calcular')
const btnLimpar = document.querySelector('.btnLimpar')

let formAtivado = false
let validacao = false
let tipoForm = null

const dados = {
    nome: '',
    vetorValores: [],
    tipoVar: '',
    tipoCalc: '',
    valoresAgrupados: {},
}

let vetorValoresArquivo = []

// Função para gerar a tabela
const geraGrafico = (grafico, tipoGraf = 'bar', nomesCol, valores, nomeGraf = 'Gráfico') => {
    const meuGrafico = new Chart(grafico, {
        type: tipoGraf,
        data: {
            labels: nomesCol,
            datasets: [{
                label: nomeGraf,
                data: valores,
                borderWidth: 1,
                backgroundColor: cor(valores), // Usa o tamanho do vetor para gerar as cores
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    })
}

// Função para gerar as cores para o Gráfico de acordo com o número de elementos
function cor(vetor) { 
    let cores = []

    for(let i = 0; i < vetor.length; i++) {
        i % 2 == 0 ? cores.push('#6C63FF') : cores.push('#FFC463')
    }
    return cores
}

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

    if(inputValores.value.indexOf(';') == -1 
        && inputValores.value.trim().indexOf(' ') != -1) {   
            textoErroValor.innerText = 'Separe os elementos com ;'
            inputValores.classList.add('erro')
    } else {
        textoErroValor.innerText = ''
        inputValores.classList.remove('erro')
    }
})

inputArquivo.addEventListener('change', () => {
    const reader = new FileReader()
        
    reader.readAsText(inputArquivo.files[0])
    
    reader.onloadend = () => {
        vetorValoresArquivo = reader.result.split('\n')
    }
})

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
            dados.nome = inputNome.value.trim()
            dados.vetorValores = inputValores.value.trim().split(';')
            dados.tipoVar = document.querySelector
            ('input[name="tipoVariavel"]:checked').value
            dados.tipoCalc = document.querySelector('#tipoCalculo').value
            validacao = true
        }
    }
    else {
        dados.nome = vetorValoresArquivo.shift()
        dados.vetorValores = vetorValoresArquivo.filter(elemento => elemento != '')
        dados.tipoVar = document.querySelector
        ('input[name="tipoVariavel"]:checked').value
        dados.tipoCalc = document.querySelector('#tipoCalculo').value
        
        validacao = true
    }

    if (validacao) {
        if (dados.tipoVar == 'continua'){
            dados.vetorValores = dados.vetorValores.map(elemento => Number(elemento))        
            const calculaIntervalo = valores => {
                const vetor = valores.sort((a, b) => a-b)
                const menor = vetor[0], maior = vetor[vetor.length -1]
                let amplitude = maior - menor
            
                const j = Math.trunc(vetor.length ** 0.5)
                const i = j -1
                const k = j +1
            
                do {
                    amplitude++
                    if(amplitude % i == 0) {
                        return [i, amplitude / i]
                    }
                    else if(amplitude % j == 0) {
                        return [j, amplitude / j]
                    }
                    else if(amplitude % k == 0) {
                        return [k, amplitude / k]
                    }
                } while (amplitude < maior)
            }

            const [linhas, intervalo] = calculaIntervalo(dados.vetorValores)

            let inicio = null
            let fim = null
        
            for(let i = 0; i < linhas; i++ ) {
                !inicio ? inicio = dados.vetorValores[0] : inicio = fim
                fim = inicio + intervalo
        
                const nomeAtributo = `${inicio} |--- ${fim}`
        
                dados.vetorValores.filter(elemento => {
                    if(elemento >= inicio && elemento < fim) {
                        !dados.valoresAgrupados[nomeAtributo] ? dados.valoresAgrupados[nomeAtributo] = 1
                            : dados.valoresAgrupados[nomeAtributo] += 1
                    }
                })
            }
        }
        else {
            dados.vetorValores.filter(elemento => {
                dados.valoresAgrupados[elemento] ? dados.valoresAgrupados[elemento] += 1
                    : dados.valoresAgrupados[elemento] = 1
            })
        } 

        const sectionTabela = document.querySelector('.sectionTabela')

        const criaTabela = (dadosTratados) => {

            const tabela = document.createElement('table')
            const variavel = document.createElement('th')
            const freqSimples = document.createElement('th')

            variavel.innerText = dados.nome
            freqSimples.innerText = 'Frequência Simples'

            tabela.appendChild(variavel)
            tabela.appendChild(freqSimples)

            for(const chave in dadosTratados){
                const linha = document.createElement('tr')
                const nomeVariavel = document.createElement('td')
                const valorVariavel = document.createElement('td')

                nomeVariavel.innerText = chave
                valorVariavel.innerText = dadosTratados[chave]

                linha.appendChild(nomeVariavel)
                linha.appendChild(valorVariavel)

                tabela.appendChild(linha)
            }
            
            if(sectionTabela.classList.contains('esconder')){
                sectionTabela.classList.remove('esconder')
            }
            
            if(sectionTabela.childElementCount == 1){
                const tabelaARemover = sectionTabela.firstElementChild

                sectionTabela.removeChild(tabelaARemover)
                sectionTabela.appendChild(tabela)
            } 
            else sectionTabela.appendChild(tabela)
            
        }

        criaTabela(dados.valoresAgrupados)
        
        //zerar variaveis
        vetorValoresArquivo = []
        dados.nome = ''
        dados.vetorValores = []
        dados.tipoVar = ''
        dados.tipoCalc = ''
        dados.valoresAgrupados = {}

        formDescritiva.reset()

        if(sectionGrafico.classList.contains('esconder')) sectionGrafico
            .classList.remove('esconder')

        geraGrafico(grafico, 'bar')
        }
        else alert('Verifique todos os CAMPOS')
    })