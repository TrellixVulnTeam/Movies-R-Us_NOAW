import React, { useRef, useState, useEffect } from 'react'
import firebase from "firebase/app";
import "firebase/auth";

import { Form, Button, Card, Alert } from 'react-bootstrap'
import { Link, useHistory } from "react-router-dom"
import Dashboard from '../Dashboard'

export default function ProfileEdit() {
    var user = firebase.auth().currentUser;
    var userEmail = user.email;

    const [userDetails, setUserDetails] = useState([]);

    const passwordRef = useRef()
    const nameRef = useRef()
    const [name, setName] = useState('')
    const usernameRef = useRef()
    const [username, setUsername] = useState('')
    const ageRef = useRef()
    const [age, setAge] = useState(0)
    const genderRef = useRef()
    const [gender, setGender] = useState('')
    const languageRef = useRef()
    const [language, setLanguage] = useState('')
    const [error, setError] = useState('')
    // const [loading, setLoading] = useState(false)
    const history = useHistory()

    useEffect(() => {
        fetch(`/profile?Email=${userEmail}`).then(response =>
            response.json()).then(data => {
                console.log(data)
                setUserDetails([data['userInfo']])
            });
    }, []);

    async function updateUserDatabase() {
        if (nameRef.current.value === '') {
            setName(userDetails.map(a => a.Name));
        } else {
            setName(nameRef.current.value)
        }
        if (usernameRef.current.value !== '') {
            setUsername(usernameRef.current.value)
        } else {
            setUsername(userDetails.map(a => a.Username))
        }
        if (ageRef.current.value !== '') {
            setAge(parseInt(ageRef.current.value))
        } else {
            setAge(userDetails.map(a => a.Age))
        }
        if (genderRef.current.value !== '') {
            setGender(genderRef.current.value)
        } else {
            setGender(userDetails.map(a => a.Gender))
        }
        if (languageRef.current.value !== '') {
            setLanguage(languageRef.current.value)
        } else {
            setLanguage(userDetails.map(a => a.Language))
        }
        if (passwordRef.current.value !== '') {
            user.updatePassword(passwordRef.current.value).then(function () {
                console.log("Update successful.")
            }).catch(function (error) {
                console.log("An error happened.")
            });
        }
        // console.log(age)
        // console.log(name)
        // console.log(username)
        // console.log(userEmail)
        // console.log(gender)
        const request = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Name: name,
                Username: username,
                Email: userEmail,
                Age: age,
                Gender: gender,
                Language: language
            })
        }
        await fetch('/profile-edit', request).then(response => {
            if (response.ok) {
                console.log('User updated')
                return history.push("/profile")
            }
        });
    }

    return (
        <>
            <Dashboard />
            <Card className="d-flex align-items-center justify-content-center"
                style={{ minHeight: "100vh" }}>
                <div className="w-100" style={{ maxWidth: '400px' }}>
                    <Card.Body>
                        <h2 className="text-center mb-4">Edit Profile</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form>
                            {/* Name */}
                            <Form.Group id="name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" ref={nameRef} />
                            </Form.Group>
                            {/* Username */}
                            <Form.Group id="username">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text" ref={usernameRef} />
                            </Form.Group>
                            {/* Age */}
                            <Form.Group id="age">
                                <Form.Label>Age</Form.Label>
                                <Form.Control type="text" ref={ageRef} />
                            </Form.Group>
                            <Form.Group id="gender">
                                <Form.Label>Gender</Form.Label>
                                <Form.Control type="text" ref={genderRef} />
                            </Form.Group>
                            <Form.Group id="language">
                                <Form.Label>Language</Form.Label>
                                <Form.Control type="text" ref={languageRef} />
                            </Form.Group>
                            {/* Password */}
                            <Form.Group id="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" ref={passwordRef} />
                            </Form.Group>
                            <Button className="w-100" onClick={updateUserDatabase}>Sign Up</Button>
                        </Form>
                    </Card.Body>
                    <div className="w-100 text-center mt-2">
                        Don't want to edit profile? <Link to="/profile">Cancel</Link>
                    </div>
                </div>
            </Card>
        </>
    )
}