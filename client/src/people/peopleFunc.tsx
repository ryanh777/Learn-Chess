import React, { useEffect, useState } from 'react'

interface Props {
    firstName?: string,
    lastName?: string
}

export default function PeopleFunc() {
    const [people, setPeople] = useState<Props[]>([]);

    useEffect(() => {
        fetch('/api')
        .then(res => res.json())
        .then(people => setPeople(people));
        console.log("fetch called")
    })

    function submitForm(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();

        const first = (document.getElementById('first') as HTMLInputElement);
        const second = (document.getElementById('last') as HTMLInputElement);

        if (first.value && second.value) {
            const data = {
                firstName: first.value,
                lastName: second.value
            }

            fetch('/api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                  },
                body: JSON.stringify(data),
            })
            .then(res => res.json())
            .then(data => {
                console.log('Data:', data);
            })
            .catch((err) => {
                console.error('Error:', err);
            });
            // window.location.reload();
        } else {
            alert("First and Last names must be filled")
        }
    }

    return (
        <div>
            <input type="text" id="first" name="firstName" placeholder='First Name'></input>
            <input type="text" id="last" name="lastName" placeholder='Last Name'></input>
            <button onClick={submitForm}>Submit</button>
            <h2>People</h2>
            {people.map(person => 
                <li key={person.firstName}>{ person.firstName } { person.lastName } </li>)}
        </div>
    );
}