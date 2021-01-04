import tabela from "../lib/tabela.js"
import search from '../lib/search.js'

const calcularNormal = document.querySelector('#calcularNormal')
const resultNormal = document.querySelector('.resultNormal')

const fncComparacao = (tabela, linha) => {
  if (tabela.linha == linha) return 0
  else if (tabela.linha > linha) return -1
  else return 1
}
// Captura dos dados fornecidos pelo usuário
calcularNormal.addEventListener('click', () => {
  const media = document.querySelector('#media')
  const desv = document.querySelector('#desv')
  const intervalo = document.querySelector('#intervalo')
  const opt_intervalo = document.querySelector('#selectIntervaloNormal')

  if (isNaN(media.value) == true || media.value == ''){
    alert('Dados invalidos')
    media.focus()
    return
  }
  if (isNaN(desv.value) == true || desv.value == ''){
    alert('Dados invalidos')
    desv.focus()
    return
  }
  if (intervalo.value == ''){
    alert('Dados invalidos')
    intervalo.focus()
    return
  }
  if(opt_intervalo == null){
    alert('Dados invalidos')
    opt_intervalo.focus()
    return
  }
  let i, y, z, coluna, linha, p, probabilidade_int
  let prob = []
// Tratamento dos dados 
  const valorMedia = media.value.replace(',', '.')
  const valorDesv = desv.value.replace(',', '.')
  const valorIntervalo = intervalo.value.replace(',', '.')
  debugger
  let vetIntervalo = valorIntervalo.split(';').map(num => Number(num))
// Teste condicional para determiner como serão feitos os calculos     
  if (opt_intervalo.value == 'maior' || opt_intervalo.value == 'menor') {   
    // Calculo para a busca da linha e coluna na tabela da Distribuição Normal  
    z = (vetIntervalo[0]-valorMedia) / valorDesv
    if (z < 0) z *= -1 // se o número for negativo, ele passa para positivo

    i = z.toFixed(2)
    y = [...i]

    linha = y[0] + y[2]
    coluna = Number(i[3])
    if(linha <= 39)  {
      const vetArea = search(fncComparacao, tabela, linha)
      p = vetArea.coluna[coluna]
    }  
    else p = 0.5000
    
    // Teste condicional para determinar o calculo da probabilidade 
    if (opt_intervalo.value == 'maior') { // maior
      if (vetIntervalo[0] > valorMedia.value) probabilidade_int = ((0.5 - p) * 100).toFixed(2)
          
      else probabilidade_int = ((0.5 + p) * 100).toFixed(2)
            
    } else { // menor
      if (vetIntervalo[0] <= valorMedia.value)  probabilidade_int = ((0.5 - p) * 100).toFixed(2)
        
      else  probabilidade_int = ((0.5 + p) * 100).toFixed(2)
    }

  } else {

    for (let int of vetIntervalo) {
      // Calculo para a busca da linha e coluna na tabela da Distribuição normal
      if (int != valorMedia) {
        
        z = (int-valorMedia)/valorDesv
       
        if (z < 0)  z = z * -1
               
        i = z.toFixed(2)
        y = [...i]
    
        linha = parseFloat(y[0] + y[2])
        coluna = parseInt(i[3])

        if(linha <= 39)  {
          const vetArea = search(fncComparacao, tabela, linha)
          p = vetArea.coluna[coluna]
        }  
        else p = 0.5000
            
        prob.push(p)   
      }
    }

    //Teste condicional para determinar o calculo da probabilidade
    if (vetIntervalo[0] < valorMedia.value && vetIntervalo[1] > valorMedia.value) 
      probabilidade_int = ((prob.reduce((a,b) => a + b))*100).toFixed(2)

    else if (vetIntervalo[0] < vetIntervalo[1] && vetIntervalo[0] < valorMedia.value) 
      probabilidade_int = ((prob.reduce((a,b) => a - b))*100).toFixed(2)
    
    else probabilidade_int = ((prob.reduce((a,b) => b - a))*100).toFixed(2)
    
  }
//Impressão dos resultados
  resultNormal.innerHTML = `
    <div>
      <span>Probabilidade:</span>
      <strong>${probabilidade_int}%</strong>
    </div>
    `
})