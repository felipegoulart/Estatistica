const formManual = document.querySelector('.formManual')
const formArquivo = document.querySelector('.formArquivo')
const textoErroNome = document.querySelector('[data-js=inputNome]')
const textoErroValor = document.querySelector('[data-js=inputValor]')
const formDescritiva = document.querySelector('#formDescritiva')
const grafico = document.querySelector('#grafico');

const inputNome = document.querySelector('#nomeVariavel')
const inputValores = document.querySelector('#valores')
const inputArquivo = document.querySelector('#inputArquivo')

const btnCalcular = document.querySelector('#calcular')
const btnLimpar = document.querySelector('.btnLimpar')

let formAtivado = false
let validacao = false
let tipoForm = null

let idTabela = 0

const dados = {
    nome: '',
    vetorValores: [],
    tipoVar: '',
    tipoCalc: '',
    valoresAgrupados: {},
    vetorObjetos: null
}

let vetorValoresArquivo = []

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

        const criaTabela = (dadosTratados,perc, ac, acP) => {

            const tabela = document.createElement('table')
            const variavel = document.createElement('th')
            const freqSimples = document.createElement('th')
            const freqPerc = document.createElement('th')
            const freqAc = document.createElement('th')
            const freqAcPerc = document.createElement('th')

            tabela.id = idTabela

            idTabela++

            variavel.innerText = dados.nome
            freqSimples.innerText = 'Frequência Simples'
            freqPerc.innerText = 'Frequência Simples Percentual'
            freqAc.innerText = 'Frequência Acumulada'
            freqAcPerc.innerText = 'Frequência Acumulada Percentual'

            tabela.appendChild(variavel)
            tabela.appendChild(freqSimples)
            tabela.appendChild(freqPerc)
            tabela.appendChild(freqAc)
            tabela.appendChild(freqAcPerc)

            let i = -1

            for(const chave in dadosTratados){
                i+=1
                const linha = document.createElement('tr')
                const nomeVariavel = document.createElement('td')
                const valorVariavel = document.createElement('td')
                const valorperc = document.createElement('td')
                const valorac = document.createElement('td')
                const valorAcP = document.createElement('td')

                nomeVariavel.innerText = chave
                valorVariavel.innerText = dadosTratados[chave]
                valorperc.innerText = perc[i] +' %'
                valorac.innerText = ac [i]
                valorAcP.innerText = acP[i] + ' %'
                

                linha.appendChild(nomeVariavel)
                linha.appendChild(valorVariavel)
                linha.appendChild(valorperc)
                linha.appendChild(valorac)
                linha.appendChild(valorAcP)

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
        let vetorFsPrec = []
        let vetorFreAc = []
        let vetorFreAcPerc = []
        let x, y = 0 
        let z = 0
        let r = -1
        for (v in dados.valoresAgrupados){
            x =((dados.valoresAgrupados[v] / dados.vetorValores.length) * 100).toFixed(2)
            vetorFsPrec.push(x)
            y += dados.valoresAgrupados[v]
            vetorFreAc.push(y)
        }
        for (t in dados.valoresAgrupados){
            r += 1
            z = ((vetorFreAc[r] / dados.vetorValores.length) * 100).toFixed(2)
            vetorFreAcPerc.push(z)
        }

        let vet =[]
        let i = -1
        for (data in dados.valoresAgrupados){
            obj = {}
            i += 1 
            obj[data] = dados.valoresAgrupados[data]
            obj['freqSimpPerc']= vetorFsPrec[i]
            obj['freqAc']= vetorFreAc[i]
            obj['freqAcPerc'] = vetorFreAcPerc[i]
            vet.push(obj)
        }
        dados.vetorObjetos = vet 
        
        criaTabela(dados.valoresAgrupados, vetorFsPrec, vetorFreAc, vetorFreAcPerc)
        //zerar variaveis
        vetorValoresArquivo = []
        dados.nome = ''
        dados.vetorValores = []
        dados.tipoVar = ''
        dados.tipoCalc = ''
        dados.valoresAgrupados = {}

        formDescritiva.reset()
    }
    else alert('Verifique todos os CAMPOS')
})

var myChart = new Chart(grafico, {
    type: 'bar',
    data: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
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
});

