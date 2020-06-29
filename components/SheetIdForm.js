import React from 'react';
import TextField from '@material-ui/core/TextField';

const SheetIdForm = ({ sheetId, changeHandler }) => {
    return (
        <div className="sheet-id-form">
            <TextField label="구글 문서 ID" required={true} 
                value={`${sheetId}`}
                onChange={(e) => { 
                    changeHandler(e.target.value);
                }}
            />
        </div>
    );
};

export default SheetIdForm;
