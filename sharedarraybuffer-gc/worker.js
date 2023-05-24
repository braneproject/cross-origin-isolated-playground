console.log('Hello from Worker!', location.origin);

self.addEventListener('message', e => {
  main(e.data.sab);
});

function main(sab) {
  console.log('Initilized with ', { sab });
}
