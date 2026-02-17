import type { ReactNode } from 'react';
import { Button } from './button';

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export const Modal = ({ open, title, onClose, children }: ModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-base/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl bg-surface-elev/98 p-5 shadow-floating dark:bg-gradient-to-b dark:from-surface-elev dark:to-surface-elev/92">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
};
