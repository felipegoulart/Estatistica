// import {arrastarESoltar} from './tabela.js'

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
    vetorObjetos: null
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
                borderWidth: 2,
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

const geraGraficoContinua = (grafico, tipoGraf = 'bar', nomesCol, valores, nomeGraf = 'Gráfico') => {
    const meuGrafico = new Chart(grafico, {
        type: tipoGraf,
        data: {
            labels: nomesCol,
            datasets: [{
                label: nomeGraf,
                data: valores,
                borderWidth: 1,
                backgroundColor: cor(valores),
                borderColor: cor(valores), // Usa o tamanho do vetor para gerar as cores
                barPercentage: 1.25,
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
        i % 2 ? cores.push('#6C63FF') : cores.push('#FFE663')
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

// Abre o arquivo e captura os dados
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
            console.log(dados.valoresAgrupados);
        }
        else {
            dados.vetorValores.filter(elemento => {
                dados.valoresAgrupados[elemento] ? dados.valoresAgrupados[elemento] += 1
                    : dados.valoresAgrupados[elemento] = 1
            })
        } 

        // Responsável pelos calculos das frequencias
        let vetorFsPerc = []
        let vetorFreAc = []
        let vetorFreAcPerc = []
        let x, y = 0 
        let z = 0
        let r = -1
        
        for (let v in dados.valoresAgrupados){
            x =((dados.valoresAgrupados[v] / dados.vetorValores.length) * 100).toFixed(2)
            vetorFsPerc.push(x)
            y += dados.valoresAgrupados[v]
            vetorFreAc.push(y)
        }

        for (let t in dados.valoresAgrupados){
            r += 1
            z = ((vetorFreAc[r] / dados.vetorValores.length) * 100).toFixed(2)
            vetorFreAcPerc.push(z)
        }

        let vet =[]
        let i = -1
        for (let data in dados.valoresAgrupados){
            obj = {}
            i += 1 
            obj[data] = dados.valoresAgrupados[data]
            obj['freqSimpPerc']= vetorFsPerc[i]
            obj['freqAc']= vetorFreAc[i]
            obj['freqAcPerc'] = vetorFreAcPerc[i]
            vet.push(obj)
        }
        dados.vetorObjetos = vet 
        
        const sectionTabela = document.querySelector('.sectionTabela')

        const criaTabela = (dadosTratados,perc, ac, acP) => {

            const novaTabela = document.createElement('table')
            const variavel = document.createElement('th')
            const freqSimples = document.createElement('th')
            const freqPerc = document.createElement('th')
            const freqAc = document.createElement('th')
            const freqAcPerc = document.createElement('th')

            variavel.innerText = dados.nome
            freqSimples.innerText = 'Freq Si'
            freqPerc.innerText = 'Freq Si Perc'
            freqAc.innerText = 'Freq Ac'
            freqAcPerc.innerText = 'Freq Ac Perc'

            novaTabela.appendChild(variavel)
            novaTabela.appendChild(freqSimples)
            novaTabela.appendChild(freqPerc)
            novaTabela.appendChild(freqAc)
            novaTabela.appendChild(freqAcPerc)

            let i = -1

            for(const chave in dadosTratados){
                i +=1
                const linha = document.createElement('tr')
                const nomeVariavel = document.createElement('td')
                const valorVariavel = document.createElement('td')
                const valorperc = document.createElement('td')
                const valorac = document.createElement('td')
                const valorAcP = document.createElement('td')

                nomeVariavel.innerText = chave
                valorVariavel.innerText = dadosTratados[chave]
                valorperc.innerText = `${perc[i]}%`
                valorac.innerText = ac [i]
                valorAcP.innerText = `${acP[i]}%`

                if(dados.tipoVar == 'ordinal') {
                    linha.draggable = true
                    linha.classList.add('arrastavel')
                }

                linha.appendChild(nomeVariavel)
                linha.appendChild(valorVariavel)
                linha.appendChild(valorperc)
                linha.appendChild(valorac)
                linha.appendChild(valorAcP)

                novaTabela.appendChild(linha)
            }
            
            if(sectionTabela.classList.contains('esconder')){
                sectionTabela.classList.remove('esconder')
            }
            
            if(sectionTabela.childElementCount == 1){
                const tabelaARemover = sectionTabela.firstElementChild

                sectionTabela.removeChild(tabelaARemover)
                sectionTabela.appendChild(novaTabela)
            } 
            else sectionTabela.appendChild(novaTabela)
            
        }

        criaTabela(dados.valoresAgrupados, vetorFsPerc, vetorFreAc, vetorFreAcPerc)
        
        function criaCaixasDeMedias (medias = [null, null, null]) {
            const textoMedias = ['Média', 'Moda', 'Mediana']
            const areaCaixas = document.createElement('div')

            areaCaixas.classList.add('areaCaixas')
            for(let i = 0; i < textoMedias.length; i++) {
                const divCaixa = document.createElement('div')
                const texto = document.createElement('p')

                divCaixa.classList.add('caixaMedias')
                texto.innerText = `${textoMedias[i]}: ${medias[i]}`

                divCaixa.appendChild(texto)
                areaCaixas.appendChild(divCaixa)
            }
            sectionTabela.appendChild(areaCaixas)
        }
        criaCaixasDeMedias()
        
        let vetorNomeCol = []
        for(let nomeCol in dados.valoresAgrupados) {
            vetorNomeCol.push(`${nomeCol} em %`)
        }

        switch (dados.tipoVar){
            case 'nominal':
                geraGrafico(grafico, 'pie', vetorNomeCol, vetorFsPerc, 'Qualitativa Nominal')
                break
            case 'ordinal':
                geraGrafico(grafico, 'pie', vetorNomeCol, vetorFsPerc, 'Qualitativa Ordinal')
                break
            case 'discreta': 
                geraGrafico(grafico, 'bar', vetorNomeCol, vetorFsPerc, 'Quantitativa Discreta')
                break
            case 'continua': 
                geraGraficoContinua(grafico, 'bar', vetorNomeCol, vetorFsPerc, 'Quantitativa Contínua')
                break
            }

        if(dados.tipoVar == 'ordinal') {
            editarTabela()
        }
        
        //zerar variaveis
        vetorValoresArquivo = []
        dados.nome = ''
        dados.vetorValores = []
        dados.tipoVar = ''
        dados.tipoCalc = ''
        dados.valoresAgrupados = {}

        formDescritiva.reset()

        if(sectionGrafico.classList.contains('esconder')) {
            sectionGrafico.classList.remove('esconder')
        }
    }
    else alert('Verifique todos os CAMPOS')
})


/* Funções responsáveis por fazer drag n drop da tabela
e atualizar os valores dela */
function editarTabela() {
    const tabela = document.querySelector('table')
    const linhasTabela = document.querySelectorAll('tr')

    linhasTabela.forEach(elemento => {
        elemento.addEventListener('dragstart', () => {
            elemento.classList.add('arrastando')
        })
        elemento.addEventListener('dragend', () => {
            elemento.classList.remove('arrastando')
            })
    })

    tabela.addEventListener('dragover', elemento => {
        elemento.preventDefault()
        const elementoPosterior = arrastarProximoElemento(tabela, elemento.clientY)
        const arrastado = document.querySelector('.arrastando')
        if (elementoPosterior == null) {
            tabela.appendChild(arrastado)
        } else {
            tabela.insertBefore(arrastado, elementoPosterior)
        }
    })

    function arrastarProximoElemento(tabela, y) {
        const elementosArrastaveis = [...tabela.querySelectorAll('.arrastavel:not(.arrastando)')]
      
        return elementosArrastaveis.reduce((maisProximo, filho) => {
          const box = filho.getBoundingClientRect()
          const deslocamento = y - box.top - box.height / 2
          if (deslocamento < 0 && deslocamento > maisProximo.deslocamento) {
            return { deslocamento: deslocamento, element: filho }
          } else {
            return maisProximo
          }
        }, { deslocamento: Number.NEGATIVE_INFINITY }).element
    }
    atualizarTabela(tabela, linhasTabela)
}
function atualizarTabela(tabela) {
    tabela.addEventListener('dragend', () => {
        const linhasTabela = document.querySelectorAll('tr')
        let vetorFreqSimples = [] 
        let vetorFreqAcum = []
        linhasTabela.forEach(element => {
            vetorFreqSimples.push(Number(element.children[1].innerText))
        })
        let aux = 0
        for(let i = 0; i < vetorFreqSimples.length; i++){
            aux += vetorFreqSimples[i]
            vetorFreqAcum.push(aux)
        }

        const qtdElementos = vetorFreqSimples.reduce((acumulador, valorAtual) => acumulador + valorAtual)

        linhasTabela.forEach(element => {
            let valorAtual = vetorFreqAcum.shift()
            element.children[3].innerText = valorAtual
            element.children[4].innerText = `${((valorAtual / qtdElementos) * 100).toFixed(2)}%`
        })
    })

}