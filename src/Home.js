
import React, {useState, useEffect} from 'react';

import Menu from './Menu';
 
function Home(props) {

    const [menuItems, setMenuItems] = useState([]);
    const [role, setRole] = useState('');

    const makeUniqueid = (length) => {
        var result           = [];
        var characters       = '0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result.push(characters.charAt(Math.floor(Math.random() * 
     charactersLength)));
       }
       return result.join('');
    }

    useEffect(() => {
        const userDetails = JSON.parse(sessionStorage.getItem('userDetails'));
        if(userDetails) {
            setRole(userDetails.role);
        }
        getItems();
    }, []);

    const getItems = async () => {
        await fetch("https://uin25qovaj.execute-api.us-east-2.amazonaws.com/prod/menu")
        .then(getResp => getResp.json())
        .then(getResp => {
            setMenuItems(getResp);
        });
    }

    const postItem = async (item) => {
        await fetch("https://uin25qovaj.execute-api.us-east-2.amazonaws.com/prod/menu", {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'no-cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
              'Content-Type': 'application/json'
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(item) // body data type must match "Content-Type" header
          })
        .then(res => res.json())
        .then(res => {
            console.log(res);
            getItems();
        });
    }

    const addItem = async (item) => {
        item.id = makeUniqueid(6);
        await postItem(item);
    }
    const editItem = async (item) => {
        await postItem(item);
    }
    const deleteItem = async (item) => {
        await fetch("https://uin25qovaj.execute-api.us-east-2.amazonaws.com/prod/menu/" + item.id, {
            method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
          })
        .then(res => {
            console.log(res);
            getItems();
        });
    }

    const logout = () => {
        sessionStorage.removeItem('userDetails');
        props.history.push('/login');
    }

    return (
        <div>
        

        {
            menuItems.length ? 
            <>
                <div className="welcome-banner"><h3>Welcome to the Restaurant!</h3> <a href="javascript:void(0)" onClick={logout}>Logout</a></div>
                <br></br>
                <Menu items={menuItems} role={role} addItem={addItem} editItem={editItem} deleteItem={deleteItem} />
            </> : 'Loading...'
        }

        
        </div>
    );
}
 
export default Home;