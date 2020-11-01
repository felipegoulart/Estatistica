import tabela from "./tabela.js"

const sectionResultados = document.querySelector('.resultados')
const calcularIndutiva = document.querySelector('#calcularIndutia')
let probabilidade = 0, media = 0, dp = 0, analise, fat_n, fat_k, fat_nk, aux

calcularIndutiva.addEventListener('click', () => {
    const amostra = document.querySelector('#amostra').value
    const sucesso = document.querySelector('#sucesso').value
    const fracasso = document.querySelector('#fracasso').value
    const evento = document.querySelector('#evento').value

    function fatorial(valor) {
        // para valores negativos
        if(valor < 0) {
    
          return 'Valor deve ser maior ou igual a zero';
        
          // para valor = 0  ou igual a 1
        } else if ( (valor == 0) || (valor == 1) ) {
    
          return 1;
         
        } else {
    
          var acumula = 1;
          for(let i = valor ; i > 1 ;i--) {
            acumula *= i;
          }
          return acumula;
        } 
    
    }
    let evento_tratado = []
    let soma = 0
    let y = []  
    var au = evento.split(';')
    for (let i = 0; i < au.length; i++){
        evento_tratado.push(parseInt(au[i]))
    }
    if (evento_tratado.length == 1){
        aux = amostra - evento
        fat_k = fatorial(evento)
        fat_n = fatorial(amostra)
        fat_nk = fatorial(aux)
        
        if (parseInt(evento) == 0 ){
            analise = 1
        }else if (parseInt(evento) == 1){
            analise = amostra
        }else{
            analise = (fat_n/(fat_nk * fat_k))
        }
        
        probabilidade = ((analise*((sucesso/100)**evento)*((fracasso/100)**aux))*100).toFixed(2)

    
        
    } else {
        for(let x = 0; x< evento_tratado.length; x++){
        aux = amostra - evento_tratado[x]
        fat_k = fatorial(evento_tratado[x])
        fat_n = fatorial(amostra)
        fat_nk = fatorial(aux)
        
        if (parseInt(evento_tratado[x]) == 0 ){
            analise = 1
        }else if (parseInt(evento_tratado[x]) == 1){
            analise = amostra
        }else{
            analise = (fat_n/(fat_nk * fat_k))
        }
        soma = ((analise*((sucesso/100)**evento_tratado[x])*((fracasso/100)**aux))*100).toFixed(2)
        y.push(parseFloat(soma)) 
        }
        probabilidade = (y.reduce((a,b) => a + b)).toFixed(2)
    }
    
    media = amostra*(sucesso/100)
    dp = (((amostra*(sucesso/100)*(fracasso/100))**(1/2))).toFixed(2)
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

