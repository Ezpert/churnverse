import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: ConfirmationModalProps) => {
  return (
    // 2. The main Dialog component. 'open' and 'onClose' are the key props.
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* 3. The backdrop, with its own transition classes */}
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 duration-300 ease-out data-[closed]:opacity-0"
      />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        {/* 4. The actual dialog panel, with its own transition classes */}
        <DialogPanel
          transition
          className="w-full max-w-md transform space-y-4 rounded-2xl bg-white p-6 text-left align-middle shadow-xl duration-300 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900">
            {title}
          </DialogTitle>
          <div className="mt-2">
            <p className="text-sm text-gray-500">{message}</p>
          </div>
          <div className="mt-4 flex justify-end gap-4">
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none"
              onClick={onConfirm}
            >
              Yes, Delete
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default ConfirmationModal;
