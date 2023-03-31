import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore/lite'
import { auth, firestore } from 'config/firebase'
import { AuthContext } from 'context/AuthContext'

const initialState = { email: "", password: "" }

export default function Register() {

    const { dispatch } = useContext(AuthContext)

    const [state, setState] = useState(initialState)
    const [isProcessing, setIsProcessing] = useState(false)


    const handleChange = e => {
        let { name, value } = e.target
        setState(s => ({ ...s, [name]: value }))
    }

    const handleRegister = e => {
        e.preventDefault();

        let { email, password } = state
        console.log(email)
        console.log(password)

        setIsProcessing(true)

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                let user = userCredential.user
                // console.log(user)

                addDocument(user)
                console.log("user created")
            })
            .catch(err => {
                console.error(err)
                setIsProcessing(false)
            })
    }

    const addDocument = async (user) => {
        try {
            await setDoc(doc(firestore, "users", user.uid), {
                firstName: "",
                lastName: "",
                dateCreated: serverTimestamp(),
                uid: user.uid,
            });
            console.log("user document created at firestore")
            dispatch({ type: "LOGIN", payload: { user } })
        }
        catch (err) {
            console.error(err)
        }
        setIsProcessing(false)
    }

    return (
        <div className="auth">
            <div className="container">
                <div className="row">
                    <div className="col-12 col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
                        <div className="card p-4">
                            <form onSubmit={handleRegister}>
                                <h2 className='my-3'>Register</h2>
                                {/* <div className="input-group">
                                    <input type="text" name='userName' required onChange={handleChange} />
                                    <label htmlFor="userName">Username</label>
                                </div> */}
                                <div className="input-group">
                                    <input type="email" name='email' required onChange={handleChange} />
                                    <label htmlFor="email">Email</label>
                                </div>
                                <div className="input-group">
                                    <input type="password" name='password' required onChange={handleChange} />
                                    <label htmlFor="password">Password</label>
                                </div>
                                <div className="remember">
                                    <label htmlFor="checkbox"><input type="checkbox" name='checkbox' /> I agree to the terms & conditions</label>
                                </div>
                                <button disabled={isProcessing}>
                                    {!isProcessing
                                        ? "Register"
                                        : <div className='spinner-grow spinner-grow-sm'></div>
                                    }
                                </button>
                                <div className="Account-link">
                                    <p className='mb-0 text-dark'>Already have an account? <Link to="/authentication/login">Login</Link></p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}