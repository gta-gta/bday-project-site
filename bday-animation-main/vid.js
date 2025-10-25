const button = document.querySelector('.expandbtn');
const videosect = document.querySelector('.videosec');


button.addEventListener('click',()=>{
    videosect.classList.toggle('active');
    window.scrollBy({
        top: 400, // Scroll up by 200 pixels
        behavior: 'smooth',// Smooth scrolling animation
    });
})