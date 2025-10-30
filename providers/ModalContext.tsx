import ErrorModal from "@/components/modals/ErrorModal"
import { createContext, ReactNode, useContext, useState } from "react"

type ModalContextType = {
    openModal: ({ title, msg }: { title: string, msg: string }) => void
    closeModal: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [visible, setVisible] = useState(false)
    const [modalProps, setModalProps] = useState<any>({})

    const openModal = ({ title, msg }: { title: string, msg: string }) => {
        setModalProps({ title, msg })
        setVisible(true)
    }

    const closeModal = () => setVisible(false)

    return (
        <ModalContext.Provider value={{openModal, closeModal}}>
            {children}
            <ErrorModal visible={visible} {...modalProps} onClose={closeModal}/>
        </ModalContext.Provider>
    )
}

export const useModal = () => {
    const context = useContext(ModalContext)
    if (!context) throw new Error("useModal musi być używany w ContextProvider");
    return context;
}