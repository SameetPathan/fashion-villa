import React,{useState,useEffect} from 'react';
import Loader from './Loader';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import Cookies from 'js-cookie';
import { addpets, login, register } from '../firebaseConfig';
import { getDatabase, ref, set,get } from "firebase/database";
import { async } from '@firebase/util';

function Navbarcomponent(props) {

  const [username, setusername] = useState('');
  const [password, setpassword] = useState('');
  const [email, setemail] = useState('');
  const [address, setaddress] = useState('');
  const [phone, setphone] = useState('');
  const [aadhar, setaadhar] = useState('test');
  const [usertype, setusertype] = useState('');


  const [phonec] = useState(''); // Assuming phonec is received from somewhere

  const handleAddressChange = (event) => {
    setaddress(event.target.value);
  };

  
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);

  const clear=()=>{
    document.getElementById("myForm").reset();
}


const calculateTotalPrice = () => {
  if(props.cartItems){
  return props.cartItems.reduce((total, item) => parseInt(total) + parseInt(item.price), 0);
  }
};


  const handleCheckout=()=>{
    alert("Successfuly Placed Order.")
  }


  const logout=async()=>{
		try {
			props.setCurrentAccount("");
      props.setCurrentusertype("");
      Cookies.remove('aadharcard');
      Cookies.remove('usertype');
      Cookies.remove('phonenumber');
   
      <Loader></Loader>
		  } catch (err) {
			console.log(err);
		  }
	  }

    const loginhandle= async()=>{

      if(phone && phone.length==10){

    

      const db = getDatabase();
      const userRef = ref(db, 'users/' + phone);
      const userSnapshot = await get(userRef);
      const userData = userSnapshot.val();

      if (!userData) {
        alert("Login Failed ")
      }
      else{
        if(userData.password===password && userData.usertype===usertype){
        
          props.setCurrentAccount(userData.aadharcard);
          props.setCurrentusertype(userData.usertype);
          Cookies.set('aadharcard', userData.aadharcard);
          Cookies.set('usertype', userData.usertype);
          Cookies.set('phonenumber', phone);
          setShowModal1(false);
          clear();
        }
        else{
          setShowModal1(false);
          alert("Login Failed")
        }
        
      }  
    }else{
      alert("Please enter all feilds and veriy if Phone number enter correctly.")
    }
  }

    function registerhandle(){
      if(aadhar && password){
        register(phone, username, email,"user",aadhar,address,password);
        clear();
        setShowModal2(false)
        
      }else{
        alert("Failed to register")
      }
    }

  return (
    <>
  <Loader></Loader>
  <div className='sticky-top'>

      <nav className="navbar navbar-expand-lg navbar-dark bgd">
      
        <div className="logo-holder logo-3 mr-3">
          <a>
            <h3>Fashion Villa</h3>
            <p>try on Enabled System</p>
          </a>
        </div>

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse mr-3"
          id="navbarSupportedContent"
        >

      <ul className="navbar-nav mr-auto">

      </ul>

            {props.currentAccount ? <> 
        <Link class="nav-link btn btn-outline-info mr-2" to="/">Home </Link>

        <Link class="nav-link btn btn-outline-info mr-2" to="/" data-toggle="modal" data-target="#cart">My Cart {props.cartItems.length} </Link>
        
        <button className="btn btn-outline-success my-2 my-sm-0" onClick={logout} >Logout</button></>
            :
            <div className="form-inline">
                <button className="btn btn-outline-success my-2 my-sm-0" onClick={() => setShowModal1(true)} data-toggle="modal" data-target="#register
                "  >Register</button>
                <button className="btn btn-outline-success my-2 my-sm-0 ml-3" onClick={() => setShowModal2(true)} data-toggle="modal" data-target="#login"
                  >Login</button>
                  
            </div>}

        </div>
      </nav>
    </div>


<div className={`modal fade ${showModal2 ? 'show' : ''}`} id="register" tabindex="-1" aria-labelledby="exampleModalLabel"  aria-hidden={!showModal2}>
    <div className="modal-dialog">
      <div className="modal-content">

   

        <div className="modal-header bgd">
          <h5 className="modal-title" id="exampleModalLabel">Register</h5>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
        <form className="needs-validation" id="myForm" noValidate >

    

          <div className="form-group">
            <label for="username" className="col-form-label">Full Name :</label>
            <input type="text" value={username} onChange={(e) => setusername(e.target.value)} className="form-control" id="username" required />
          </div>
          <div className="form-group">
            <label for="phone" className="col-form-label">Phone Number :</label>
            <input type="text" value={phone} onChange={(e) => setphone(e.target.value)} className="form-control" id="phone" required />
          </div>
          <div className="form-group">
            <label for="email" className="col-form-label">Email :</label>
            <input type="text" value={email} onChange={(e) => setemail(e.target.value)}  className="form-control" id="email" required />
          </div>

    

          <div className="form-group">
            <label for="address" className="col-form-label">Full Address :</label>
            <textarea type="text" value={address} onChange={(e) => setaddress(e.target.value)}  className="form-control" id="address" required />
          </div>

        
          <div className="form-group">
            <label for="password" className="col-form-label">Password :</label>
            <input type="password" value={password} onChange={(e) => setpassword(e.target.value)}  className="form-control" id="password" required />
          </div>
     
        </form>
        </div>
        <div className="modal-footer bgd">
          <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" onClick={registerhandle} data-dismiss="modal" className="btn btn-light">Register</button>
        </div>
      </div>
    </div>
  </div>

  <div className={`modal fade ${showModal1 ? 'show' : ''}`} id="login" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden={!showModal1} >
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header bgd">
          <h5 className="modal-title" id="exampleModalLabel">Login</h5>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
        <form className="needs-validation" id="myForm" noValidate>

        <div className="form-check form-check-inline">
        <input className="form-check-input" value="user" onChange={(e) => setusertype(e.target.value)} type="radio" name="inlineRadioOptions" id="inlineRadio1" />
        <label className="form-check-label" for="inlineRadio1">Shopper</label>
      </div>

      <div className="form-check form-check-inline">
        <input className="form-check-input" value="admin" onChange={(e) => setusertype(e.target.value)} type="radio" name="inlineRadioOptions" id="inlineRadio2" />
        <label className="form-check-label" for="inlineRadio2">Admin</label>
      </div>
          
          <div className="form-group">
            <label for="aadhar" className="col-form-label">Phone Number :</label>
            <input type="text" value={phone} onChange={(e) => setphone(e.target.value)}  className="form-control" id="phone" required/>
          </div>
          <div className="form-group">
            <label for="password" className="col-form-label">Password :</label>
            <input type="password" value={password} onChange={(e) => setpassword(e.target.value)}  className="form-control" id="password" required/>
          </div>
     
        </form>
        </div>
        <div className="modal-footer bgd">
          <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" onClick={()=>loginhandle()} data-dismiss="modal" className="btn btn-light">Login</button>
      
        </div>
      </div>
    </div>
  </div>




  <div className="modal fade" id="cart" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bgd">
            <h5 className="modal-title" id="exampleModalLabel">
              Your Cart / Place Order
            </h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {props.cartItems&& (props.cartItems.map((item) => (
              <div key={item.id}>
                <div className="alert alert-success" role="alert">
                  <h4 className="alert-heading">{item.name}</h4>
                  <p>Price: ${item.price}</p>
                  <hr />
                </div>
              </div>)
            ))}
            <hr />
            <p>Total Price: ${calculateTotalPrice()}</p>
            <div className="form-group">
              <label htmlFor="recipient-name" className="col-form-label">
                Phone Number:
              </label>
              <input
                type="text"
                value={phonec}
                className="form-control"
                id="recipient-name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="message-text" className="col-form-label">
                Address:
              </label>
              <textarea
                className="form-control"
                id="message-text"
                value={address}
                onChange={handleAddressChange}
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="message-text" className="col-form-label">
                Pay using Below QR code and Confirm Your Order :
              </label>
              <br></br>
              <img height={100} src='qr.jpg'/>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-dismiss="modal">
              Close
            </button>
            <button type="button" className="btn btn-primary" onClick={() => handleCheckout()}>
              Confirm and Buy
            </button>
          </div>
        </div>
      </div>
    </div>


  
    </>
  );
}

export default Navbarcomponent