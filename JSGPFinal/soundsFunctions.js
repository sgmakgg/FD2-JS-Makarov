function soundInit(sound) {
    sound.play();
    sound.pause();
}

function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
    sound.loop = true;
    sound.volume = 0.2;
}

export {soundInit, playSound};