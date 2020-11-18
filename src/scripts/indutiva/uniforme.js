let a, b, probbabilidade, limite_inferior, limite_superior, media, desvio
let soma = []
//Captura dos dados 
a = null 
b = null
limite_inferior = null
limite_superior = null
//Criação de um vetor para alocar os limtes para o calculo
let limites = [limite_inferior,limite_superior]
  
//Teste condicional para a definição do calculo da probabilidade 
if (limites[0] > a && limites[1] < b ){
    for(let s = 0; s < limites.length; s++){
        d = ((limites[s] - a) / (b - a)).toFixed(4)
        soma.push(d)
    }
    // calculo da probabilidade
    probabilidade  = ((soma.reduce((a,b) => b - a))*100).toFixed(2)
}else{
    probabilidade = ((limites[1] - limites[0]) / (b - a)*100).toFixed(2)
}
//Calculo da Média
media = ((b + a) / 2).toFixed(2)
//Calculo do Devio Padrão 
desvio = ((((b - a)**2) / 12)**(1/2)).toFixed(2)
  
