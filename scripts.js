document.addEventListener("DOMContentLoaded", () => {
  const categories = document.querySelectorAll(".category");
  const imageItems = document.querySelectorAll(".image-item");

  categories.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.getAttribute("data-category");

      // すべての画像を非表示にする
      imageItems.forEach((item) => {
        item.classList.remove("show");
      });

      // クリックされたカテゴリーの画像だけ表示
      if (category === "all") {
        imageItems.forEach((item) => {
          item.classList.add("show");
        });
      } else {
        const filteredItems = document.querySelectorAll(
          `.image-item.${category}`
        );
        filteredItems.forEach((item) => {
          item.classList.add("show");
        });
      }
    });
  });

  // 初期状態としてALLカテゴリーを表示
  document.querySelector('.category[data-category="all"]').click();
});
