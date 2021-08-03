(() => {
  // const console = {};
  // Object.keys(window.console).forEach(name => {
  //   console[name] = function () {};
  // });
  //
  // window.console = console;

  for (const element of Array.from(document.documentElement.children)) {
    if (['head', 'body'].includes(element.tagName)) {
      element.parentNode?.removeChild(element);
    }
  }

  document.head.innerHTML = '';
  document.body.innerHTML = '';
  // console.log('cleared');

  const removeAttributes = (element: HTMLElement) => {
    Object.values(element.attributes).forEach(attribute => {
      element.removeAttribute(attribute.name);
    });
  };

  removeAttributes(document.body);
  removeAttributes(document.documentElement);

  const appRoot = document.createElement('div');
  appRoot.setAttribute('id', 'LIQUID-ROOT');
  document.body.appendChild(appRoot);
  document.body.classList.add('liquid-realtime');

  // const iframe = document.createElement('iframe');
  // iframe.setAttribute('scrolling', 'auto');
  // // iframe.setAttribute('title', 'Shailesh');
  // // iframe.setAttribute('title', 'Shailesh');
  // iframe.setAttribute(
  //   'sandbox',
  //   'allow-scripts allow-forms allow-same-origin allow-presentation allow-orientation-lock allow-modals allow-popups-to-escape-sandbox allow-pointer-lock '
  // );
  // iframe.style.width = '1200px';
  // iframe.style.height = '800px';
  // iframe.src = window.location.href;
  // document.body.appendChild(iframe);
  // setTimeout(() => {
  //   new (window as any).Liquid({token});
  // }, 5000);
  // appRoot.id = 'RESPONSIVE-VIEWER-ROOT'

  // document.body.appendChild(iframe);
})();
