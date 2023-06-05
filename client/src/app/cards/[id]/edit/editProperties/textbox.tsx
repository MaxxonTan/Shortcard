`use client`;

import { Canvas, Textbox } from "fabric/fabric-impl";
import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { HiChevronUpDown, HiCheck } from "react-icons/hi2";

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

  function handleFontChange(newFont: string) {
    setSelectedFont(newFont);

    textbox.fontFamily = newFont;

    if (textbox.canvas) {
      textbox.canvas.discardActiveObject().renderAll();
      textbox.canvas.setActiveObject(textbox);
      textbox.canvas.requestRenderAll();
    }
  }

  useEffect(() => {
    setSelectedFont(textbox.fontFamily ?? "Times New Roman");
  }, [textbox]);

  return (
    // Code from https://headlessui.com/react/listbox.
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
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-secondary-dark py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
  );
}
