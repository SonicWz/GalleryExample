let gallery = new Gallery(document.getElementById('gallery'), {
    isControls: true,
    isNav: true
});

let gallery2 = new Gallery(document.getElementById('gallery2'), {
    margin: 10,
    transitionValue: 3,
    isControls: true,
    isNav: true,
    currentSlide: 2
});


let gallery3 = new Gallery(document.getElementById('gallery3'), {
    margin: 100,
    transitionValue: 1,
    isControls: false,
    isNav: true
});

let gallery4 = new Gallery(document.getElementById('gallery4'), {
    transitionValue: 2,
    currentSlide: 3,
    isControls: true,
    isNav: false
});

