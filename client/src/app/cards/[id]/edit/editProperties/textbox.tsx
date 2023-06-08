`use client`;

import { Canvas, Textbox } from "fabric/fabric-impl";
import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";

import { HiChevronUpDown, HiCheck } from "react-icons/hi2";
import { GrBold, GrItalic, GrUnderline } from "react-icons/gr";
import Button from "@/components/ui/button";

type TextboxPropertiesProp = {
  textbox: Textbox;
};

const availableFontFamilies = [
  "Times New Roman",
  "Arial",
  "Courier New",
  "Calibri",
];

export default function TextboxProperties({ textbox }: TextboxPropertiesProp) {
  const [selectedFont, setSelectedFont] = useState(availableFontFamilies[0]);
  const [isBolded, setIsBolded] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderlined, setIsUnderlined] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [textColor, setTextColor] = useState("#000000");

  function handleFontChange(newFont: string) {
    setSelectedFont(newFont);

    textbox.fontFamily = newFont;

    // Maybe use decorators to re-render after every change?
    if (textbox.canvas) {
      textbox.canvas.setActiveObject(textbox);
      textbox.canvas.requestRenderAll();
    }
  }

  function handleTextFormatting(textType: "bold" | "italic" | "underlined") {
    switch (textType) {
      case "bold":
        setIsBolded(!isBolded);

        isBolded
          ? (textbox.fontWeight = "normal")
          : (textbox.fontWeight = "bold");
        break;
      case "italic":
        setIsItalic(!isItalic);

        isItalic
          ? (textbox.fontStyle = "normal")
          : (textbox.fontStyle = "italic");
        break;
      case "underlined":
        setIsUnderlined(!isUnderlined);

        // textbox.underline = true doesn't work here for some reason.
        isUnderlined
          ? textbox.set("underline", false)
          : textbox.set("underline", true);
        break;
    }

    if (textbox.canvas) {
      textbox.canvas.setActiveObject(textbox);
      textbox.canvas.requestRenderAll();
    }
  }

  function handleFontSizeChange(newFontSize: number) {
    setFontSize(newFontSize);

    textbox.fontSize = newFontSize;
    if (textbox.canvas) {
      textbox.canvas.setActiveObject(textbox);
      textbox.canvas.requestRenderAll();
    }
  }

  function handleColorChange(newColor: string) {
    setTextColor(newColor);

    textbox.set("fill", newColor);
    if (textbox.canvas) {
      textbox.canvas.setActiveObject(textbox);
      textbox.canvas.requestRenderAll();
    }
  }

  /**
   * Grab textbox properties every user selects a textbox
   */
  useEffect(() => {
    setSelectedFont(textbox.fontFamily ?? "Times New Roman");

    textbox.fill && setTextColor(textbox.fill.toString());
    textbox.fontSize && setFontSize(textbox.fontSize);
    textbox?.fontWeight === "normal" ? setIsBolded(false) : setIsBolded(true);
    textbox?.fontStyle === "normal" ? setIsItalic(false) : setIsItalic(true);
    textbox?.underline === true
      ? setIsUnderlined(true)
      : setIsUnderlined(false);
  }, [textbox]);

  return (
    <div className="flex flex-col gap-2">
      {/* Code from https://headlessui.com/react/listbox. */}
      <Listbox
        value={selectedFont}
        onChange={(newFont) => handleFontChange(newFont)}
      >
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-pointer rounded-md bg-secondary-dark py-2.5 pl-3 pr-10 text-left sm:text-sm">
            <span className="block truncate">{selectedFont}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <HiChevronUpDown
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-secondary-dark py-1 text-base ring-1 ring-neutral-black sm:text-sm">
              {availableFontFamilies.map((font) => (
                <Listbox.Option
                  key={font}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active ? " text-primary" : "text-gray-900"
                    }`
                  }
                  value={font}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {font}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                          <HiCheck className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      <div className="flex w-full gap-1">
        {/* Text Formatting */}
        <Button
          color={isBolded ? "Primary" : "Secondary"}
          onClick={() => handleTextFormatting("bold")}
          leftIcon={<GrBold />}
        />
        <Button
          color={isItalic ? "Primary" : "Secondary"}
          onClick={() => handleTextFormatting("italic")}
          leftIcon={<GrItalic />}
        />
        <Button
          color={isUnderlined ? "Primary" : "Secondary"}
          onClick={() => handleTextFormatting("underlined")}
          leftIcon={<GrUnderline />}
        />
        {/* Text Color */}
        <Button
          color="Secondary"
          onClick={() => {}}
          horizontalPadding="px-1"
          leftIcon={
            <input
              type="color"
              className="rounded-md bg-secondary-dark"
              value={textColor}
              onChange={(e) => handleColorChange(e.target.value)}
            />
          }
        />

        {/* Font Size */}
        <input
          type="number"
          className="w-full rounded-md bg-secondary-dark px-2 font-bold text-primary outline-none ring-neutral-black transition-all focus:ring-1"
          aria-label="Font Size"
          value={fontSize}
          onChange={(e) => handleFontSizeChange(e.currentTarget.valueAsNumber)}
          min={1}
          max={256}
        />
      </div>
    </div>
  );
}
