import React, { useEffect, useState } from 'react';
import {onAuthStateChanged, signInWithPopup, signOut} from "firebase/auth";
import {provider, auth, database} from "../firebaseConfig.js";
import {getData} from "../firebaseFunctions.js";
import { useResetRecoilState, useSetRecoilState } from 'recoil';
import { allowedUsersLogin, userLoginState } from '../recoil/atom.jsx';

const logout = async (auth) => {
  try {
    console.log("Logging out...");
    await signOut(auth); // Đảm bảo signOut hoàn thành
    console.log("Logout successful.");
  } catch (error) {
    console.log("Logout failed:", error.message); // Thêm logging chi tiết để debug
  }
};

const login = async (setUserState) => {
  try {
    console.log("Popup opening...")
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const userEmail = user.email;
    const acceptedEmailsString= await getData(database, 'acceptedEmail');

    if(!acceptedEmailsString) await logout(auth); 

    const acceptedEmailsArray = acceptedEmailsString.split(',');

    if (acceptedEmailsArray.includes(userEmail)) {
      console.log("Login successful. Email is accepted:", userEmail);
      // Proceed with your app logic here
    } else {
      console.log("Login failed. Email not accepted:", userEmail);
      await logout(auth)
    } 
    setUserState(user);
  } catch (error) {
    console.error("Error during login:", error.message);
  }
};

  
const WithAuthentication = ({ children }) => {
  const [user, setUser] = useState(null);
  const setUserState = useSetRecoilState(userLoginState);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        
      } else {
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    login(setUserState);
  };

  return (
    <div>
      {user ? (
        children
      ) : (
        <LoginModal handleLogin={handleLogin}/>
      )}
    </div>
  );
};

export default WithAuthentication;

const LoginModal = ({handleLogin}) => {

  return (
    <div style={styles.backdrop}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Login</h2>
        <button style={styles.button} onClick={handleLogin}>
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
          </svg> <span style={{paddingLeft:'10px'}}>Login with Google</span>
        </button>
      </div>
    </div>
  );
};

const styles = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '5px',
    width: '300px',
    textAlign:'center',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection:'column'
  },
  title: {
    marginTop: 0,
    color: '#333',
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    color: '#000000',
    border: '1px solid gray',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '10px 0',
    fontSize: '16px',
  },
  closeButton: {
    backgroundColor: 'transparent',
    color: '#333',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    fontSize: '12px',
  }
};

