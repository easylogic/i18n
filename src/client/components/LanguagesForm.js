import React, { useState } from 'react';

const LanguagesForm = ({ languages, addHandler }) => {
    const [language, setLanguage] = useState('');

    return (
        <div className="languages-form">
            <h3>번역 언어</h3>
            <div>
                {languages.map((lang, i) => {
                    return <span key={i}>{lang} | </span>;
                })}
            </div>

            <input type="text" value={language} onChange={(e) => setLanguage(e.target.value)} />
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
