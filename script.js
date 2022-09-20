class Slider{
  defaultSettings = {
    selector:'.slider',
    arrows:false,
    dots:false,
    loop:false,
    autoplay:false
  }
  constructor(settings){
    this.settings = Object.assign(this.defaultSettings, settings);
  }
  templates = {
    renderDots: function(dots){
      return `
      <ul class="slider-dots">
      ${dots.map(function(_, index){
        return `
          <li class="slider-dot">
            <button type="button">${index+1}</button>
          </li>
        `
      }).join('')}
        </ul>
      `
    },
    renderArrows: function(){
      return `
      <ul class="slider-arrows">
        <li class="arrow arrow-prev">
          <button type="button">prev</button>
        </li>
        <li class="arrow arrow-next">
          <button type="button">next</button>
        </li>
      </ul>
      `
    }, 

    renderTrack: function(slides){
      return `
      <div class="slider-list">
        <div class="slider-track">
          ${slides}
        </div>
      </div>
      `
    },

    renderSlides: function(slides){ //заходит массив div-child => обертываем их в новый div и получаем массив строк html
      return slides.map(function(slide){
        return `
        <div class="slider-slide">
          ${slide.outerHTML}
        </div>
        `
      }).join('');// массив в строку
    }  
  }

  state = {
    activeSlide: 0
  }

  setState(state){
    this.state= Object.assign(this.state, state);
  }

  render(){
    const slider = document.querySelector(this.settings.selector);
    const children = Array.from(slider.children);
    const slides = this.templates.renderSlides(children);
    const track = this.templates.renderTrack(slides);
    

    slider.innerHTML = track;

    if(this.settings.dots){
      const dots = this.templates.renderDots(children);
      slider.insertAdjacentHTML('beforeend', dots);
    }

    if(this.settings.arrows){
      const arrows = this.templates.renderArrows();
      slider.insertAdjacentHTML('beforeend', arrows);
    }

    this.setState({
      slidesCount: children.length,
      elements:{
        slider,
        track:slider.querySelector('.slider-track'),
        next: slider.querySelector('.arrow-next'),
        prev: slider.querySelector('.arrow-prev'),
        dots: slider.querySelector('.slider-dots'),
      }
    })
  }

  next(){
    const track = this.state.elements.track;
    let slidesCount = this.state.slidesCount;
    if(slider.settings.loop){
      if(Math.abs(this.state.activeSlide)>=slidesCount-1){
        this.state.activeSlide=1;
        track.style.transform=`translateX(0%)`;
      }
    }
    if(Math.abs(this.state.activeSlide)===slidesCount-1) return//activeSlide - начинается с 0,1,2 а slidesCount c 1,2,3
    this.state.activeSlide-=1;
    track.style.transform=`translateX(${this.state.activeSlide*100}%)`;
  }

  prev(){
    const track = this.state.elements.track;
    let slidesCount = this.state.slidesCount;
    if(slider.settings.loop){
      if(this.state.activeSlide===0){
        this.state.activeSlide=-1*slidesCount ;
        track.style.transform=`translateX(${this.state.activeSlide*100}%)`;
      }
    }
    if(this.state.activeSlide===0) return

    this.state.activeSlide+=1;
    track.style.transform=`translateX(${this.state.activeSlide*100}%)`
  }

  arrowEvents(){
    const next = this.state.elements.next;
    const prev = this.state.elements.prev;
    console.log(this);
    next.addEventListener('click', this.next.bind(this));

    prev.addEventListener('click',this.prev.bind(this));

  }

  moveSlide(event){
    const dot = event.target;
    const track = this.state.elements.track;
    if(dot.classList.contains('slider-dot')){
      console.log(this, this.state.activeSlide*100);
      this.state.activeSlide = -(dot.textContent-1);
      track.style.transform=`translateX(${this.state.activeSlide*100}%)`
    }
  }

  dotsEvents(){
    const dots = this.state.elements.dots;
    dots.addEventListener('click', this.moveSlide.bind(this));
  }

  init(){
    this.render();
    this.arrowEvents();
    this.dotsEvents();
    this.timeMove();
    console.log(this);
  }
}

const slider =  new Slider({
  arrows:true, 
  dots: true,
  loop: true,
  autoplay: true
});

slider.init();