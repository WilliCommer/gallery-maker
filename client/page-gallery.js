import van from 'vanjs-core'
import * as vanB from 'vanjs-bootstrap'
import appCtrl from './app-ctrl.js';
import fs from './file-service.js'

const { div, dialog, img, input, textarea, button, span, label } = van.tags;

// 1. Reaktiver State
const imagesState = van.state([]);

const movingIndex = van.state(null); // Merker für Cut & Paste

// synchronize image list with project
const imageStateChange = ()=> {
  if(appCtrl.session?.project) {
    appCtrl.session.project.images = [...imagesState.val]
    appCtrl.changed('',true)
  }
}

// 2. Hilfsfunktionen
const moveItem = (fromIndex, toIndex) => {
  const list = [...imagesState.val];
  if (toIndex < 0 || toIndex >= list.length || fromIndex === toIndex) return;
  const [movedItem] = list.splice(fromIndex, 1);
  list.splice(toIndex, 0, movedItem);
  imagesState.val = list;
  movingIndex.val = null;
  imageStateChange()
};

const removeItem = (index) => {
  if (movingIndex.val === index) movingIndex.val = null;
  imagesState.val = imagesState.val.filter((_, idx) => idx !== index);
  imageStateChange()
};

const updateField = (index, key, value) => {
  imagesState.val[index][key] = value;
  if (key === "rotate") {
    imagesState.val = [...imagesState.val];
    imageStateChange()
  }
};



// fullscreen image dialog

const ModalStyle = () => {
  const s = van.tags.style();
  s.innerText = `
    .fullscreen-modal {
      border: none;
      padding: 0;
      margin: 0;
      width: 100vw;
      height: 100vh;
      max-width: 100vw;
      max-height: 100vh;
      background: rgba(0, 0, 0, 0.9);
      overflow: hidden;
    }
    .fullscreen-modal[open] {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .fullscreen-modal::backdrop {
      background: rgba(0, 0, 0, 0.9);
    }
    .fullscreen-modal img {
      max-width: 100vw;
      max-height: 100vh;
      object-fit: contain;
    }
    .fullscreen-modal img.rotated-sideways {
      max-width: 100vh;
      max-height: 100vw;
    }
    .fullscreen-modal-close {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 1;
      width: 2rem;
      height: 2rem;
      border: none;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      color: #fff;
      font-size: 1.75rem;
      line-height: 1;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }
    .fullscreen-modal-close:hover,
    .fullscreen-modal-close:focus-visible {
      background: rgba(255, 255, 255, 0.4);
      outline: 2px solid #fff;
      outline-offset: 2px;
    }
  `;
  return s;
};

const ModalImage = img({
  id: "gallery-list-modal-img",
  src: "",
  alt: "Vollbildansicht",
});

const CloseButton = button(
  {
    type: "button",
    class: "fullscreen-modal-close",
    "aria-label": "Schließen",
    onclick: (event) => {
      event.stopPropagation();
      hideFullscreen();
    },
  },
  vanB.Icon('CLOSE')
);

const ModalDialog = dialog(
  {
    id: "gallery-list-modal",
    class: "fullscreen-modal",
    "aria-label": "Vollbildansicht",
    onclick: () => hideFullscreen(),
  },
  CloseButton,
  ModalImage
);

function showFullscreen(src, rotate = 0) {
  const angle = ((Number(rotate) % 360) + 360) % 360;
  const isSideways = angle === 90 || angle === 270;

  ModalImage.setAttribute("src", src);
  ModalImage.style.transform = angle ? `rotate(${angle}deg)` : "none";
  ModalImage.classList.toggle("rotated-sideways", isSideways);
  ModalDialog.showModal();
}

function hideFullscreen() {
  ModalDialog.close();
}


// Hauptkomponente
const GalleryEditor = () => {

  imagesState.val = appCtrl.session?.project?.images || []

  return div(
    // Bilder-Liste
    () => {
      // const isCompact = compactMode.val;
      const isCompact = appCtrl.session.compactMode;
      const thumbSize = isCompact ? "50px" : "110px";

      if (imagesState.val.length === 0) {
        return div({ class: "alert alert-light text-center border py-5" },
          "Noch keine Bilder vorhanden. Klicke oben rechts auf „+ Bilder hinzufügen“."
        );
      }

      return div({ class: "list-group shadow-sm" },
        imagesState.val.map((item, idx) => {
          const isBeingMoved = movingIndex.val === idx;

          return div({
            class: `list-group-item d-flex gap-3 ${isCompact ? "align-items-center py-1" : "align-items-start py-3"} ${isBeingMoved ? "border-primary bg-primary-subtle" : ""}`
          },
            // 1. Sortier-Steuerung (im Kompaktmodus nebeneinander, sonst gestapelt)
            div({
              class: isCompact ? "d-flex align-items-center gap-1" : "d-flex flex-column align-items-center gap-1",
              style: isCompact ? "width: 195px;" : "width: 75px;"
            },
              input({
                type: "number",
                class: "form-control form-control-sm text-center fw-bold",
                style: isCompact ? "width: 55px;" : "width: 100%;",
                value: idx + 1,
                min: 1,
                max: imagesState.val.length,
                onchange: (e) => {
                  const targetPos = parseInt(e.target.value, 10) - 1;
                  if (!isNaN(targetPos)) moveItem(idx, targetPos);
                }
              }),
              div({ class: "btn-group btn-group-sm" },
                button({
                  class: "btn btn-outline-secondary",
                  disabled: idx === 0,
                  onclick: () => moveItem(idx, idx - 1),
                  title: "Nach oben"
                }, "↑"),
                button({
                  class: "btn btn-outline-secondary",
                  disabled: idx === imagesState.val.length - 1,
                  onclick: () => moveItem(idx, idx + 1),
                  title: "Nach unten"
                }, "↓")
              ),
              // Cut & Paste Button
              movingIndex.val === null
                ? button({
                    class: `btn btn-outline-primary btn-sm ${isCompact ? "" : "w-100 py-0 mt-1"}`,
                    style: "font-size: 0.75rem;",
                    onclick: () => (movingIndex.val = idx)
                  }, "Cut")
                : isBeingMoved
                  ? button({
                      class: `btn btn-secondary btn-sm ${isCompact ? "" : "w-100 py-0 mt-1"}`,
                      style: "font-size: 0.75rem;",
                      onclick: () => (movingIndex.val = null)
                    }, "Abbruch")
                  : button({
                      class: `btn btn-success btn-sm ${isCompact ? "" : "w-100 py-0 mt-1"}`,
                      style: "font-size: 0.75rem;",
                      onclick: () => moveItem(movingIndex.val, idx)
                    }, "Paste")
            ),

            // 2. Bild-Vorschau & Rotation
            div({ class: "d-flex flex-column align-items-center gap-1" },
              div({
                class: "bg-light border rounded d-flex align-items-center justify-content-center overflow-hidden",
                style: `width: ${thumbSize}; height: ${thumbSize}; transition: all 0.15s;`
              },
                img({
                  src: fs.getURL(item.img),
                  style: `max-width: 100%; max-height: 100%; object-fit: contain; transform: rotate(${item.rotate}deg); cursor: zoom-in;`,
                  onclick: () => showFullscreen( fs.getURL(item.img), item.rotate ),
                })
              ),
              !isCompact && button({
                class: "btn btn-outline-secondary btn-sm w-100 py-0",
                style: "font-size: 0.75rem;",
                onclick: () => updateField(idx, "rotate", (item.rotate + 90) % 360)
              }, `↻ ${item.rotate}°`)
            ),

            // 3. Text-Eingaben (im Kompaktmodus nur Titel als Text, sonst volle Felder)
            div({ class: "flex-grow-1" },
              isCompact
                ? div({ class: "d-flex flex-column" },
                    span({ class: "fw-semibold text-truncate" }, item.title || "(Ohne Titel)"),
                    item.comment && span({ class: "text-muted small text-truncate", style: "max-width: 450px;" }, item.comment)
                  )
                : [
                    input({
                      type: "text",
                      class: "form-control form-control-sm mb-2 fw-semibold",
                      placeholder: "Titel eingeben...",
                      value: item.title,
                      oninput: (e) => updateField(idx, "title", e.target.value)
                    }),
                    textarea({
                      class: "form-control form-control-sm",
                      rows: 2,
                      placeholder: "Optionale Beschreibung...",
                      value: item.comment,
                      oninput: (e) => updateField(idx, "comment", e.target.value)
                    })
                  ]
            ),

            // 4. Löschen-Button ganz rechts
            button({
              class: "btn btn-outline-danger btn-sm",
              title: "Bild aus Liste entfernen",
              onclick: () => removeItem(idx)
            }, "×")
          );
        })
      );
    },
    ModalStyle(),
    ModalDialog,
  );
};







export default GalleryEditor;
