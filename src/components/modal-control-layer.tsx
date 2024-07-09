import React, { FC, memo } from 'react';


interface ModalPublicModel {
    readonly id: number;
    onClickAdd: () => void;
    onClickEdit: () => void;
    onClickRemove: () => void;
    readonly onClose: () => void;
}

export const ModalControlLayer: FC<ModalPublicModel> = memo(function ModalComponent({
        onClickAdd,
        onClickEdit,
        onClickRemove,
        onClose,
    }: ModalPublicModel) {

    return (
        <div className="modal">
            <div className='modal-content'>
                <div className="modal-buttons-container">
                    <button onClick={onClickAdd}>Add a new contact</button>
                    <button onClick={onClickEdit}>Edit contact</button>
                    <button onClick={onClickRemove}>Delete contact</button>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    )
});
