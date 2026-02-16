// Smooth scrolling for navigation
document.querySelectorAll('.navbar a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        document.getElementById(targetId).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

let currentImageIndex = 0; // To track the currently displayed image
const galleryImages = document.querySelectorAll('.gallery .photo img');

function openImageModal(image) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const caption = document.getElementById('caption');

    // Find the index of the clicked image
    currentImageIndex = Array.from(galleryImages).indexOf(image);

    modal.style.display = 'block';
    modalImage.src = image.src;
    caption.textContent = image.alt;
}

function closeImageModal() {
    document.getElementById('imageModal').style.display = 'none';
}

function navigateImage(direction) {
    currentImageIndex += direction;

    // Wrap around if at the ends of the array
    if (currentImageIndex < 0) {
        currentImageIndex = galleryImages.length - 1;
    } else if (currentImageIndex >= galleryImages.length) {
        currentImageIndex = 0;
    }

    // Update the modal image and caption
    const modalImage = document.getElementById('modalImage');
    const caption = document.getElementById('caption');
    modalImage.src = galleryImages[currentImageIndex].src;
    caption.textContent = galleryImages[currentImageIndex].alt;
}
//Scroll to Top Button Logic
const scrollToTopBtn = document.getElementById("scrollToTop");

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.classList.add("show");
    } else {
        scrollToTopBtn.classList.remove("show");
    }
});

scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
});

// Modal Functionality
const modal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
let scale = 1;

// Show modal on background click
document.body.addEventListener('click', (e) => {
    if (!e.target.closest('header')) {
        modal.style.display = 'flex';
        scale = 1; // Reset zoom scale
        modalImage.style.transform = `scale(${scale})`;
    }
});

// Close modal
function closeModal() {
    modal.style.display = 'none';
}

// Zoom In
function zoomIn() {
    scale += 0.2;
    modalImage.style.transform = `scale(${scale})`;
}

// Zoom Out
function zoomOut() {
    if (scale > 0.4) { // Prevent zooming out too much
        scale -= 0.2;
        modalImage.style.transform = `scale(${scale})`;
    }
}
