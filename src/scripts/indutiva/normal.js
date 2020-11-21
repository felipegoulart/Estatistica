import tabela from "./tabela.js"
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
  console.log(au)
  if (isNaN(media.value) == true || media.value == ''){
    alert('Dados invalidos')
    media.focus()
    return
  }
  if (isNaN(desv.value) == true || desv.value == ''){
    alert('Dados invalidos')
    desv.focus()
    return
  }if (isNaN(intervalo.value) == true || intervalo.value == ''){
    alert('Dados invalidos')
    intervalo.focus()
    return
  }if(opt_intervalo == null){
    alert('Dados invalidos')
    opt_intervalo.focus()
    return
  }
  let i, y, z, coluna, linha, p, probabilidade_int
  let prob = []
// Tratamento dos dados 
  media = media.value.replace(',', '.')
  desv = desv.value.replace(',', '.')
  intervalo = intervalo.value.replace(',', '.')
  
  let vetIntervalo = intervalo.value.split(';').map(num => Number(num))
// Teste condicional para determiner como serão feitos os calculos     
  if (opt_intervalo.value == 'maior' || opt_intervalo.value == 'menor') {   
    // Calculo para a busca da linha e coluna na tabela da Distribuição Normal  
    z = (vetIntervalo[0]-media.value) / desv.value
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
      if (vetIntervalo[0] > media.value) probabilidade_int = ((0.5 - p) * 100).toFixed(2)
          
      else probabilidade_int = ((0.5 + p) * 100).toFixed(2)
            
    } else { // menor
      if (vetIntervalo[0] <= media.value)  probabilidade_int = ((0.5 - p) * 100).toFixed(2)
        
      else  probabilidade_int = ((0.5 + p) * 100).toFixed(2)
    }

  } else {
    debugger

    for (let int of vetIntervalo) {
      // Calculo para a busca da linha e coluna na tabela da Distribuição normal
      if (int != media.value) {
        
        z = (int-media.value)/desv.value
       
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
    if (vetIntervalo[0] < media.value && vetIntervalo[1] > media.value) 
      probabilidade_int = ((prob.reduce((a,b) => a + b))*100).toFixed(2)

    else if (vetIntervalo[0] < vetIntervalo[1] && vetIntervalo[0] < media.value) 
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