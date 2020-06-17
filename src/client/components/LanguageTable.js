import React, { useState, useEffect } from "react";
import axios from "axios";


export default function LanguageTable () {
    const [isLoading, setLoading] = useState(false);
    const [messages, setMessages] = useState({});

    useEffect(() => {
        if (isLoading === false) {
            axios.get("/messages").then(res => {
                setLoading(true);
                setMessages(res.data);
            });
        }
    },[isLoading])

    const values = Object.values(messages) || [];

    let table = [
        [ "key", ...values.map(it => it.key)],
    ]

    if (values.length) {

        const keys = Object.keys(values[0]).filter(it => it != 'key').map(it => it);
    
        keys.forEach(key => {
            table.push([
                key,
                ...values.map(it => it[key])
            ])
        })   
    }


    return isLoading === false ? 
            <React.Fragment></React.Fragment>
         : (
        <div>
            <table border="1">
            <thead>
                <tr>
                {table[0].map(it => <th key={it}>{it}</th>)}
                </tr>
            </thead>
            <tbody>
                {table.filter((_, index) => index !== 0).map((it, index) => {
                    return <tr key={index}>
                        {it.map(name => <td key={name}>{name}</td>)}
                    </tr>
                })}
            </tbody>
            </table>
        </div>
    );
}