import React from "react";

const SheetIdForm = ({ sheetId, changeHandler }) => {
    return (
        <div className="sheet-id-form">
            <h3>구글 시트 아이디</h3>
            <input type="text" value={sheetId} onChange={(e) => {
                changeHandler(e.target.value);
            }} />
        </div>
    );
}

export default SheetIdForm;