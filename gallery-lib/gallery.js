const galleryClassName = 'gallery';
const lineClassName = 'galleryLine';
const lineWrapperClassName = 'galleryLineWrapper';
const slideClassName = 'gallerySlide';
const controlsBoxClassName = 'controlsBox';
const navWrapperBoxClassName = 'navWrapper';
const navNextClassName = 'nextBtn';
const navPrevClassName = 'prevBtn';
const controlsListClassName = 'controlsList';
const controlClassName = 'control';
const activeControlClassName = 'activeControl';
const transitionClassName = 'slowTransition';
const movePointerClassName = 'movePointer';
const modalWindowClassName = 'modalWindow';
const modalWindowCloseBtnClassName = 'modalWindowCloseBtn';
const navNextModalClassName = 'nextBtnModal';
const navPrevModalClassName = 'prevBtnModal';
const fullsizeImgWrapperClassName = 'fullsizeImgWrapper';
const fullsizeImgClassName = 'fullsizeImg';

class Gallery{
    constructor(gallery, options){
        this.gallery = gallery;
        this.gallerySize = 0;
        this.startPositionX = 0;
        this.currentSlide = options.currentSlide || 0;
        this.isSlideChanged = false;
        this.isSelected = false;
        this.isModal = false;
        this.options = options;
        this.options.margin =  options.margin || 0;
        this.options.isControls = options.isControls;
        this.options.isNav = options.isNav;
        this.options.transitionValue = options.transitionValue || 1;
        this.init = this.init.bind(this);
        this.resize = this.resize.bind(this);
        this.calculate = this.calculate.bind(this);
        this.startDrag = this.startDrag.bind(this);
        this.stopDrag = this.stopDrag.bind(this);
        this.dragging = this.dragging.bind(this);
        this.setTransformSwipe = this.setTransformSwipe.bind(this);
        this.SetCurrentSlideTransform = this.SetCurrentSlideTransform.bind(this);
        this.nextSlide = this.nextSlide.bind(this);
        this.prevSlide = this.prevSlide.bind(this);
        this.changeSlide = this.changeSlide.bind(this);
        this.addControls = this.addControls.bind(this);
        this.showFullSize = this.showFullSize.bind(this);
        this.onGalleryClick = this.onGalleryClick.bind(this);
        this.addModalWindow = this.addModalWindow.bind(this);
        this.initModal = this.initModal.bind(this);
        this.removeModalWindow = this.removeModalWindow.bind(this);
        this.changeOnKeyDownInStandart = this.changeOnKeyDownInStandart.bind(this);
        this.changeOnKeyDownInModal = this.changeOnKeyDownInModal.bind(this);

        this.init(); 
        this.resize(); 
    }
    init(){
        this.buildHTML();
        if (this.options.isControls){
            this.addControls();
        }
        if (this.options.isNav){
            this.addNav();
        }
        this.calculate();  //first calculate of gallery
        this.changeSlide(this.currentSlide); //need to activate controls
        this.setEventListeners();
    }
    buildHTML(){
        this.galleryLineWrapper = document.createElement('div');
            this.galleryLineWrapper.classList.add(lineWrapperClassName);
            this.galleryLine = document.createElement('div');
            this.galleryLine.classList.add(lineClassName);
            this.galleryLineWrapper.append(this.galleryLine);
    
            this.gallery.classList.add(galleryClassName);
            this.galleryLine.style.transition = `all ${this.options.transitionValue}s ease`;
            this.galleryslides = Array.from(this.gallery.children).map((elem)=>{
                let div = document.createElement('div');
                div.classList.add(slideClassName);
                div.append(elem);
                this.galleryLine.append(div);
                return div;
            });
            this.gallery.append(this.galleryLineWrapper);

            this.galleryCoords = this.galleryLineWrapper.getBoundingClientRect();
            this.galleryslides.forEach((elem)=>{
            elem.style.width = `${this.galleryCoords.width}px`;
            elem.style.marginRight = `${this.options.margin}px`;
            this.gallerySize++;
        });
    }
    addControls(){
            this.controlsBox = document.createElement('div');
            this.controlsBox.classList.add(controlsBoxClassName);
            this.gallery.append(this.controlsBox);

            this.controlsList = document.createElement('ul');
            this.controlsList.classList.add(controlsListClassName);
            this.controlsBox.append(this.controlsList);
            for (let i=0; i<this.gallerySize; i++){
                let control = document.createElement('li');
                control.classList.add(controlClassName);
                control.classList.add(transitionClassName);
                control.setAttribute('data-slidenumber', i);
                this.controlsList.append(control);
            }
            this.controlsBox.addEventListener('pointerup', (event) => {
                this.changeSlide(event.target.dataset.slidenumber);
            })
    }
    addNav(){
        this.navWrapper = document.createElement('div');
        this.navWrapper.classList.add(navWrapperBoxClassName);
        
        this.navPrev = document.createElement('button');
        this.navPrev.classList.add(navPrevClassName);
        this.navPrev.innerHTML = '<';
    
        this.navNext = document.createElement('button');
        this.navNext.classList.add(navNextClassName);
        this.navNext.innerHTML = '>';
        
        this.navWrapper.prepend(this.navPrev);
        this.navWrapper.append(this.navNext);
        this.gallery.append(this.navWrapper);

        this.navNext.addEventListener('pointerup', (event) => {
            if (event.button != 0) {
                return;
            }
            this.nextSlide();
        });
        this.navPrev.addEventListener('pointerup', (event) => {
            if (event.button != 0) {
                return;
            }
            this.prevSlide();
        });
    }
    resize(){
        window.addEventListener('resize', this.calculate); 
     }
    calculate(){
        this.galleryLine.style.width = `${(this.galleryCoords.width + this.options.margin) * this.gallerySize}px`;
        this.visualStartOfGallery = this.currentSlide * (this.galleryCoords.width + this.options.margin);
        this.checkNavNeedDisabled();
    }
    checkNavNeedDisabled(){
        if(this.currentSlide == 0){
            if (this.options.isNav){
                this.navPrev.classList.add('disabled');
            }
            this.isModal ? this.navPrevModal.classList.add('disabled'): null;
        } 
        if(this.currentSlide === (this.gallerySize - 1)){
            if (this.options.isNav){
                this.navNext.classList.add('disabled');
            }
            this.isModal ? this.navNextModal.classList.add('disabled'): null;
        } 
        if ( this.currentSlide != 0){
            if (this.options.isNav){
                this.navPrev.classList.remove('disabled');
            }    
            this.isModal ? this.navPrevModal.classList.remove('disabled'): null;
        } 
        if (this.currentSlide != (this.gallerySize - 1) ){
            if (this.options.isNav){
                this.navNext.classList.remove('disabled');
            }
            this.isModal ? this.navNextModal.classList.remove('disabled'): null;
        }
    }
    setEventListeners(){
        this.gallery.addEventListener('pointerup', () => {
            this.isSelected = true;
            document.addEventListener('keydown', this.changeOnKeyDownInStandart);
        })
        document.addEventListener('pointerup', (event) => { 
            if ( !this.gallery.contains(event.target) ){
                this.isSelected = false;
            }
            if (this.isModal){
                if ( this.modalWindow.contains(event.target) ){
                    this.isSelected = true;
                }  else {
                    this.isSelected = false;
                }
            }
        })
        
        this.gallery.addEventListener('pointerup', (event) => {this.onGalleryClick(event) });
        this.gallery.addEventListener('pointerdown', this.startDrag);
    }
    changeOnKeyDownInStandart(event){ //change slides in minimal mode
        if( this.isSelected === true) {
            switch (event.code){
                case 'ArrowRight': 
                    this.nextSlide();
                    this.changeActiveControl(this.currentSlide);
                    break;
                case 'ArrowLeft': 
                    this.prevSlide(); 
                    this.changeActiveControl(this.currentSlide);
                    break;
            }
        } 
    }
    onGalleryClick(event){
        if (event.button != 0) {
            return;
        }
         this.showFullSize(event);
    }
    showFullSize(event){
        if ( (event.target === this.galleryLine) && (this.shiftMove === undefined) ){
            this.img = this.galleryslides[this.currentSlide].querySelector('img'); 
            this.addModalWindow(this.img); 
        }
    }
    startDrag(event){
        if (event.button != 0) {
            return;
        }
        this.galleryLine.style.transition = `all 0s ease`;
        this.startClickX = event.pageX + this.visualStartOfGallery;
        window.addEventListener('pointermove', this.dragging);
        window.addEventListener('pointerup', this.stopDrag);
    }
    dragging(event){
        this.gallery.classList.add(movePointerClassName);
        this.finishMoveX = event.pageX + this.visualStartOfGallery;
        this.shiftMove = this.finishMoveX - this.startClickX;
        this.setTransformSwipe(); 
        if (this.shiftMove > 100 && !this.isSlideChanged && this.currentSlide > 0){
            this.currentSlide--; //for this.stopDrag()
            this.isSlideChanged = true;
        }
        if (this.shiftMove < - 100 && !this.isSlideChanged && this.currentSlide < (this.gallerySize - 1) ){
            this.currentSlide++; // //for this.stopDrag()
            this.isSlideChanged = true;
        }
    }
    setTransformSwipe(){ // transformX (swipe only) for galleryLine
        if ( (this.currentSlide == 0) && (this.shiftMove > 0) && !this.isSlideChanged ){
            this.shiftMove = this.shiftMove / 20;
        }
        if ( (this.currentSlide == (this.gallerySize-1) ) && (this.shiftMove < 0) && !this.isSlideChanged ){
            this.shiftMove = this.shiftMove / 20;
        }
        this.transformValue = this.shiftMove - this.visualStartOfGallery;
        this.galleryLine.style.transform = `translateX(${this.transformValue}px)`;
    }
    stopDrag(){
        this.galleryLine.style.transition = `all ${this.options.transitionValue}s ease`;
        this.gallery.classList.remove(movePointerClassName);
        this.startPositionX = this.shiftMove + this.startClickX;
        window.removeEventListener('pointermove', this.dragging);
 
        this.changeSlide(this.currentSlide); 
        this.isSlideChanged = false;
        this.shiftMove = undefined;
    }
    changeSlide(id){
        this.currentSlide = id;
        this.SetCurrentSlideTransform(id);
        this.changeActiveControl(id);
    }
    changeActiveControl(id){
        if (this.options.isControls){
            Array.from(this.controlsList.children).forEach((elem)=>{
                elem.classList.remove(activeControlClassName);
                if ( Number(elem.dataset.slidenumber) === Number(id) ) {
                    elem.classList.add(activeControlClassName);
                }
            });
        }
    }
    nextSlide(){
        if ( this.currentSlide < (this.gallerySize - 1) ){
            this.currentSlide++;
            this.SetCurrentSlideTransform();
        } 
    }
    prevSlide(){
        if ( this.currentSlide > 0 ){
            this.currentSlide--;
            this.SetCurrentSlideTransform();
        }
    }
    SetCurrentSlideTransform(){ // TransformX for galleryLine (change slide)
        this.calculate();
        this.galleryLine.style.transform = `translateX(${ -this.visualStartOfGallery }px)`;
    } 
    addModalWindow(img = '' ){
        this.isModal = true;
        this.initModal();
        this.getFullsizeImg(img);

        this.navPrevModal.addEventListener('pointerup', (event) => {
            if (event.button != 0) {
                return;
            }
            this.prevSlide(); 
            this.img = this.galleryslides[this.currentSlide].querySelector('img');
            this.getFullsizeImg(this.img);
        })
        this.navNextModal.addEventListener('pointerup', (event) => {
            if (event.button != 0) {
                return;
            }
            this.nextSlide(); 
            this.img = this.galleryslides[this.currentSlide].querySelector('img');
            this.getFullsizeImg(this.img);
        })
        this.modalWindowCloseBtn.addEventListener('pointerup', (event) => {
            if (event.button != 0) {
                return;
            }
            this.removeModalWindow(); 
        })
        document.removeEventListener('keydown', this.changeOnKeyDownInStandart);
        document.addEventListener('keydown', this.changeOnKeyDownInModal);
    }
    initModal(){ //init modal window 
    
         this.modalWindow = document.createElement('div'); 
         this.modalWindow.style.opacity = 0;
         this.modalWindow.style.zIndex = '-9999';
         this.modalWindow.classList.add(modalWindowClassName);
         this.modalWindowCloseBtn = document.createElement('div'); 
         this.modalWindowCloseBtn.classList.add(modalWindowCloseBtnClassName);
         this.modalWindowCloseBtn.innerHTML = 'Закрыть';
         this.modalWindow.append(this.modalWindowCloseBtn);

         document.body.prepend(this.modalWindow);
         
 
         this.fullsizeImgWrapper = document.createElement('div'); 
         this.fullsizeImgWrapper.classList.add(fullsizeImgWrapperClassName);
         this.fullsizeImg = document.createElement('img'); 
         this.fullsizeImg.classList.add(fullsizeImgClassName);
 
         this.modalWindow.append(this.fullsizeImgWrapper);
         this.fullsizeImgWrapper.append(this.fullsizeImg);

         this.navPrevModal = document.createElement('button');
         this.navPrevModal.classList.add(navPrevModalClassName);
         this.navPrevModal.innerHTML = '<';
 
         this.navNextModal = document.createElement('button');
         this.navNextModal.classList.add(navNextModalClassName);
         this.navNextModal.innerHTML = '>';
         
         this.modalWindow.prepend(this.navPrevModal);
         this.modalWindow.append(this.navNextModal);

        document.body.style.overflowY = 'hidden';
        this.modalWindow.style.position = 'fixed';
        this.modalWindow.style.height = '100vh';
        this.modalWindow.style.zIndex = '9999';

        fadeIn(this.modalWindow, 500, () => {
            
        })
        

    }
    getFullsizeImg(img){
        if (this.fullsizeImg.classList.contains('opened')){
            this.getNextFullsizeImg(img);
        }
        if (!this.fullsizeImg.classList.contains('opened')){
            this.fullsizeImg.src = img.src;
            fadeIn(this.fullsizeImg, 1000, () => {
                this.fullsizeImg.classList.add('opened');
            });
            
        }
    }
    getNextFullsizeImg(img){
        fadeOut(this.fullsizeImg, 300, () => {
            fadeIn(this.fullsizeImg, 1000);
            this.fullsizeImg.src = img.src;
            this.fullsizeImg.classList.add(fullsizeImgClassName);
        });
    }
    changeOnKeyDownInModal(event){
        switch (event.code){
            case 'ArrowRight': 
                this.nextSlide(); 
                this.img = this.galleryslides[this.currentSlide].querySelector('img');
                this.getFullsizeImg(this.img);
                break;
            case 'ArrowLeft': 
                this.prevSlide(); 
                this.img = this.galleryslides[this.currentSlide].querySelector('img');
                this.getFullsizeImg(this.img);
                break;
            case 'Escape': 
                this.removeModalWindow(); 
                break;    
        }
    }
    removeModalWindow(){
        this.isModal = false;
        document.body.style.overflowY = 'auto';
        document.body.style.height = 'auto';
        this.modalWindow.style.zIndex = '-9999';

        fadeOut(this.modalWindow, 500, () => {
            this.modalWindow.remove();
        })
        
        document.removeEventListener('keydown', this.changeOnKeyDownInModal);
        document.addEventListener('keydown', this.changeOnKeyDownInStandart);
    }
}


//Helpers
    
   function fadeIn(elem, time, callback){
    elem.style.opacity = 0;
    elem.style.transition = `opacity ${time}ms ease`;
    setTimeout( () => {
        elem.style.opacity = 1;
    }, 0);
    if (callback){
        setTimeout(callback, time);
    }
   }
   function fadeOut(elem, time, callback){
    elem.style.opacity = 1;
    elem.style.transition = `opacity ${time}ms ease`;
    setTimeout( () => {
        elem.style.opacity = 0;
    }, 0);
    if (callback){
        setTimeout(callback, time);
    }
   }
    