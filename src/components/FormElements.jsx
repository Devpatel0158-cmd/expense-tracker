import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import { Tooltip } from 'react-tooltip';

export function Button({ children, onClick, className, tooltip }) {
  return (
    <>
      <motion.button
        onClick={onClick}
        className={`px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold shadow-lg hover:shadow-xl ${className}`}
        whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(255, 215, 0, 0.7)' }}
        whileTap={{ scale: 0.95 }}
        data-tooltip-id={tooltip ? `tooltip-${children}` : undefined}
        data-tooltip-content={tooltip}
      >
        {children}
      </motion.button>
      {tooltip && <Tooltip id={`tooltip-${children}`} />}
    </>
  );
}

export function Input({ value, onChange, placeholder, type = 'text', tooltip }) {
  return (
    <>
      <motion.input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-3 mb-4 border-none rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        whileFocus={{ scale: 1.02, boxShadow: '0 0 10px rgba(147, 51, 234, 0.7)' }}
        data-tooltip-id={tooltip ? `tooltip-${placeholder}` : undefined}
        data-tooltip-content={tooltip}
      />
      {tooltip && <Tooltip id={`tooltip-${placeholder}`} />}
    </>
  );
}

export function Modal({ triggerText, onConfirm, children, tooltip }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button className="mt-2" tooltip={tooltip}>{triggerText}</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        <Dialog.Content asChild>
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 p-6 rounded-xl shadow-2xl border-2 border-purple-500 w-[90%] max-w-md"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Dialog.Title className="text-2xl font-bold text-white mb-4">Confirm Action</Dialog.Title>
            {children}
            <div className="mt-6 flex justify-end space-x-4">
              <Dialog.Close asChild>
                <Button className="bg-gray-600 hover:bg-gray-700">Cancel</Button>
              </Dialog.Close>
              <Button onClick={() => { onConfirm(); setOpen(false); }} className="bg-red-600 hover:bg-red-700">
                Confirm
              </Button>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}