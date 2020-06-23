import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SheetIdForm from '../components/SheetIdForm';
import LanguagesForm from '../components/LanguagesForm';
import LanguageTable from '../components/LanguageTable';

const Setup = () => {
    const [existMetadata, setExistMetadata] = useState(false);
    const [sheetId, setSheetId] = useState('');
    const [languages, setLanguages] = useState([]);

    useEffect(() => {
        axios.get('/api/metadata').then((res) => {
            setSheetId(res.data.sheetId);
            setLanguages(res.data.languages);
            setExistMetadata(res.data.sheetId !== '' && res.data.languages.length > 0);
        });
    }, []);

    return (
        <div>
            {!existMetadata ? (
                <div>
                    <SheetIdForm sheetId={sheetId} changeHandler={setSheetId}></SheetIdForm>
                    <LanguagesForm languages={languages} addHandler={setLanguages}></LanguagesForm>

                    <button
                        onClick={() => {
                            axios
                                .post('/metadata', {
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
                <LanguageTable />
            )}
        </div>
    );
};

export default Setup;
