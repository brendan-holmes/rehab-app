import React, { useRef } from 'react';
import { useOnClickOutside } from 'usehooks-ts';

interface IModalProps {
    closeModal: () => void;
    children: React.ReactNode;
}

export function Modal(props: IModalProps) {

    const ref = useRef(null);
    useOnClickOutside(ref, props.closeModal);

    return (
        // Full screen
        // <div className="fixed h-screen w-screen bg-gray-500 opacity-50 flex justify-center items-center">
            
            // {/* Modal */}
            <div className="absolute p-2 bg-blue-500 radius-5px border-none h-[80vh] w-[80vw] md:h-[50vh] md:w-[50vw]">
                
                {/* Close button */}
                <button onClick={props.closeModal} className="block ml-auto mr-0 bg-none border-none cursor-pointer text-base">Close ✕</button>
                
                {/* Text */}
                <div className="p-5 flex flex-col items-center h-full justify-around">
                    {props.children}
                </div>

            </div>
        // </div>
    );
}
