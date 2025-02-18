jQuery(function ($) {
  /**
   * gallery caption
   */
  $(".p-works-gallery__item--has-caption a").hover(
    function () {
      var $caption = $(".p-works-gallery__caption", this);
      $caption.css("top", $(this).innerHeight() - $caption.innerHeight() || 0);
    },
    function () {
      $(".p-works-gallery__caption", this).removeAttr("style");
    }
  );

  /**
   * 初期化処理
   */
  $(document).on("js-initialized-after", function () {
    /**
     * gallery grid
     */
    var $galleries = $(".p-works-gallery");

    // 基準となる横幅取得
    var getGridItemWidth = function () {
      var w = window.innerWidth || $("body").width();
      if ($galleries.hasClass("p-entry-works__gallery") || w < 992) {
        return $galleries.width() / 2;
      } else {
        return $galleries.width() / 4;
      }
    };

    // data-height, data-widthにサイズセット
    var setGridItemSize = function () {
      var width = getGridItemWidth();
      $galleries
        .find(
          ".p-works-gallery__item:not(.p-works-gallery__item--type2, .p-works-gallery__item--type3)"
        )
        .attr("data-height", width)
        .attr("data-width", width);
      $galleries
        .find(".p-works-gallery__item--type2")
        .attr("data-height", width)
        .attr("data-width", width * 2);
      $galleries
        .find(".p-works-gallery__item--type3")
        .attr("data-height", width * 2)
        .attr("data-width", width);
    };
    setGridItemSize();

    // grid init
    $galleries.each(function () {
      var gallery = this;
      var $gallery = $(this);
      var is_first = 1;

      $gallery.imagesLoaded(function () {
        var wall = new Freewall(gallery);
        wall.reset({
          selector: ".p-works-gallery__item",
          animate: true,
          cellW: function () {
            return getGridItemWidth();
          },
          cellH: function () {
            return getGridItemWidth();
          },
          gutterX: 0,
          gutterY: 0,
          onComplete: function () {
            // only once
            if (is_first) {
              is_first = 0;

              // inview gallery fadein
              $gallery.one("inview", function (event, isInView) {
                if (isInView) {
                  var poss = [];
                  // 左上からの表示順を取得するために0埋めしてソート
                  var j = 0;
                  var poss = [];
                  $(".p-works-gallery__item:visible").each(function (i) {
                    poss.push(
                      (
                        "0000000000" +
                        parseInt($(this).css("top"), 10) * 10000
                      ).slice(-10) +
                        +parseInt($(this).css("left"), 10) +
                        "#" +
                        this.id
                    );
                  });
                  $.each(poss.sort(), function (i, v) {
                    var a = v.split("#");
                    $("#" + a[1] + ".p-works-gallery__item")
                      .delay(200 * ++j)
                      .queue(function () {
                        $(this).addClass("is-active").dequeue();
                      });
                  });
                  $(".p-works-gallery__item:not(.is-active)").each(function (
                    i
                  ) {
                    $(this)
                      .delay(200 * ++j)
                      .queue(function () {
                        $(this).addClass("is-active").dequeue();
                      });
                  });
                }
              });

              $(window).trigger("resize");
            }
          },
          onResize: function () {
            setGridItemSize();
            wall.fitWidth();
          },
        });

        // category filter
        var $filterItems = $gallery
          .closest(".l-inner")
          .find(".p-works-gallery__filter-item");
        $filterItems.click(function () {
          $filterItems.removeClass("is-active");
          var catId = $(this).addClass("is-active").attr("data-cat-id");
          if (catId) {
            wall.filter(".cat-" + catId);
          } else {
            wall.unFilter();
          }
        });

        wall.fitWidth();
      });
    });

    /**
     * gallery modal
     */
    if ($(".p-entry-works__gallery").length) {
      var galleryModal = {
        inited: false,
        itemCount: null,
        current: null,
        scrollTop: 0,
        isOpen: false,
        flickStartX: null,
        flickEndX: null,

        // modal init
        init: function () {
          if (this.inited) return false;

          var self = this;
          this.inited = true;
          this.itemCount = $(
            ".p-entry-works__gallery .p-works-gallery__item"
          ).length;

          // create modal
          var html =
            '<div id="js-gallery-modal" class="p-gallery-modal" style="display: none;">' +
            '<div class="p-gallery-modal__inner">' +
            '<div class="p-gallery-modal__inner2">' +
            '<div class="p-gallery-modal__contents"></div>' +
            '<div class="p-gallery-modal__contents-bottom">' +
            '<div class="p-gallery-modal__title"></div>' +
            '<div class="p-gallery-modal__desc"></div>' +
            '<button class="p-gallery-modal__close p-gallery-modal__button">&#xe91a;</button>' +
            "</div></div></div>" +
            '<div class="p-gallery-modal__overlay"></div>' +
            "</div>";
          $("body").append(html);

          this.$modal = $("#js-gallery-modal");
          this.$modalInner = $("#js-gallery-modal .p-gallery-modal__inner");
          this.$modalInner2 = $("#js-gallery-modal .p-gallery-modal__inner2");
          this.$modalContents = $(
            "#js-gallery-modal .p-gallery-modal__contents"
          );
          this.$modalTitle = $("#js-gallery-modal .p-gallery-modal__title");
          this.$modalDesc = $("#js-gallery-modal .p-gallery-modal__desc");

          // close button
          this.$modal.on("click", ".p-gallery-modal__close", function () {
            self.close();
            return false;
          });

          // overlay click
          this.$modal.on("click", ".p-gallery-modal__overlay", function () {
            self.close();
            return false;
          });

          // prev
          this.$prevButton = $(
            '<button class="p-gallery-modal__prev p-gallery-modal__button">&#xe90f;</button>'
          ).click(function () {
            self.prev();
            return false;
          });

          // next
          this.$nextButton = $(
            '<button class="p-gallery-modal__next p-gallery-modal__button">&#xe910;</button>'
          ).click(function () {
            self.next();
            return false;
          });
          this.$modalInner
            .append(galleryModal.$prevButton)
            .append(galleryModal.$nextButton);

          // drag
          this.$modal.on("mousedown", function (event) {
            self.flickStartX = event.pageX;
          });
          this.$modal.bind("mouseup", function (event) {
            if (self.flickStartX === null) return;

            var diffX = event.pageX - self.flickStartX;
            self.flickStartX = null;
            self.flickEndX = null;

            if (diffX > 300) {
              self.prev();
            } else if (diffX < -300) {
              self.next();
            }
          });

          // flick
          this.$modal.on("touchstart", function (event) {
            self.flickStartX = event.originalEvent.touches[0].pageX;
          });
          this.$modal.on("touchmove", function (event) {
            self.flickEndX = event.originalEvent.touches[0].pageX;
          });
          this.$modal.bind("touchend", function (event) {
            if (self.flickStartX === null) return;

            var diffX = self.flickEndX - self.flickStartX;
            self.flickStartX = null;
            self.flickEndX = null;

            if (diffX > 80) {
              self.prev();
            } else if (diffX < -80) {
              self.next();
            }
          });
        },

        // modal open
        open: function (index) {
          var self = this;

          if (this.current == index) {
            return false;
          }

          var $item = $(".p-entry-works__gallery .p-works-gallery__item").eq(
            index
          );
          if (!$item.length) {
            console.log("gallery modal open error : invalid index " + index);
            return false;
          }

          // modal init
          if (!this.inited) {
            this.init();
          }

          // modal contents
          var html = "";
          var type = $item.attr("data-modal-type");
          var title = $item.attr("data-title") || "";
          var desc = $item.attr("data-desc") || "";

          if (type == "video") {
            html +=
              '<div class="p-gallery-modal__item p-gallery-modal__item--video">';
            html += '<div class="p-gallery-modal__item__inner">';
            html +=
              '<video src="' +
              $item.find("a").attr("href") +
              '" controls autoplay></video>';
            html += "</div>";
          } else if (type == "youtube") {
            html +=
              '<div class="p-gallery-modal__item p-gallery-modal__item--youtube">';
            html += '<div class="p-gallery-modal__item__inner">';
            html +=
              '<iframe src="https://www.youtube.com/embed/' +
              $item.attr("data-modal-youtube") +
              '?autoplay=1&mute=0&iv_load_policy=3&showinfo=0&rel=0"></iframe>';
            html += "</div>";
          } else if (type == "embed") {
            html +=
              '<div class="p-gallery-modal__item p-gallery-modal__item--embed">';
            html += $item.attr("data-modal-embed");
          } else {
            html +=
              '<div class="p-gallery-modal__item p-gallery-modal__item--image">';
            html += '<img src="' + $item.find("a").attr("href") + '" alt="">';
          }

          html += "</div>";

          // prev or next
          if (this.isOpen) {
            this.$modalInner2.fadeOut(300, function () {
              self.$modalTitle.text(title);
              self.$modalDesc.text(desc);
              self.$modalContents.html(html);
              self.$modalInner2.fadeIn(300);
            });
          } else {
            this.isOpen = true;
            this.$modalContents.html(html);
            this.$modalTitle.text(title);
            this.$modalDesc.text(desc);
            this.$modal.fadeIn(300).addClass("is-active");

            // background scroll disable
            this.scrollTop = $(window).scrollTop();
            $(window)
              .off("scroll.galleryModalScrollDisable")
              .on("scroll.galleryModalScrollDisable", function () {
                if ($(window).scrollTop() != galleryModal.scrollTop) {
                  $(window).scrollTop(galleryModal.scrollTop);
                }
              });
          }
          galleryModal.current = index;
        },

        // modal close
        close: function () {
          var self = this;
          this.$modal.fadeOut(300, function () {
            self.$modal.removeClass("is-active");
            self.$modalContents.html("");
            self.$modalTitle.text("");
            self.$modalDesc.text("");
          });
          this.isOpen = false;
          this.current = null;
          $(window).off("scroll.galleryModalScrollDisable");
        },

        // prev
        prev: function () {
          var index = this.current - 1;
          if (index < 0) {
            index = this.itemCount - 1;
          }
          this.open(index);
        },

        // next
        next: function () {
          var index = this.current + 1;
          if (index >= this.itemCount) {
            index = 0;
          }
          this.open(index);
        },
      };

      // click
      $(".p-entry-works__gallery .p-works-gallery__item a").click(function () {
        galleryModal.open($(this).closest(".p-works-gallery__item").index());
        return false;
      });
    }
  });
});
