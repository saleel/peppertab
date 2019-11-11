function isElementVisible(el) {
  const partial = true;
  const viewTop = window.document.documentElement.scrollTop;
  const viewBottom = viewTop + window.document.documentElement.offsetHeight;
  const top = el.offsetTop;
  const bottom = top + el.offsetHeight;
  const compareTop = partial === true ? bottom : top;
  const compareBottom = partial === true ? top : bottom;

  return ((compareBottom <= viewBottom) && (compareTop >= viewTop));
}


function enableSlideInForCards() {
  const cardElements = document.getElementsByClassName('card');

  // // Set defaults
  // for (let i = 0; i < cardElements.length; i += 1) {
  //   if (!isElementVisible(cardElements[i])) {
  //     cardElements[i].classList.add('not-visible');
  //   }
  // }

  // window.addEventListener('scroll', () => {
  //   for (let i = 0; i < cardElements.length; i += 1) {
  //     if (isElementVisible(cardElements[i])) {
  //       cardElements[i].classList.remove('not-visible');
  //     } else {
  //       cardElements[i].classList.add('not-visible');
  //     }
  //   }
  // });
}


export { enableSlideInForCards };
