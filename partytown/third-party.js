(function (window, document) {
  console.log("여기 어디 나는 누구", window);

  const el = document.createElement('div');
  el.innerText = 'Hello Worker';

  document.body.appendChild(el);
}(window, window.document));
