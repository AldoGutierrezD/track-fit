import { createPortal } from "react-dom";
import UserData from "./UserData";
import { X } from "lucide-react";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export function ModalUser({ isOpen, onClose }: ModalProps) {

    if (!isOpen) return null

    return createPortal(
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-10" onClick={onClose}>
            <div className="bg-transparent rounded-xl w-[90%] md:w-auto overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="w-full px-4 py-0 flex justify-end">
                    <button
                        onClick={onClose}
                        className="text-slate-950 hover:text-slate-800 cursor-pointer"
                    >
                        <X size={24} />
                    </button>
                </div>
                <div className="p-4">
                    <UserData />
                </div>
            </div>
        </div>,
        document.body
    )

}
