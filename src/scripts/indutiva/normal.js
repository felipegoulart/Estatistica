
let y, z, coluna, linha, p, probabilidade_int
let prob = []
let int_tratado = []

let intervalo = null
let opt_intervalo = null
let me = null
let desv = null

var au = intervalo.split(';')
    for (let i = 0; i < au.length; i++){
        int_tratado.push(parseInt(au[i]))
    } 
 
if (opt_intervalo == 'acima' || opt_intervalo == 'abaixo'){    
    z = ((int_tratado[0]-me)/desv).toFixed(2)
    if (z < 0){
        z = z * -1
    }
    i = z.toString()
    y = i.split('')
    linha = parseFloat(y[0] + y[1] + y[2])
    coluna = parseInt(i[3])
    for ( var lin in tabela){
        if(tabela[lin][0] == linha){
            p = tabela[lin][coluna + 1]
        }else if (linha > 3.9 ) {
            p = 0.5000
        }
    }
    if (int_tratado[0] > me){
        probabilidade_int = ((0.5 - p) * 100).toFixed(2)
    }else{
        probabilidade_int = ((0.5 + p) * 100).toFixed(2)
    }         
}else{
    for (var int = 0; int < int_tratado.length; int++){
        if (int_tratado[int] != me){
            z = ((int_tratado[int]-me)/desv).toFixed(2)
            if (z < 0){
                z = z * -1
            }
            i = z.toString()
            y = i.split('')
            linha = parseFloat(y[0] + y[1] + y[2])
            coluna = parseInt(i[3])
        
            for (var lin in tabela){
                if(tabela[lin][0] == linha){
                    p = tabela[lin][coluna + 1]
                }else if (linha > 3.9 ) {
                    p = 0.5000
                }
            }
            prob.push(p)   
        }
    }
    if (int_tratado[0] > int_tratado[1] || int_tratado[0] < me){    
        probabilidade_int = ((prob.reduce((a,b) => a + b))*100).toFixed(2)
    }else{
        probabilidade_int = ((prob.reduce((a,b) => b - a))*100).toFixed(2)
    }    
}