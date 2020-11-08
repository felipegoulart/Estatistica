import tabela from "./tabela.js"

const calcularNormal = document.querySelector('#calcularNormal')
const resultNormal = document.querySelector('.resultNormal')

calcularNormal.addEventListener('click', () => {
  let media = document.querySelector('#media').value
  let desv = document.querySelector('#desv').value
  let intervalo = document.querySelector('#intervalo').value
  const opt_intervalo = document.querySelector('#selectIntervalo').value

  let i, y, z, coluna, linha, p, probabilidade_int
  let prob = []

  media = media.replace(',', '.')
  desv = desv.replace(',', '.')
  intervalo = intervalo.replace(',', '.')
  
  let vetIntervalo = intervalo.split(';').map(num => Number(num))
    
  if (opt_intervalo == 'maior' || opt_intervalo == 'menor'){   
      
    z = (vetIntervalo[0]-media) / desv
    if (z < 0) z *= -1 // se o número for negativo, ele passa para positivo

    i = z.toFixed(2)
    y = [...i]

    linha = parseFloat(y[0] + y[2])
    coluna = parseInt(i[3])

    if(linha <= 39) p = tabela[linha][coluna]
        
    else p = 0.5000
        
    if (opt_intervalo == 'maior') { // maior
      if (vetIntervalo[0] > media) probabilidade_int = ((0.5 - p) * 100).toFixed(2)
          
      else probabilidade_int = ((0.5 + p) * 100).toFixed(2)
            
    } else { // menor
      if (vetIntervalo[0] <= media)  probabilidade_int = ((0.5 - p) * 100).toFixed(2)
        
      else  probabilidade_int = ((0.5 + p) * 100).toFixed(2)
    }

  } else {
    for (let int of vetIntervalo) {
      if (int != media) {
        
        z = (int-media)/desv
       
        if (z < 0)  z = z * -1
               
        i = z.toFixed(2)
        y = [...i]
    
        linha = parseFloat(y[0] + y[2])
        coluna = parseInt(i[3])

        if(linha <= 39) p = tabela[linha][coluna]
            
        else p = 0.5000
            
        prob.push(p)   
      }
    }
    
    if (vetIntervalo[0] < media && vetIntervalo[1] > media) 
      probabilidade_int = ((prob.reduce((a,b) => a + b))*100).toFixed(2)

    else if (vetIntervalo[0] < vetIntervalo[1] && vetIntervalo[0] < media) 
      probabilidade_int = ((prob.reduce((a,b) => a - b))*100).toFixed(2)
    
    else probabilidade_int = ((prob.reduce((a,b) => b - a))*100).toFixed(2)
    
  }

  resultNormal.innerHTML = `
    <div>
      <span>Probabilidade:</span>
      <strong>${probabilidade_int}%</strong>
    </div>
    `
})