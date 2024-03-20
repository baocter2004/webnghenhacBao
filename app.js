const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const cd = $('.cd');
// controller
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
//  thanh chay am nhac
const progress = $('.progress');
// chuyển bài
const song = $('.song');

const playList = $('.playlist');



const app = {

    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: "Đi Để Trở Về 2",
            singer: "SooBin Hoàng Sơn",
            path: "src/Chuyen-Di-Cua-Nam-Di-De-Tro-Ve-2-SOOBIN.mp3",
            image: "img/didetrove.jpg"
        },
        {
            name: "Nắng Có Mang Em Về",
            singer: "Suz Prati",
            path: "src/nang_co_mang_em_ve.mp3",
            image: "img/nangcomangemve.jpg"
        },
        {
            name: "Muộn Rồi Mà Sao Còn",
            singer: "Sơn Tùng MTP",
            path:
                "src/muonroimasaocon.mp3",
            image: "img/muonroimasaocon.jpg"
        },
        {
            name: "Trái Đất Ôm Mặt Trời",
            singer: "ai Nhớ ?",
            path: "src/trai_dat_om_mat_troi.mp3",
            image:
                "img/trai_dat_om_mat_troi.jpg"
        },
        {
            name: "Anh Đã Quen Với Cô Đơn",
            singer: "Soobin Hoàng Sơn",
            path: "src/anh_da_quen_voi_co_don.mp3",
            image: "img/anh_da_quen_voi_co_don.jpg"
        },
        {
            name: "KARIK - BẠN ĐỜI (FT. GDUCKY)",
            singer: "Karik ft. Gducky",
            path: "src/bandoi.mp3",
            image: "img/ban_doi.jpg"
        },
        {
            name: "Tình Yêu Chậm Trễ",
            singer: "MOON",
            path: "src/tinh_yeu_cham_tre.mp3",
            image: "img/tinh_yeu_cham_tre.jpg"
        }
    ],
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `      
                <div class="song ${index === this.currentIndex ? "active" : ""}">
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
                </div>`;
        });
        // render ra
        $('.playlist').innerHTML = htmls.join('');
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },

    handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // xử lý cd quay / dừng
        const cdAnimation = cd.animate([
            {
                transform: 'rotate(360deg)'
            }
        ], {
            duration: 10000, // 10 giây
            iterations: Infinity
        })

        // dừng luôn : 
        cdAnimation.pause();

        // xử lý phóng to / thu nhỏ cd
        document.onscroll = function () {
            const scroll = document.documentElement.scrollTop || window.scrollY;
            const newCdWidth = cdWidth - scroll;

            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // xử lý play

        playBtn.onclick = function () {
            // click để bật hoặc tắt
            if (_this.isPlaying) {
                audio.pause();
                cdAnimation.pause();
                player.classList.remove("playing");
                _this.isPlaying = _this.isPlaying;
            } else {
                audio.play();
                cdAnimation.play();
                player.classList.add("playing");
            }
            _this.isPlaying = !_this.isPlaying;
        }


        // Tiến Độ Bài Hát
        audio.ontimeupdate = function () {
            // tính ra phần trăm nhạc chạy theo

            if (audio.duration) {
                // audio.duration : tong so giay bai hat
                // audio.currentTime : 
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;

                // console.log(progressPercent)
            }
        }

        // Tiến Độ Bài Hát : Tua
        progress.onchange = function (e) {
            // console.log(e.target.value / 100 * audio.duration);
            const seekTime = e.target.value / 100 * audio.duration;
            audio.currentTime = seekTime;
        }


        // chuyển tiếp bài hát

        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            player.classList.add("playing");
            _this.render();
            _this.scrollToActiveSong();
        }

        //  lùi bài hát

        prevBtn.onclick = function () {
            _this.prevSong();
            audio.play();
            player.classList.add("playing");
            _this.scrollToActiveSong();
        }

        // bài hát ngẫu nhiên 
        randomBtn.onclick = function () {
            _this.isRandom = !this.isRandom;
            randomBtn.classList.toggle("active", _this.isRandom);
        }
        // quay trở về ban đầu
        audio.onended = function () {
            if (!_this.isRepeat) {
                nextBtn.click();
            } else {
                audio.play();
            }
        }
        // xử lý phát lại = click vào sẽ bật chức năng
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            console.log(_this.isRepeat)
            repeatBtn.classList.toggle("active", _this.isRepeat);
        }

        // lắng nghe hành vi click vào playlist
        playList.onclick = function (e) {
            console.log(e.target)
        }
    },
    // Kéo đến bài khi active song
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: "smooth",
                block: 'nearest'
            });
        }, 300);
    }
    ,
    loadCurrentSong: function () {
        heading.innerText = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    // chuyển bài next 
    nextSong: function () {
        //  next cái chuyển bải
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        //        console.log(this.currentSong);
        this.loadCurrentSong();
    },
    // lùi bài hát
    prevSong: function () {
        // lùi bài liền
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        //        console.log(this.currentSong);
        this.loadCurrentSong();
    },
    // đổi bài ngẫu nhiên
    randomSong: function () {
        let random;
        do {
            random = Math.floor(Math.random() * this.songs.length);
            // console.log(this.currentIndex);
        } while (random === this.currentIndex);
        this.currentIndex = random;
        this.loadCurrentSong();
    },
    start: function () {
        // Định nghĩa các thuộc tính
        this.defineProperties();

        // lắng nghe , xử lý các sự kiện
        this.handleEvents();

        // tải thông tin bài hát đầu tiên vào UI khi chay
        this.loadCurrentSong();

        // render playlist
        this.render();
    }
}

app.start();

// cộng thêm px