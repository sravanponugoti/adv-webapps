import React, { useState } from 'react';
 
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
import Button from 'react-bootstrap/Button';

function Login(props) {
  const username = useFormInput('');
  const password = useFormInput('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [show, setShow] = useState(false);
  const createUsernameInput = useFormInput('');
  const createPassword1Input = useFormInput('');
  const createPassword2Input = useFormInput('');
  const [createRoleInput, setCreateRoleInput] = useState('admin');
  const [modalError, setModalError] = useState(null);

  const [formMessage, setFormMessage] = useState('');
 
  // handle button click of login form
  const handleLogin = async () => {
    await fetch('https://xc5r8648w5.execute-api.us-east-2.amazonaws.com/prod/auth', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'no-cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify({username: username.value, password: password.value}) // body data type must match "Content-Type" header
          })
        .then(res => res.json())
        .then(res => {
            console.log(res);
            if(res.authenticated) {
              setError('');
              sessionStorage.setItem('userDetails', JSON.stringify(res.userDetails));
              props.history.push('/home');
            } else {
              setError('Username/Password is invalid');
            }
        });
    
  }

  const handleClose = () => setShow(false);

  const handleSignUp = () => setShow(true);

  const createUser = async () => {
    setModalError('');
    if(createUsernameInput.value && createPassword1Input.value && createPassword1Input.value === createPassword2Input.value) {
      await fetch('https://lrkydfoybb.execute-api.us-east-2.amazonaws.com/prod/register', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'no-cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify({username: createUsernameInput.value, password: createPassword1Input.value, role: createRoleInput, id: makeUniqueid(5)}) // body data type must match "Content-Type" header
      })
      .then(res => res.json())
      .then(res => {
          console.log(res);
      });
    } else {
      if(!createUsernameInput.value) {
        setModalError('Enter Username');
      } else if (!createPassword1Input.value || !createPassword2Input.value){
        setModalError('Enter Password');
      } else if (createPassword1Input.value !== createPassword2Input.value) {
        setModalError('Password and Confirm Password should be same');
      }
      
    }
  }

  const makeUniqueid = (length) => {
    var result           = [];
    var characters       = '0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return parseInt(result.join(''));
  }
 
  return (
    <div>
      <div className="login-block">
        <div className="title">Login to Restaurant</div>
        <br /><br />
        <div>
          Username<br />
          <input type="text" {...username} autoComplete="new-password" />
        </div>
        <div style={{ marginTop: 10 }}>
          Password<br />
          <input type="password" {...password} autoComplete="new-password" />
        </div>
        {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
        <button type="button" onClick={handleLogin}>Sign In</button>
        <br /><br />
        <a className="signup" href onClick={handleSignUp}>Sign Up</a>
      </div>
      <Modal show={show} onHide={handleClose} animation={false}>
        <ModalHeader>
            <ModalTitle>Sign Up</ModalTitle>
        </ModalHeader>
        <ModalBody>
            <div>
                User Name<br />
                <input type="text" {...createUsernameInput} />
            </div>
            <div style={{ marginTop: 10 }}>
                Password<br />
                <input type="text" {...createPassword1Input} />
            </div>
            <div style={{ marginTop: 10 }}>
                Confirm Password<br />
                <input type="text" {...createPassword2Input} />
            </div>
            <div style={{ marginTop: 10 }}>
                Role<br />
                <input type="radio" name="role" value={createRoleInput} onChange={() => setCreateRoleInput('admin')} /> Admin &nbsp;&nbsp;&nbsp;
                <input type="radio" name="role" value={createRoleInput} onChange={() => setCreateRoleInput('customer')} /> Customer
            </div>
            {modalError && <><small style={{ color: 'red' }}>{modalError}</small><br /></>}<br />
        </ModalBody>
        <ModalFooter>
            <Button className="popup-button" variant="light" onClick={handleClose}>
                Cancel
            </Button>
            <Button className="popup-button" variant="primary" onClick={createUser}>Create User</Button>
            
        </ModalFooter>
      </Modal>
    </div>
    
  );
}
 
const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);
 
  const handleChange = e => {
    setValue(e.target.value);
  }
  return {
    value,
    onChange: handleChange
  }
}
 
export default Login;