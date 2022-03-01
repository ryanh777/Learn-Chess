import React, { Component } from 'react';

interface Props {
    id?: number,
    firstName?: string,
    lastName?: string
}

class People extends Component<Props, {people: Props[]}> {
    constructor(props: Props) {
        super(props);
        this.state = {
            people: []
        }
    }

    componentDidMount() {
        fetch('/api')
        .then(res => res.json())
        .then(people => this.setState({people}, () => console.log("people fetched..", people)));
    }

    submitForm = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
            window.location.reload();
        } else {
            alert("First and Last names must be filled")
        }
    }
  
    render() {
        return (
            <div>
                <input type="text" id="first" name="firstName" placeholder='First Name'></input>
                <input type="text" id="last" name="lastName" placeholder='Last Name'></input>
                <button onClick={this.submitForm}>Submit</button>
                <h2>People</h2>
                {this.state.people.map(person => 
                    <li key={person.firstName}>{ person.firstName } { person.lastName } </li>
                )}
            </div>
        );
    }
}

export default People;