const sectionResultados = document.querySelector('.resultados')
const calcularBinomial = document.querySelector('#calcularBinomial')

let probabilidade = 0,
  media = 0,
  dp = 0,
  analise,
  fat_n,
  fat_k,
  fat_nk,
  aux
// Captura dos dados fornecidos pelo usuário
calcularBinomial.addEventListener('click', () => {
  const amostra = document.querySelector('#amostra').value
  const sucesso = document.querySelector('#sucesso').value
  const fracasso = document.querySelector('#fracasso').value
  const evento = document.querySelector('#evento').value
// Função para o calculo fatorial
  function fatorial(valor) {
    // para valores negativos
    if (valor < 0) return 'Valor deve ser maior ou igual a zero';

    // para valor = 0  ou igual a 1
    else if (valor == 0 || valor == 1) return 1;
    
    else {
      let acumula = 1;

      for (let i = valor ; i > 1 ;i--) acumula *= i;
      
      return acumula;
    } 
  }
// Tratamento dos dados inseridos dos eventos a serem calculados
  let evento_tratado = []
  let au = evento.split(';')

  for (let i = 0; i < au.length; i++)   evento_tratado.push(parseInt(au[i]))
// Calculos das probabilidades com base na quantidade eventos listados 
  if (evento_tratado.length == 1){
    aux = amostra - evento
    fat_k = fatorial(evento)
    fat_n = fatorial(amostra)
    fat_nk = fatorial(aux)
    
    if (parseInt(evento) == 0 )  analise = 1
    
    else if (parseInt(evento) == 1)  analise = amostra
    
    else  analise = (fat_n/(fat_nk * fat_k))
     
    probabilidade = ((analise*((sucesso/100)**evento)*((fracasso/100)**aux))*100).toFixed(2)

  } else {
    for (let x = 0; x< evento_tratado.length; x++){
      aux = amostra - evento_tratado[x]
      fat_k = fatorial(evento_tratado[x])
      fat_n = fatorial(amostra)
      fat_nk = fatorial(aux)
    
      if (parseInt(evento_tratado[x]) == 0 ) analise = 1
        
      else if (parseInt(evento_tratado[x]) == 1) analise = amostra
        
      else analise = (fat_n/(fat_nk * fat_k))

      probabilidade += ((analise*((sucesso/100)**evento_tratado[x])*((fracasso/100)**aux))*100).toFixed(2)

    }
  }
// Calculos da média e do desvio padrão  
  media = amostra*(sucesso/100)
  dp = (((amostra*(sucesso/100)*(fracasso/100))**(1/2))).toFixed(2)
// mostrando os resultado na tela
  const resultados = `
  <div>
    <span>Probabilidade:</span>
    <strong>${probabilidade}</strong>
  </div>

  <div>
    <span>Média:</span>
    <strong>${media}</strong>
  </div>

  <div>
    <span>Desvio padrão:</span>
    <strong>${dp}</strong>
  </div>
  `

  sectionResultados.innerHTML = resultados   
  
  let x = [3,2,-1,4]
  let y = [7,5,-1,9]
  let auxliar_x = []
  let auxiliar_y = []
  let auxiliar_xy = []
  let soma_x, soma_y, soma_x2, soma_y2, soma_xy, n, r, correlacao, a, b

  soma_x = x.reduce((a,b) => a + b)
  soma_y = y.reduce((a,b) => a + b)

  for(let c = 0; c < x.length; c++){
    auxliar_x.push(x[c]**2)
    auxiliar_y.push(y[c]**2)
    auxiliar_xy.push(x[c] * y[c])
  }
  soma_x2 = auxliar_x.reduce((a,b) => a + b)
  soma_y2 = auxiliar_y.reduce((a,b) => a + b)
  soma_xy = auxiliar_xy.reduce((a,b) => a + b)
  n = x.length
  
  r = ((n * soma_xy) - (soma_x * soma_y)) / ((((n * soma_x2) - (soma_x**2))**(1/2)) * (((n * soma_y2) - (soma_y**2))**(1/2)))
  
  if (r == 1){
    correlacao = 'Perfeita positiva'
  }else if (r == -1){
    correlacao = 'Perfeita negativa'
  }else if (r == 0){
    correlacao = 'Variéveis não correlacionadas'
  }else if (r > 0 && r < 0.30){
    correlacao= 'Fraca positiva'
  }else if (r < 0 && r > -0.30){
    correlacao = 'Fraca negativa'
  }else if (r > 0.3 && r < 0.7){
    correlacao = 'Moderada positiva'
  }else if (r < -0.3 && r > - 0.7){
    correlacao = "Moderada negativa"
  }else if (r > 0.7 && r < 1){
    correlacao = 'Forte positiva'
  }else{
    correlacao = 'Forte negativa'
  }

  a = (((n*soma_xy) - (soma_x*soma_y))/((n*soma_x2) - soma_x**2)) 
  console.log(r)
  console.log(correlacao)
})


