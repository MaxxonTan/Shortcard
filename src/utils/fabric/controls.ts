import { fabric } from "fabric";
import avatarImage from "../../../public/avatar.png";

/**
 * Generates a textbox with custom control for deleting the object.
 * @returns A Fabric.Textbox object.
 */
export function generateTextboxObject() {
  const textbox = new fabric.Textbox("text", { left: 100, top: 100 });
  textbox.controls["tr"] = generateDeleteControl();
  textbox.controls["tl"] = generateCloneControl();

  return textbox;
}

/**
 * Generates a Fabric.Image object with custom controls.
 * @param imageElement The HTML image element for the Fabric.Image object.
 * @returns A Fabric.Image object.
 */
export function generateImageObject(imageElement: HTMLImageElement) {
  const image = new fabric.Image(imageElement, {
    centeredScaling: true,
    scaleX: 0.1,
    scaleY: 0.1,
    cornerSize: 24,
  });

  image.controls["tr"] = generateDeleteControl();
  image.controls["tl"] = generateCloneControl();

  return image;
}

export function generateDeleteControl() {
  return new fabric.Control({
    x: 0.5,
    y: -0.5,
    cursorStyle: "pointer",
    mouseUpHandler(eventData, transform, x, y) {
      const target = transform.target;
      const canvas = target.canvas;

      if (canvas) {
        canvas.remove(target);
        canvas.requestRenderAll();

        return true;
      }

      return false;
    },
    render(ctx, left, top, styleOverride, fabricObject) {
      const deleteImg = document.createElement("img");
      deleteImg.src = deleteIcon;

      deleteImg.onload = () => {
        const size = 22;
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle ?? 0));
        ctx.drawImage(deleteImg, -size / 2, -size / 2, size, size);
        ctx.restore();
      };
    },
  });
}

export function generateCloneControl() {
  return new fabric.Control({
    x: -0.5,
    y: -0.5,
    cursorStyle: "pointer",
    mouseUpHandler(eventData, transform, x, y) {
      const target = transform.target;
      const canvas = target.canvas;

      target.clone((cloned: fabric.Object) => {
        if (cloned.left && cloned.top) {
          cloned.left += 10;
          cloned.top += 10;
        }
        canvas?.add(cloned);
        canvas?.setActiveObject(cloned);

        return true;
      });

      return false;
    },
    render(ctx, left, top, styleOverride, fabricObject) {
      const deleteImg = document.createElement("img");
      deleteImg.src = `data:image/svg+xml;utf8,${cloneIcon}`;

      deleteImg.onload = () => {
        const size = 22;
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle ?? 0));
        ctx.drawImage(deleteImg, -size / 2, -size / 2, size, size);
        ctx.restore();
      };
    },
  });
}

const deleteIcon =
  "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

const cloneIcon = encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M64 464H288c8.8 0 16-7.2 16-16V384h48v64c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h64v48H64c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16zM224 352c-35.3 0-64-28.7-64-64V64c0-35.3 28.7-64 64-64H448c35.3 0 64 28.7 64 64V288c0 35.3-28.7 64-64 64H224z"/></svg>'
);
