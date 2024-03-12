const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const cd = $('.cd');
const nextBtn = $('.btn-next');
//  thanh chay am nhac
const progress = $('.progress');



const app = {

    currentIndex: 0,
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
            singer: "",
            path: "src/trai_dat_om_mat_troi.mp3",
            image:
                "img/trai_dat_om_mat_troi.jpg"
        },
        {
            name: "Anh Đã Quen Với Cô Đơn",
            singer: "Soobin Hoàng Sơn",
            path: "src/anh_da_quen_voi_co_don.mp3",
            image:"img/anh_da_quen_voi_co_don.jpg"
        },
        {
            name: "KARIK - BẠN ĐỜI (FT. GDUCKY)",
            singer: "Karik ft. Gducky",
            path:"src/ban_doi.mp3",
            image:"img/ban_doi.jpg"
        },
        {
            name: "Tình Yêu Chậm Trễ",
            singer: "MOON",
            path: "src/tinh_yeu_cham_tre.mp3",
            image:"img/tinh_yeu_cham_tre.jpg"
        }
    ],
    render: function () {
        const htmls = this.songs.map(song => {
            return `      
                <div class="song">
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
        const cdWidth = cd.offsetWidth;

        // xử lý phóng to / thu nhỏ cd
        document.onscroll = function () {
            const scroll = document.documentElement.scrollTop || window.scrollY;
            const newCdWidth = cdWidth - scroll;

            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // xử lý play

        var isPlaying = false;

        playBtn.onclick = function () {
            // click để bật hoặc tắt
            if(isPlaying) {
                audio.pause();
                player.classList.remove("playing");
                isPlaying = isPlaying;
            } else {
                audio.play();
                player.classList.add("playing");
            }
            isPlaying = !isPlaying;
        }


        // Tiến Độ Bài Hát
        audio.ontimeupdate = function () {
            // tính ra phần trăm nhạc chạy theo

            if(audio.duration) {
                // audio.duration : tong so giay bai hat
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;

                console.log(progressPercent)
            }
        }

        // Tiến Độ Bài Hát : Tua
        progress.onchange = function (e) {

            console.log(e.target.value / 100 * audio.duration);
        }


        // chuyển tiếp bài hát

        nextBtn.onclick = function () {

        }
    },
    loadCurrentSong: function () {
        heading.innerText = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
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