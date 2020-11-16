// Declaração de variaveis
let x = [3,2,-1,4] // Entrada de dados 
let y = [7,5,-1,9] // Entrada de dados 
let auxliar_x = []
let auxiliar_y = []
let auxiliar_xy = []
let soma_x, soma_y, soma_x2, soma_y2, soma_xy, n, r, correlacao, a, b, regressao, coef_angular

//Calculo do somatório das colunas x e y
soma_x = x.reduce((a,b) => a + b)
soma_y = y.reduce((a,b) => a + b)

//Calculo das outras colunas necessárias para a resolução
for(let c = 0; c < x.length; c++){
    auxliar_x.push(x[c]**2)
    auxiliar_y.push(y[c]**2)
    auxiliar_xy.push(x[c] * y[c])
}
//Somatório das colunas restantes 
soma_x2 = auxliar_x.reduce((a,b) => a + b)
soma_y2 = auxiliar_y.reduce((a,b) => a + b)
soma_xy = auxiliar_xy.reduce((a,b) => a + b)
//Definição da quantidade de linhas presentes na tabela
n = x.length
  
r = ((n * soma_xy) - (soma_x * soma_y)) / ((((n * soma_x2) - (soma_x**2))**(1/2)) * (((n * soma_y2) - (soma_y**2))**(1/2)))

//Definição da correlação entre as variaveis   
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

//Calculos de regrassão linear simples 
a = (((n*soma_xy) - (soma_x*soma_y))/((n*soma_x2) - soma_x**2))
b = (soma_y - a * soma_x) / n
regressao = (a * coef_angular) + b
