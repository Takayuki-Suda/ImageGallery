// 画像データの定義
const images = [
  ...Array(8)
    .fill()
    .map((_, i) => ({
      src: `./test_image/cat/cat${String(i + 1).padStart(2, "0")}.jpg`,
      caption: `cat${String(i + 1).padStart(2, "0")}`,
    })),
  ...Array(9)
    .fill()
    .map((_, i) => ({
      src: `./test_image/dog/dog${String(i + 1).padStart(2, "0")}.jpg`,
      caption: `dog${String(i + 1).padStart(2, "0")}`,
    })),
  ...Array(4)
    .fill()
    .map((_, i) => ({
      src: `./test_image/fish/fish${String(i + 1).padStart(2, "0")}.jpg`,
      caption: `fish${String(i + 1).padStart(2, "0")}`,
    })),
  { src: "./test_image/insect/insect01.jpg", caption: "insect01" },
];

// ギャラリーの作成
function createGallery() {
  const gallery = document.getElementById("gallery");

  images.forEach((image) => {
    const item = document.createElement("div");
    item.className =
      "p-works-gallery__item p-works-gallery__item--type1 p-works-gallery__item--has-caption";

    item.innerHTML = `
        <a class="p-hover-effect--type1" href="#">
          <div class="p-works-gallery__thumbnail p-hover-effect__image">
            <img src="${image.src}" alt="${image.caption}" loading="lazy">
          </div>
          <h3 class="p-works-gallery__caption">${image.caption}</h3>
        </a>
      `;

    gallery.appendChild(item);
  });
}

// DOMContentLoaded イベントで初期化
document.addEventListener("DOMContentLoaded", createGallery);
