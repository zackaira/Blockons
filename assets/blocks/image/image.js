import showGalleryPopup from "../../popups/GalleryPopup";

document.addEventListener("DOMContentLoaded", () => {
  const blockonsSingleImgs = document.querySelectorAll(".wp-block-image.blockons-popup");

  // Create a list of all images with their details
  const imagesArray = Array.from(blockonsSingleImgs).map((image) => {
    return {
      imageUrl: image.dataset?.href || "",
      imageCaption: image.dataset?.imgcaption || "",
      galleryGroup: image.dataset?.gallery || "",  // Capture the data-gallery attribute
      element: image  // Keep a reference to the DOM element
    };
  }).filter(Boolean);

  if (blockonsSingleImgs.length) {
    blockonsSingleImgs.forEach((image) => {
      const isSingle = image.classList.contains("blockons-img-single");
      const isGallery = image.classList.contains("blockons-img-gal");

      // Prepare a single image array if the current image isSingle
      const singleImageArray = [{
        imageUrl: image.dataset?.href || "",
        imageCaption: image.dataset?.imgcaption || "",
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
});
