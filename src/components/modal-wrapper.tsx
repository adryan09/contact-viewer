import React, {FC, memo, useCallback, useContext, useMemo, useState} from 'react';
import {ContactContext, ContactContextModel} from '../context/contacts-context';
import {ModalControlLayer} from './modal-control-layer';
import {ModalContactsForm} from "./modal-contacts-form";

interface ModalWrapperPublicProps {
    readonly contactId: number | undefined;
    readonly showModal: boolean;
    readonly closeModal: () => void;
}
export enum ScreenTypes {
    ADD = "Add",
    EDIT = "Edit",
    NONE = ""
}

const ModalWrapper: FC<ModalWrapperPublicProps> = memo(function ModalWrapperComponent(
    { contactId, showModal, closeModal }: ModalWrapperPublicProps) {
    const { removeContact }: ContactContextModel = useContext(ContactContext) as ContactContextModel;

    const [screenType, setScreenType] = useState<ScreenTypes>(ScreenTypes.NONE);

    const handleAddOnClick = useCallback(() => {
        setScreenType(ScreenTypes.ADD);
    }, []);

    const handleEditOnClick = useCallback(() => {
        setScreenType(ScreenTypes.EDIT);
    }, []);

    const handleRemoveOnClick = useCallback(() => {
        if (contactId) removeContact(contactId);
    }, [contactId, removeContact]);

    const handleOnClose = useCallback(() => {
        closeModal();
        setScreenType(ScreenTypes.NONE);
    }, [closeModal]);

    return (
        <>
            {showModal && (
                <div className='modal-wrapper'>
                    {screenType === ScreenTypes.NONE && contactId && showModal && (
                        <ModalControlLayer
                            onClickAdd={handleAddOnClick}
                            onClickEdit={handleEditOnClick}
                            onClickRemove={handleRemoveOnClick}
                            id={contactId}
                            onClose={handleOnClose}
                        />
                    )}
                    {showModal && <ModalContactsForm
                        contactId={contactId}
                        isAddMode={screenType === 'Add'}
                        closeModal={handleOnClose}
                        screenType={screenType}
                    />}
                </div>
            )}
        </>

    )
});

export default ModalWrapper;