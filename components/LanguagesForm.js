import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';

const LanguagesForm = ({ languages, addHandler }) => {
    const [language, setLanguage] = useState('');

    return (
        <div className="languages-form">
            <div>
                {languages.map((lang, i) => {
                    return <span key={i}>{lang} | </span>;
                })}
            </div>

            <TextField label="번역 언어 목록" required={true}
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
            />

            <button
                onClick={() => {
                    addHandler([...languages, language]);
                    setLanguage('');
                }}
            >
                추가
            </button>
        </div>
    );
};

export default LanguagesForm;
