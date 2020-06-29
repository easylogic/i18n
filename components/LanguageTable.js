import React from 'react';

export default function LanguageTable({ messages=[] }) {
    const values = Object.values(messages) || [];

    let table = [['key', ...values.map((it) => it.key)]];

    if (values.length) {
        const keys = Object.keys(values[0])
            .filter((it) => it != 'key')
            .map((it) => it);

        keys.forEach((key) => {
            table.push([key, ...values.map((it) => it[key])]);
        });
    }

    return (
        <div>
            <table border="1">
                <thead>
                    <tr>
                        {table[0].map((it) => (
                            <th key={it}>{it}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {table
                        .filter((_, index) => index !== 0)
                        .map((it, index) => {
                            return (
                                <tr key={index}>
                                    {it.map((name) => (
                                        <td key={name}>{name}</td>
                                    ))}
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        </div>
    );
}
