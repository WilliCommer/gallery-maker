
export default function createGallerieIndexHTML(gallery, template) {

    var thumbList = '';
    var carouselContent = '';
    var pageTitle = gallery.title;
    var imgPath = gallery.imgPath;
    if(imgPath && imgPath[imgPath.length-1] !== '/') imgPath += '/';

    gallery.images.forEach((image, index) => {
        let caption = image.title || '';
        let comment = image.comment || '';
        let img = imgPath + image.img;
        let alt = image.alt || image.description || [caption, comment].filter(Boolean).join('. ');
        thumbList += thumbnailItem({...image, img, alt, index});
        carouselContent += carouselItem({...image, img, alt, caption, comment, index})
    });

    const htmlText = template.replace('{{pageTitle}}', pageTitle)
        .replace('{{carouselContent}}', carouselContent)
        .replace('{{thumbList}}', thumbList)
        
    return htmlText;
}


const rotateStyle = rotate => rotate ? `style="transform: rotate(${rotate}deg);"` : '';

function accessibleAltText(alt) {
    return (alt || 'Galeriebild')
        .replace(/["']/g, '')
        .replace(/^(?:image|picture)\s+of\s+/i, '')
        .trim();
}

function carouselItem({index, img, alt, caption, comment, rotate}) {

    const captinHtml = caption || comment ?
`
            <div class="carousel-caption">
                <h4 class="carousel-caption-text">${caption || ''}</h5>
                <p class="carousel-caption-comment">${comment || ''}</p>
            </div>
` : '';

    const onclickTxt = rotate 
      ? `"showFS('${img}',${rotate})"`
      : `"showFS('${img}')"`

    return `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
            <img src="${img}" alt="${accessibleAltText(alt)}" onclick=${onclickTxt} ${rotateStyle(rotate)}>
            ${captinHtml}
        </div>
`;
}        

function thumbnailItem({index, img, alt, rotate}) {
    return `
        <img src="${img}" alt="${accessibleAltText(alt)}" class="thumb-item" onclick="thumbImgClick('${index}')" ${rotateStyle(rotate)}></img>`;
}
