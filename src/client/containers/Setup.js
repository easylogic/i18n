import React, { useState, useEffect } from "react";
import axios from "axios";
import SheetIdForm from "../components/SheetIdForm";
import LanguagesForm from "../components/LanguagesForm";

const Setup = () => {
    const [existMetadata, setExistMetadata] = useState(false);
    const [sheetId, setSheetId] = useState("");
    const [languages, setLanguages] = useState([]);

    useEffect(() => {
        axios.get("/metadata").then(res => {
            setSheetId(res.data.sheetId);
            setLanguages(res.data.languages);
            setExistMetadata(res.data.sheetId !== "" && res.data.languages.length > 0);
        });
    }, []);

    return (
        <div>
            {
                !existMetadata ? 
                (
                    <div>
                        <SheetIdForm sheetId={sheetId} changeHandler={setSheetId}></SheetIdForm>
                        <LanguagesForm languages={languages} addHandler={setLanguages}></LanguagesForm>

                        <button onClick={() => {
                            axios.post("/metadata", {
                                sheetId: sheetId,
                                languages: languages
                            }).then(() => {
                                setExistMetadata(true);
                            });
                        }}>Submit</button>
                    </div>
                ) : <div>next step</div>
            }
        </div>
    )
}

export default Setup;