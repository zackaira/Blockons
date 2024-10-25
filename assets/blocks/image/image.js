import showGalleryPopup from "../../popups/GalleryPopup";

document.addEventListener("DOMContentLoaded", () => {
  const isGlobal = document.body.classList.contains("blockons-popups") && document.body.classList.contains("global") ? true : false;
  // const popup = blockonsFrontendObj.blockonsOptions?.imagepopups;

  if (isGlobal) {
    const allImages = document.querySelectorAll(".wp-block-image");
    const filteredImages = Array.from(allImages).filter((image) => {
      return !image.closest("header") && 
        !image.closest("footer") && 
        !image.classList.contains("global-off") && 
        !image.querySelector("figure.global-off");
    });

    allImages.forEach((image) => {
      if (!filteredImages.includes(image)) {
        image.classList.remove("blockons-img-popup", "single", "gallery");

        const classListCopy = Array.from(image.classList);
        classListCopy.forEach((className) => {
            if (className.startsWith("blcks-")) image.classList.remove(className);
        });
      }
    });

    filteredImages.forEach((image) => {
        const imgTag = image.querySelector('img');
        if (imgTag) {
          // Create a new wrapper div
          const wrapper = document.createElement('div');
          wrapper.className = 'blockons-popup-img';

          // Insert the wrapper before the img tag
          imgTag.parentNode.insertBefore(wrapper, imgTag);

          // Move the img tag into the wrapper
          wrapper.appendChild(imgTag);
        }

        const classListCopy = Array.from(image.classList);
        classListCopy.forEach((className) => {
            if (className.startsWith("blcks-")) image.classList.remove(className);
        });
        image.classList.add("blockons-img-popup", "single");

        // Step 4: Check for the specific HTML structure and add data attributes
        const imgSrc = image.querySelector("img")?.src;
        const imgCaption = image.querySelector("figcaption")?.textContent || "";

        image.addEventListener("click", () => {
          // Show the gallery popup with the calculated start index
          showGalleryPopup({ images: [{ imageUrl: imgSrc, imageCaption: imgCaption }], startIndex: 0 }, true);
        });
    });
  } else {
    const blockonsSingleImgs = document.querySelectorAll(".blockons-img-popup");

    // Create a list of all images with their details
    const imagesArray = Array.from(blockonsSingleImgs).map((image) => {
      return {
        imageUrl: image.querySelector('img')?.src || "",
        imageCaption: image.querySelector('figcaption')?.textContent || "",
        galleryGroup: image.dataset?.gallery || "",  // Capture the data-gallery attribute
        element: image  // Keep a reference to the DOM element
      };
    }).filter(Boolean);

    if (blockonsSingleImgs.length) {
      blockonsSingleImgs.forEach((image) => {
        const isSingle = image.classList.contains("single");
        const isGallery = image.classList.contains("gallery");

        const imgTag = image.querySelector('img');
        if (imgTag) {
          // Create a new wrapper div
          const wrapper = document.createElement('div');
          wrapper.className = 'blockons-popup-img';

          // Insert the wrapper before the img tag
          imgTag.parentNode.insertBefore(wrapper, imgTag);

          // Move the img tag into the wrapper
          wrapper.appendChild(imgTag);
        }

        // Prepare a single image array if the current image isSingle
        const singleImageArray = [{
          imageUrl: image.querySelector('img')?.src || "",
          imageCaption: image.querySelector('figcaption')?.textContent || "",
        }];

        // Filter images belonging to the same gallery group
        const galleryImagesArray = imagesArray.filter(img => img.galleryGroup === image.dataset?.gallery);

        // Add click event listener to each image element
        image.addEventListener("click", () => {
          // If the image isSingle, show only the single image
          // If the image isGallery, show only images from the same gallery group
          // Otherwise, show the full gallery
          const imagesToShow = isSingle ? singleImageArray : (isGallery ? galleryImagesArray : imagesArray);

          // Calculate the correct startIndex based on the position within the current group
          let startIndex = 0;
          if (isGallery) {
            // Find the index of the clicked image within the galleryImagesArray
            startIndex = galleryImagesArray.findIndex(img => img.element === image);
          } else if (!isSingle) {
            // For the full gallery, calculate based on the overall index in imagesArray
            startIndex = imagesArray.findIndex(img => img.element === image);
          }

          // Show the gallery popup with the calculated start index
          showGalleryPopup({ images: imagesToShow, startIndex: startIndex }, isSingle);
        });
      });
    }
  }
});
