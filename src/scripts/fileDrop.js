export default function dragNDrop(zone, arquivo, attThumb, leArquivo) {
    zone.addEventListener('dragover', e => {
        e.preventDefault()
        zone.classList.add('dragging')
    })

    zone.addEventListener('dragleave', e => {
        zone.classList.remove('dragging')
    })

    zone.addEventListener('drop', e => {
        e.preventDefault()

        let arquivoValido = false

        const nomeArquivo = e.dataTransfer.files[0].name
        const extensao = nomeArquivo
            .substring(nomeArquivo
                .lastIndexOf("."))
                .toLowerCase()
        
        extensao == '.csv' ? arquivoValido = true : arquivoValido = false

        if(arquivoValido) {
            arquivo = e.dataTransfer.files[0]
            attThumb(nomeArquivo)
            leArquivo(arquivo)
        }
        else {
            alert('Insira um arquivo .CSV')
        }
    })
}