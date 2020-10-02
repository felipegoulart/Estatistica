const sectionTabela = document.querySelector('.sectionTabela')

// ----------Drag N Drop da tabela Ordinal--------- \\
/* Funções responsáveis por fazer drag n drop da tabela
e atualizar os seus valores de frequencia acumulada */
const criarTabela = (obj) => {

    const novaTabela = document.createElement('table')
    const variavel = document.createElement('th')
    const freqSimples = document.createElement('th')
    const freqPerc = document.createElement('th')
    const freqAc = document.createElement('th')
    const freqAcPerc = document.createElement('th')

    variavel.innerText = obj.nome
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

    for(const objeto of obj.vetorObjetos){
        i +=1
        const linha = document.createElement('tr')
        const nomeVariavel = document.createElement('td')
        const valorVariavel = document.createElement('td')
        const valorperc = document.createElement('td')
        const valorac = document.createElement('td')
        const valorAcP = document.createElement('td')
        
        nomeVariavel.innerText = objeto.nome  
        valorVariavel.innerText = objeto.freqSimp
        valorperc.innerText = `${objeto.freqSimpPerc}%`
        valorac.innerText = objeto.freqAc
        valorAcP.innerText = `${objeto.freqAcPerc}%`

        if(obj.tipoVar == 'ordinal') {
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

const criaCaixasDeMedias = (medias = [null,null,null]) => {
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

export default {
    criarTabela: criarTabela,
    editarTabela: editarTabela,
    criaCaixasDeMedias: criaCaixasDeMedias,
}