import React, {useState, useEffect} from 'react'
import Dashboard from '../Dashboard'
import ProgramCard from '../../cards/ProgramCard'
import styled from 'styled-components'

import firebase from "firebase/app";
import "firebase/auth";

export default function Schedule() {
    const user = firebase.auth().currentUser
    var userEmail = user.email

    const [admins, setAdmins] = useState([])
    const [userComingPrograms, setUserComingPrograms] = useState([])
    const [userLeavingPrograms, setUserLeavingPrograms] = useState([])
    const [allComingPrograms, setAllComingPrograms] = useState([])
    const [allLeavingPrograms, setAllLeavingPrograms] = useState([])

    //Getting list of all admin emails from API call 
    useEffect(() => {
        fetch(`/admin`).then(response =>
            response.json()).then(data => {
                setAdmins(data);
            });
    }, []);

    // Getting programs that are coming are leaving soon that are offered by services the user logged in is subscribed 
    //to from API call (will be used when user is not an admin)
    useEffect(() => {
        fetch(`/userprogramschedule?Email=${userEmail}`).then(response =>
            response.json()).then(data => {
                setUserComingPrograms(data['comingsoon']);
                setUserLeavingPrograms(data['leavingsoon']);
            });
    }, []);

    // Getting all programs that are coming are leaving soon that are offered by services from API call (will be used when user is an admin)
    useEffect(() => {
        fetch(`/allprogramschedule`).then(response =>
            response.json()).then(data => {
                setAllComingPrograms(data['comingsoon']);
                setAllLeavingPrograms(data['leavingsoon']);
            });
    }, []);

    // Checking if user logged in is an admin and display the corresponding results 
    if (!(admins.some(admin => admin.Email === userEmail))){
        return (
            <>
                <Dashboard/>
                <Header>
                    <h1 >Coming Soon</h1>
                </Header>
                <Scroll><ProgramCard programs={userComingPrograms}/></Scroll>
                <Header2>
                    <h1>Leaving Soon</h1>
                </Header2>
                <Scroll><ProgramCard programs={userLeavingPrograms}/></Scroll>
            </>
        )
    } else {
        return (
            <>
                <Dashboard/>
                <Header>
                    <h1 >Coming Soon</h1>
                </Header>
                <Scroll><ProgramCard programs={allComingPrograms}/></Scroll>
                <Header2>
                    <h1>Leaving Soon</h1>
                </Header2>
                <Scroll><ProgramCard programs={allLeavingPrograms}/></Scroll>
            </>
        )
    }
}

const Header = styled.div`
    margin-left: 240px; 
    margin-top: 70px;
`
const Header2 = styled.div`
    margin-left: 240px; 
    margin-top: 50px;
`

/*
 * References: 
 * Making Scrollable sections within a page: 
 *      How To Make A Div Vertically Scrollable Using CSS https://www.youtube.com/watch?v=uB1KzjV0IhM 
 */
const Scroll = styled.div`
    height: 400px; 
    overflow: hidden; 
    overflow-y: auto; 
`
