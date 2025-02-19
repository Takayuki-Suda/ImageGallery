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

// カテゴリーの定義
const categories = {
  ALL: images,
  CAT: images.filter((img) => img.caption.startsWith("cat")),
  DOG: images.filter((img) => img.caption.startsWith("dog")),
  FISH: images.filter((img) => img.caption.startsWith("fish")),
  INSECT: images.filter((img) => img.caption.startsWith("insect")),
};

// ギャラリーの作成
function createGallery(category = "ALL") {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  categories[category].forEach((image, index) => {
    const item = document.createElement("div");
    item.className = `p-works-gallery__item p-works-gallery__item--type${
      (index % 3) + 1
    } p-works-gallery__item--hidden`;

    item.innerHTML = `
      <a class="p-hover-effect--type1" href="#">
        <div class="p-works-gallery__thumbnail p-hover-effect__image">
          <img src="${image.src}" alt="${image.caption}" loading="lazy">
        </div>
        <h3 class="p-works-gallery__caption">${image.caption}</h3>
      </a>
    `;

    gallery.appendChild(item);

    // 画像がふわっと出てくるアニメーション
    setTimeout(() => {
      item.classList.remove("p-works-gallery__item--hidden");
      item.classList.add("p-works-gallery__item--visible");
    }, 100);
  });
}

// カテゴリーの切り替え
function switchCategory(category) {
  const galleryItems = document.querySelectorAll(".p-works-gallery__item");
  galleryItems.forEach((item) => {
    item.classList.remove("p-works-gallery__item--visible");
    item.classList.add("p-works-gallery__item--hidden");
  });

  setTimeout(() => {
    createGallery(category);
  }, 500);
}

// カテゴリーボタンのイベントリスナー
document.querySelectorAll(".category-button").forEach((button) => {
  button.addEventListener("click", (e) => {
    const category = e.target.dataset.category;
    switchCategory(category);
  });
});

// DOMContentLoaded イベントで初期化
document.addEventListener("DOMContentLoaded", () => {
  createGallery();
});
