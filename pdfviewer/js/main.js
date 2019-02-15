const url = "/pdfviewer/docs/pdf.pdf"; //file path

let pdfDoc = null,
  pageNum = 1,
  pageIsRendering = false,
  pageNumIsPanding = null;

const scale = 2.1,
  canvas = document.querySelector("#pdf-render"),
  ctx = canvas.getContext("2d");

// render the page
const renderPage = num => {
  pageIsRendering = true;

  //   Get Page
  pdfDoc.getPage(num).then(page => {
    // Set scale
    const viewport = page.getViewport({ scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderCtx = {
      canvasContext: ctx,
      viewport
    };
    page.render(renderCtx).promise.then(() => {
      pageIsRendering = false;
      if (pageNumIsPanding !== null) {
        renderPage(pageNumIsPanding);
        pageNumIsPanding = null;
      }
    });
    // Output Current Page
    document.querySelector("#page-num").textContent = num;
  });
};

// Check for pages rendering
const queRenderPage = num => {
  if (pageIsRendering) {
    pageNumIsPanding = num;
  } else {
    renderPage(num);
  }
};
// show Prev page
const showPrevPage = () => {
  if (PageNume <= 1) {
    return;
  }
  pageNum--;
  queRenderPage(pageNum);
};

// show Next page
const showNextPage = () => {
  if (pageNum >= pdfDoc.nnumPages) {
    return;
  }
  pageNum++;
  queRenderPage(pageNum);
};
// Get the ducument
pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
  pdfDoc = pdfDoc_;
  document.querySelector("#page-count").textContent = pdfDoc.numPages;
  renderPage(pageNum);
});

// button events
document.querySelector("#prev-page").addEventListener("click", showPrevPage);
document.querySelector("#next-page").addEventListener("click", showNextPage);
