const formManual = document.querySelector('.formManual')
const formArquivo = document.querySelector('.formArquivo')
const textoErroNome = document.querySelector('[data-js=inputNome]')
const textoErroValor = document.querySelector('[data-js=inputValor]')
const formDescritiva = document.querySelector('#formDescritiva')
const sectionGrafico = document.querySelector('.sectGrafico')
const areaGrafico = document.querySelector('#grafico')
let meuGrafico = null

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

const dados = {
    nome: '',
    vetorValores: [],
    tipoVar: '',
    tipoCalc: '',
    valoresAgrupados: {},
    vetorObjetos: null
}

let vetorValoresArquivo = []

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

inputArquivo.addEventListener('change', () => {
    arquivo = inputArquivo.files[0] || arquivoDrop
    const nomeArq = arquivo.name

    dropzone.classList.add('dragging')

    atualizarThumb(nomeArq)
    capturaDadosArquivo(arquivo)
})

dropzone.addEventListener('dragover', e => {
    e.preventDefault()
    dropzone.classList.add('dragging')
})

dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragging')
})

dropzone.addEventListener('drop', e => {
    e.preventDefault()

    let arquivoValido = false

    const nomeArquivo = e.dataTransfer.files[0].name
    const extensao = nomeArquivo
        .substring(nomeArquivo
            .lastIndexOf("."))
            .toLowerCase()
    
    extensao == '.csv' ? arquivoValido = true : arquivoValido = false

    if(arquivoValido) {
        arquivo = e.dataTransfer.files[0]
        atualizarThumb(nomeArquivo)
        capturaDadosArquivo(arquivo)
    }
    else {
        alert('Insira um arquivo .CSV')
    }
})

const capturaDadosArquivo = arquivo => {
    const reader = new FileReader()
        
    reader.readAsText(arquivo)
    
    reader.onloadend = () => {
        vetorValoresArquivo = reader.result.split('\n')
    }
}
const atualizarThumb = (nomeArquivo) => {
    document.querySelector('.nomeArquivo--thumb').innerText = nomeArquivo

    document.querySelector('.textoDropzone').classList.add('esconder')
    document.querySelector('.thumbnail').classList.remove('esconder')
}

const excluirThumb = () => {
    arquivo = null
    validacao = false
    document.querySelector('.dropzone').classList.remove('dragging')
    document.querySelector('.textoDropzone').classList.remove('esconder')
    document.querySelector('.thumbnail').classList.add('esconder')
}

btnExcluirThumb.addEventListener('click', excluirThumb) 

// ----------Drag N Drop da tabela Ordinal--------- \\
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

btnExcluirPopup.addEventListener('click', () => document.querySelector('.popup')
    .classList.add('esconder'))

// ----------Gráficos--------- \\
// Funções para gerar os Graficos
const geraGrafico = (areaGrafico, tipoGraf = 'bar', nomesCol, valores, nomeGraf = 'Gráfico', opt) => {
    if(meuGrafico) meuGrafico.destroy()

    meuGrafico = areaGrafico.getContext('2d');
    meuGrafico = new Chart(grafico, {
        type: tipoGraf,
        data: {
            labels: nomesCol,
            datasets: [{
                label: nomeGraf,
                data: valores,
                backgroundColor: cor(valores), // Usa o tamanho do vetor para gerar as cores
                borderWidth: 2,
            }]
        },
        options: opt
    })
}

const geraGraficoContinua = (grafico, tipoGraf = 'bar', nomesCol, valores, nomeGraf = 'Gráfico', opt) => {
    if(meuGrafico) meuGrafico.destroy()

    meuGrafico = areaGrafico.getContext('2d');
    meuGrafico = new Chart(grafico, {
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
        options: opt
    })
}

// Funções de tipos de gráfico
function optGraficoPizza () {
    return {tooltips: {
        backgroundColor: '#fff',
        cornerRadius: 10, 

        bodyFontColor: '#222',
        bodyFontSize: 13,
        bodyFontStyle: 'bold',

        xPadding: 12,
        yPadding: 15,

        callbacks: {
            label: editarLabelComPorcent
        }
    }}
}

function optGraficoColuna () {
    return {
        scales: {
            yAxes: [{
                ticks: {
                    min: 0,
                    callback: function(value) {
                        return value + "%"
                    }
                },
                scaleLabel: {
                    display: true,
                    labelString: "Em Porcentagem"
                }
            }]
        },
        tooltips: {
            backgroundColor: '#fff',
            cornerRadius: 10, 

            titleFontColor: '#222',
            bodyFontColor: '#222',
            bodyFontSize: 13,
            bodyFontStyle: 'bold',

            xPadding: 12,
            yPadding: 15,

            callbacks: {
                label: editarLabelComPorcent
            }
        }
    }
}

// Função para gerar as cores para o Gráfico de acordo com o número de elementos
function cor(vetor) { 
    let cores = []

    for(let i = 0; i < vetor.length; i++) {
        i % 2 == 0 ? cores.push('#6C63FF') : cores.push('#FFE663')
    }
    return cores
}

// A função recebe os nomes da Label e valor para retornar uma label com numeros em %
function editarLabelComPorcent(tooltipItem, data) {
    let label = data.labels[tooltipItem.index] || '';
    console.log(data.datasets);
    let valor = data.datasets[0].data[tooltipItem.index]
    if (label) {
        label += ': ';
    }
    label += valor + '%';
    return label;
}

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
            dados.nome = inputNome.value.trim()
            vetorValoresArquivo = inputValores.value.trim().split(';')
            vetorValoresArquivo = vetorValoresArquivo.filter(elemento => elemento != '')
            dados.vetorValores = vetorValoresArquivo.map(elemento => elemento.trim()) 

            validacao = true
        }
    }
    else {
        if(!arquivo) { // Testa se o input tem algum arquivo
            alert('Insira um arquivo!')

            validacao = false
        }
        else {
            dados.nome = vetorValoresArquivo.shift()
            dados.vetorValores = vetorValoresArquivo.filter(elemento => elemento != '')
            
            validacao = true
            
        }
    }

    // Atributos para calculo.
    // Mesma atribuição de valor independendo se é manual ou arquivo.
    dados.tipoVar = document.querySelector
            ('input[name="tipoVariavel"]:checked').value
    dados.tipoCalc = document.querySelector('#tipoCalculo').value

    // Caso Todas as entradas estejam validadas ele executa os calculos.
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
        
                dados.vetorValores.forEach(elemento => {
                    if(elemento >= inicio && elemento < fim) {
                        !dados.valoresAgrupados[nomeAtributo] ? dados.valoresAgrupados[nomeAtributo] = 1
                            : dados.valoresAgrupados[nomeAtributo] += 1
                    }
                })
            }
        }
        else {
            dados.vetorValores.forEach(elemento => {
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
            let obj = {}
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
            
            const filhos = sectionTabela.childNodes
            if(filhos.length > 1){
                while (filhos.length != 0) {
                    sectionTabela.removeChild(filhos[0])
                }
            } 
            sectionTabela.appendChild(novaTabela)
        }

        criaTabela(dados.valoresAgrupados, vetorFsPerc, vetorFreAc, vetorFreAcPerc)

        let e = []
        let numero = Boolean
        for (let i = 0; i < dados.vetorValores.length; i++){
            let aux = dados.vetorValores[i]
            if (isNaN(aux) == true){
                e = dados.vetorValores.sort()
                numero = false
            }
            else{
                e = dados.vetorValores.sort((a,b) => a-b)
                numero = true
            }
        }

        let mediana
        if (numero == true){
            if(e.length % 2 == 0){
                let esq = 0
                let dir = e.length - 1
                let meio = 0 
                meio = Math.trunc((esq+dir)/2)
                mediana = ((e[meio] + e[meio+1])/2).toFixed(1)
            }else{
                let esq = 0
                let dir = e.length - 1
                let meio = 0 
                meio = Math.trunc((esq+dir)/2)
                mediana = e[meio]
            }
        }else {
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
                console.log(meio)
            }
        }
        
        let media
        if (numero == true){
            let soma = 0
            for (let i = 0; i< e.length - 1; i++){
                soma = soma + e[i]
            }
            media = (soma/e.length)
        }else{
            media = 'Não Possui'
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
        let moda = []
        if (auxiliar.length === au.length){
            moda.push('Estes dados são amodais')
        }else{
            moda = auxiliar
        }


        function criaCaixasDeMedias (medias = [media,moda,mediana]) {
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
        vetorValoresArquivo = []
        dados.nome = ''
        dados.vetorValores = []
        dados.tipoVar = ''
        dados.tipoCalc = ''
        dados.valoresAgrupados = {}
        
        formDescritiva.reset()
    }
    excluirThumb()
})


//