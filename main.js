const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PlAYER_STORAGE_KEY = 'CFAZ_PLAYER'
        
const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: {},
    // config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'name-music',
            singer: 'ca si',
            image: './assets/img/img1.jpg',
            path: './assets/music/DuaEmVeNha.mp3'  
        },
        {
            name: 'Những ngày',
            singer: 'Dick-Tuyết',
            image: './assets/img/img1.jpg',
            path: './assets/music/NhungNgay.mp3'
        },
        {
            name: 'name-music',
            singer: 'ca si',
            image: './assets/img/img1.jpg',
            path: './assets/music/DuaEmVeNha.mp3'
        },
        {
            name: 'name-music',
            singer: 'ca si',
            image: './assets/img/img1.jpg',
            path: './assets/music/DuaEmVeNha.mp3'
        },
        {
            name: 'name-music',
            singer: 'ca si',
            image: './assets/img/img1.jpg',
            path: './assets/music/DuaEmVeNha.mp3'
        },
        {
            name: 'name-music',
            singer: 'ca si',
            image: './assets/img/img1.jpg',
            path: './assets/music/DuaEmVeNha.mp3'
        },
        {
            name: 'name-music',
            singer: 'ca si',
            image: './assets/img/img1.jpg',
            path: './assets/music/DuaEmVeNha.mp3'
        }
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        // localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
     render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
                        <div class="song ${
                          index === this.currentIndex ? "active" : ""
                        }" data-index="${index}">
                            <div class="thumb"
                                style="background-image: url('${song.image}')">
                            </div>
                            <div class="body">
                                <h3 class="title">${song.name}</h3>
                                <p class="author">${song.singer}</p>
                            </div>
                            <div class="option">
                                <i class="fas fa-ellipsis-h"></i>
                            </div>
                        </div>
                    `;
    });
        $('playlist').innerHTML = htmls.join("");        
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        });
    },
    handleEvents: function() {
        const _this = this; 
        const cdWidth = cd.offsetWidth;

        //Xu li CD quay / dung
        //Handle CD spins / stops
      const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)"}], {
            duration: 10000, //10 seconds
            iterations: Infinity //quay vo han
        });
        cdThumbAnimate.pause();

        //Xử lí phóng to thu nhỏ CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
      
            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
          };
        // Xử lí khi click play
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
        }
    };

        // Khi song duoc play
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

         // Khi song duoc bi pause
         audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing');
              cdThumbAnimate.pause();
        };

        //Khi tien do bai hat thay doi
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(
                        (audio.currentTime / audio.duration ) * 100
                    );
                progress.value = progressPercent;
            }
        };

        //Xu li khi tua song
        progress.onchange = function(e) {
            const seekTime =(audio.duration / 100) * e.target.value;
            audio.currentTime = seekTime;
           }

           //Khi next song
           nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong();
            }else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
           }
            //Khi prev song
           prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong();
            }else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
           };

           // Xu li bat/ tat random song
           randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
                randomBtn.classList.toggle('active', _this.isRandom);
           };

           //xu li lap lai 1 song 
           repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);

           };

           // Xu li next khi audio ended
           audio.onended = function() {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
           }

           //Lang nghe hanh vi click vao playlist
           playlist.onclick = function(e) {
            const songNode =  e.target.closest('.song:not(.active)');

            if (songNode || e.target.closest('.option')) {
                //Xu li khi click vao song
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }

                //Xu li khi click vao song option
                if(e.target.closest('.option')) {

                }
            }
           };
    },
    scrollToActiveSong: function() {
        setTimeout(() =>{
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }, 300);
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function() {
            this.isRandom = this.config.isRandom;
            this.isRepeat = this.config.isRepeat;
    },
    // getCurrentSong: function() {
    //     return this.songs[this.currentIndex]
    // },
    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

        prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong();

    },
    start: function() {
        //Gan cau hinh tu config vao app
        this.loadConfig();
        // Định nghĩa các thuộc tính cho object
        this.defineProperties();

        // Lắng nghe /xủ lí các sự kiện(DOM events)
        this.handleEvents();

        // Tải thông tin bài hát đầu tiên vào UI khi tải ứng dụng 
        this.loadCurrentSong();

        //render playlist
        this.render();
            //Hien thi tran thai random
            randomBtn.classList.toggle('active', this.isRandom);
            repeatBtn.classList.toggle('active', this.isRepeat);
    }
};

    app.start();