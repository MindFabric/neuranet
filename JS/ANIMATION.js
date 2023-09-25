const textureEl = document.querySelector('#interface-texture2');
const imgHeight = textureEl.offsetHeight;
let offset = 0;

setInterval(() => {
  offset = (offset + 2) % imgHeight;
  textureEl.style.backgroundPositionY = `+${offset}px`;
}, 50);




const textureE2 = document.querySelector('#interface-texture');
const imgHeight2 = textureE2.offsetHeight;

setInterval(() => {
  offset = (offset + 0) % imgHeight2;
  textureE2.style.backgroundPositionY = `-${offset}px`;
}, 50);
