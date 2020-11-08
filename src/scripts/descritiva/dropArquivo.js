export const dropFile = (dropzone, fncArquivo) => {
  dropzone.addEventListener('dragover', e => {
    e.preventDefault()
    dropzone.classList.add('dragging')
  })
  
  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragging')
  })
  
  dropzone.addEventListener('drop', e => {
    e.preventDefault()

    let arquivoValido = false

    const nomeArquivo = e.dataTransfer.files[0].name
    const extensao = nomeArquivo
      .substring(nomeArquivo
        .lastIndexOf("."))
        .toLowerCase()
    
    extensao == '.csv' ? arquivoValido = true : arquivoValido = false

    if(arquivoValido) fncArquivo(e.dataTransfer.files[0])
    
    else alert('Insira um arquivo .CSV')
    
  })
}

