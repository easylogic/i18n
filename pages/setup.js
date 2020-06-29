import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SheetIdForm from '../components/SheetIdForm';
import LanguagesForm from '../components/LanguagesForm';
import LanguageTable from '../components/LanguageTable';

function Setup(props) {
    const [ sheetId, setSheetId ] = useState(props.sheetId || '');
    const [ languages, setLanguages ] = useState(props.languages || []);
    const [ existMetadata, setExistMetadata ] = useState(props.existMetadata || false);

    return (
        <div>
            {!existMetadata ? (
                <div>
                    <SheetIdForm sheetId={sheetId} changeHandler={setSheetId}></SheetIdForm>
                    <LanguagesForm languages={languages} addHandler={setLanguages}></LanguagesForm>

                    <button
                        onClick={() => {
                            axios
                                .post('/api/metadata', {
                                    sheetId: sheetId,
                                    languages: languages,
                                })
                                .then(() => {
                                    setExistMetadata(true);
                                });
                        }}
                    >
                        Submit
                    </button>
                </div>
            ) : (
                <LanguageTable messages={props.messages} />
            )}
        </div>
    );
};

export default Setup;
