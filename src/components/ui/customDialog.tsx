import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

type CustomDialogProp = {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  title: string;
  content: React.ReactNode;
};

export default function CustomDialog(props: CustomDialogProp) {
  return (
    /**
     * Boilerplate code from HeadlessUI. https://headlessui.com/react/dialog
     */
    <Transition appear show={props.isOpen} as={Fragment}>
      <Dialog as="div" onClose={() => props.setOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-md bg-secondary p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-semibold leading-6 text-gray-900"
                >
                  {props.title}
                </Dialog.Title>
                <div className="mt-4">{props.content}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
