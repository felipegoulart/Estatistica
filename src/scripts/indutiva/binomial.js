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
  const amostra = document.querySelector('#amostra')
  const sucesso = document.querySelector('#sucesso')
  const fracasso = document.querySelector('#fracasso')
  const evento = document.querySelector('#evento')
  // Tratamento dos dados inseridos dos eventos a serem calculados
  let evento_tratado = []
  let au = evento.value.split(';')
  for (let i = 0; i < au.length; i++)   evento_tratado.push(parseInt(au[i]))
  //Validação dos dados
  for (let i = 0; i < evento_tratado.length; i++){
    if (isNaN(au[i]) == true || au[i] == ''){
      alert('Dados invalidos')
      evento.focus()
      return 
    }
  }
  console.log(au)
  if (isNaN(amostra.value) == true || amostra.value == ''){
    alert('Dados invalidos')
    amostra.focus()
    return
  }
  if (isNaN(sucesso.value) == true || sucesso.value == ''){
    alert('Dados invalidos')
    sucesso.focus()
    return
  }if (isNaN(fracasso.value) == true || fracasso.value == ''){
    alert('Dados invalidos')
    fracasso.focus()
    return
  }
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

// Calculos das probabilidades com base na quantidade eventos listados 
  if (evento_tratado.length == 1){
    aux = amostra.value - evento.value
    fat_k = fatorial(evento.value)
    fat_n = fatorial(amostra.value)
    fat_nk = fatorial(aux)
    
    if (parseInt(evento.value) == 0 )  analise = 1
    
    else if (parseInt(evento.value) == 1)  analise = amostra.value
    
    else  analise = (fat_n/(fat_nk * fat_k))
     
    probabilidade = ((analise*((sucesso.value/100)**evento.value)*((fracasso.value/100)**aux))*100).toFixed(2)

  } else {
    let e = []
    for (let x = 0; x< evento_tratado.length; x++){
      aux = amostra.value - evento_tratado[x]
      fat_k = fatorial(evento_tratado[x])
      fat_n = fatorial(amostra.value)
      fat_nk = fatorial(aux)
    
      if (parseInt(evento_tratado[x]) == 0 ) analise = 1
        
      else if (parseInt(evento_tratado[x]) == 1) analise = amostra.value
        
      else analise = (fat_n/(fat_nk * fat_k))

      e.push(parseFloat(((analise*((sucesso.value/100)**evento_tratado[x])*((fracasso.value/100)**aux))*100).toFixed(2)))
  
    }
    probabilidade = e.reduce((a,b) => a + b).toFixed(2)
  }
// Calculos da média e do desvio padrão  
  media = (amostra.value*(sucesso.value/100)).toFixed(2)
  dp = (((amostra.value*(sucesso.value/100)*(fracasso.value/100))**(1/2))).toFixed(2)
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
})


