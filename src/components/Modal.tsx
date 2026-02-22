import { createPortal } from "react-dom";
import { X } from "lucide-react";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: String,
    children: React.ReactNode;
};

export function Modal({ isOpen, onClose, title, children }: ModalProps) {

    if (!isOpen) return null

    return createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10" onClick={onClose}>
            <div className="bg-white rounded-xl w-auto overflow-hidden border-3" onClick={(e) => e.stopPropagation()}>
                <div className="w-full bg-[#fae1a0] p-4 border-b-3 flex justify-between">
                    <h4 className="font-bold">{title}</h4>
                    <button
                        onClick={onClose}
                        className="text-slate-950 hover:text-slate-800 cursor-pointer"
                    >
                        <X size={24} />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    )

}
