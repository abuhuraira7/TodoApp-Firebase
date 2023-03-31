import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from 'config/firebase'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from 'context/AuthContext'

const initialState = { email: "", password: "" }

export default function Login() {

    const { dispatch } = useContext(AuthContext)

    const navigate = useNavigate();

    const [state, setState] = useState(initialState)
    const [isProcessing, setIsProcessing] = useState(false)


    const handleChange = e => {
        let { name, value } = e.target
        setState(s => ({ ...s, [name]: value }))
    }

    const handleLogin = e => {
        e.preventDefault();

        let { email, password } = state
        console.log(email)
        console.log(password)

        setIsProcessing(true)

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                let user = userCredential.user
                // console.log(user)
                dispatch({ type: "LOGIN", payload: { user } })
                navigate("/dashboard")
            })
            .catch(err => {
                console.error(err)
            })
            .finally(() => {
                setIsProcessing(false)
            })
    }

    return (
        <div className="auth">
            <div className="container">
                <div className="row">
                    <div className="col-12 col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
                        <div className="card p-4">
                            <form onSubmit={handleLogin}>
                                <h2 className='my-3'>Login</h2>
                                <div className="input-group">
                                    <input type="email" name='email' required onChange={handleChange} />
                                    <label htmlFor="email">Email</label>
                                </div>
                                <div className="input-group">
                                    <input type="password" name='password' required onChange={handleChange} />
                                    <label htmlFor="password">Password</label>
                                </div>
                                <div className="remember">
                                    <label htmlFor="checkbox"><input type="checkbox" name='checkbox' /> Remember me</label>
                                </div>
                                <button disabled={isProcessing}>
                                    {!isProcessing
                                        ? "Login"
                                        : <div className='spinner-grow spinner-grow-sm'></div>
                                    }
                                </button>
                                <div className="Account-link">
                                    <Link to="/authentication/forgot-password">Forgot Password</Link>
                                </div>
                                <div className="Account-link">
                                    <p className='mb-0 text-dark'>Don't have an account? <Link to="/authentication/register">Register</Link></p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}