import ErrorModal from "@/components/modals/ErrorModal"
import InfoModal from "@/components/modals/InfoModal"
import InquiryModal from "@/components/modals/InquiryModal"
import { createContext, ReactNode, useContext, useState } from "react"


type ModalContextType = {
    openModal: ({ type, title, msg }: { type: string, title: string, msg?: string }) => Promise<void | boolean>
    closeModal: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [visible, setVisible] = useState(false)
    const [modalProps, setModalProps] = useState<any>({})
    const [modalType, setModalType] = useState<string|null>(null)
    const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null)

    const handleResponse = (answer: boolean) => {
        resolver?.(answer)
        closeModal()
    }

    const openModal = ({ type, title, msg }: { type: string, title: string, msg?: string }) => {
        setModalProps({ title, msg })
        setVisible(true)
        setModalType(type)

        if(type === 'inquiry') {
            return new Promise<boolean>(resolve => setResolver(() => resolve))
        }

        return Promise.resolve()
    }

    const closeModal = () => setVisible(false)

    const renderModal = () => {
        switch(modalType) {
            case "error":
                return <ErrorModal visible={visible} {...modalProps} onClose={closeModal}/>
            case "inquiry":
                return <InquiryModal visible={visible} {...modalProps} onResponse={handleResponse}/>
            case "info":
            default:
                return <InfoModal visible={visible} {...modalProps} onClose={closeModal}/>
        }
    }

    return (
        <ModalContext.Provider value={{openModal, closeModal}}>
            {children}
            {renderModal()}
        </ModalContext.Provider>
    )
}

export const useModal = () => {
    const context = useContext(ModalContext)
    if (!context) throw new Error("useModal musi być używany w ContextProvider");
    return context;
}