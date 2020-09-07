const formManual = document.querySelector('.formManual')
const formArquivo = document.querySelector('.formArquivo')
const textoErroNome = document.querySelector('[data-js=inputNome]')
const textoErroValor = document.querySelector('[data-js=inputValor]')
const sectionTabela = document.querySelector('.sectionTabela')

const inputNome = document.querySelector('#nomeVariavel')
const inputValores = document.querySelector('#valores')
const inputArquivo = document.querySelector('#inputArquivo')

const btnCalcular = document.querySelector('#calcular')

let formAtivado = false
let tipoForm

const dados = {
    nome: '',
    vetorValores: '',
    tipoVar: '',
    tipoCalc: '',
    valoresAgrupados: {},
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
    let dadosTratados = {
        'Ensino Médio': 3,
        'Ensino Superior': 3,
        'Ensino Fundamental': 4
    }
    switch (tipoForm) {
        case 'manual':
            if(!inputNome.value.trim()) {
                inputNome.classList.add('erro')
                inputNome.focus()
                textoErroNome.classList.add('erro')
                textoErroNome.innerText = 'Preencha o NOME'
            } else if (!inputValores.value.trim()) {
                inputValores.classList.add('erro')
                inputValores.focus()
                textoErroValor.classList.add('erro')
                textoErroValor.innerText = 'Preencha os VALORES'
            } else {
                dados.nome = inputNome.value.trim()
                dados.vetorValores = inputValores.value.trim().split(',')
                dados.tipoVar = document.querySelector
                    ('input[name="tipoVariavel"]:checked').value
                dados.tipoCalc = document.querySelector('#tipoCalculo').value
            }
            break

        case 'arquivo':
            
            const capturaDadosArquivo = async () => {
                const pegaDadosArquivo = await inputArquivo.files[0].text()
                const dadosTemp = pegaDadosArquivo.split('\n').filter(dado => dado != '')
                
                dados.nome = dadosTemp.shift()
                dados.vetorValores = dadosTemp
            }
            capturaDadosArquivo()

            dados.tipoVar = document.querySelector
                    ('input[name="tipoVariavel"]:checked').value
            dados.tipoCalc = document.querySelector('#tipoCalculo').value
            break
        default: 
            alert('Algo de errado não está certo')
    }

    const defineValores = (dados) => {
        if (dados.tipoVar == 'continua'){        
            const calculaIntervalo = valores => {
                valores.sort()
                const menor = valores[0], maior = valores[valores.length -1]
                let amplitude = maior - menor
            
                const j = Math.trunc(valores.length ** 0.5)
                const i = j -1
                const k = j +1
            
                do {
                    amplitude++
                    if(amplitude % i == 0) {
                        return [i, amplitude / i]
                    }
                    else if(amplitude % i == 0) {
                        return [j, amplitude / j]
                    }
                    else if(amplitude % i == 0) {
                        return [k, amplitude / k]
                    }
                } while (amplitude < maior)
            }
    
            const [linhas, intervalo] = calculaIntervalo(dados.vetorValores)
    
            const separaIntervalo = (linha, intervalo, dados) => {
                let inicio = null
                let fim = null
                dados.vetorValores.sort()
            
                for(let i = 0; i < linha; i++ ) {
                    !inicio ? inicio = dados.vetorValores[0] : inicio = fim
                    fim = inicio + intervalo
            
                    const nomeAtributo = `${inicio} |--- ${fim}`
            
                    dados.vetorValores.filter(elemento => {
                        if(elemento >= inicio && elemento < fim) {
                            !dados.valoresAgrupados[nomeAtributo] ? dados.valoresAgrupados[nomeAtributo] = 1
                                : dados.valoresAgrupados[nomeAtributo] += 1
                            console.log(elemento);
                        }
                    })
                }
            }
            
            separaIntervalo(linhas, intervalo, dados)
        }
        else{
            dados.vetorValores.filter(elemento => {
                dados.valoresAgrupados[elemento] ? dados.valoresAgrupados[elemento] += 1
                    : dados.valoresAgrupados[elemento] = 1
            })
        } 
    }

    const criaTabela = (dadosTratados) => {

        defineValores(dados)

        const tabela = document.createElement('tabel')
        const variavel = document.createElement('th')
        const freqSimples = document.createElement('th')

        variavel.innerText = 'Nome Variável'
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

        sectionTabela.appendChild(tabela)
        sectionTabela.classList.contains('esconder') ?
            sectionTabela.classList.remove('esconder') : null
    }

    criaTabela(dados.valoresAgrupados)
})
