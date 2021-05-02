function backToTop(elementSelector) {
    const node = document.querySelector(elementSelector)
    node.addEventListener('click', () => {
      window.scrollTo(0,0)
    })
  }
  
  backToTop('#backtothetop')