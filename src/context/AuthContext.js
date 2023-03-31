import React, { useReducer, useEffect, createContext} from 'react'
import { auth } from 'config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const AuthContext = createContext();

const initialState = { isAuthenticated: false, user: { uid: "" } }

const reducer = ((state, { type, payload }) => {
    switch (type) {
        case "LOGIN":
            return { isAuthenticated: true, user: payload.user }
        case "LOGOUT":
            return { isAuthenticated: false }
        default:
            return state
    }
})

export default function AuthContextProvider({ children }) {

    const [state, dispatch] = useReducer(reducer, initialState)
    // const [user, setUser] = useState({})

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // console.log(user)
                console.log("User is signed in")
                // setUser(user)
                dispatch({ type: "LOGIN", payload: { user } })
            } else {
                // setUser({})
                console.log("User is signed out")
            }
        });
    }, [])

    return (
        // <AuthContext.Provider value={{ ...state, dispatch, user }}>
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    )
}