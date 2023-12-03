import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";
import { useEffect } from "react";
import { addorder, reportpets } from "../firebaseConfig";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationCircle,
  faCheckCircle,
  faShoppingCart,
  faSearch,
  faEye,
  faArrowUp,
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faSearchPlus,
  faSearchMinus,
} from "@fortawesome/free-solid-svg-icons";
// import FaceDetectionComponent from "./OpenCVDetection";

function UserHome(props) {
  const [cityFilter, setCityFilter] = useState("");
  const [pets, setPets] = useState([]);
  const [phonec, setCurrentphone] = useState([]);
  const [productnamef, setproductnamef] = useState([]);
  const [address, setaddress] = useState([]);
  const [pricef, setpricef] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [stream, setStream] = useState(null);
  const [imgsrc, setimgsrc] = useState("");

  const [position, setPosition] = useState({ top: "60%", left: "50%",height:"80%" });
  const [size, setSize] = useState({ width: "80%", height: "80%" });

  const handleMove = (direction) => {
    let { top, left,height } = position;
    const moveStep = 10; // Change this value as needed

    switch (direction) {
      case "up":
        top = `${parseFloat(top) - moveStep}%`;
        break;
      case "down":
        if(`${parseFloat(top) + moveStep}%`<"70%"){
          top = `${parseFloat(top) + moveStep}%`;
        }
        
        break;
      case "left":
        left = `${parseFloat(left) - moveStep}%`;
        break;
      case "right":
        left = `${parseFloat(left) + moveStep}%`;
        break;
      case "in":
        height = `${parseFloat(height) + moveStep}%`;
        break;
      case "out":
        height = `${parseFloat(height) - moveStep}%`;
          break;
      default:
        break;
    }

    setPosition({ top, left,height });
  };



  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
    props.setCartItems(cartItems);
    alert("Added to cart");
  };

  const handleCityFilterChange = (event) => {
    setCityFilter(event.target.value);
  };

  const startCamera = async () => {
    try {
      const userMediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(userMediaStream);
      setIsCameraOn(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      setStream(null);
      setIsCameraOn(false);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup: Stop the camera when the component is unmounted
      stopCamera();
    };
  }, []);

  const filteredPets = pets.filter((pet) =>
    pet.name.toLowerCase().includes(cityFilter.toLowerCase())
  );

  const reportshelter = (id) => {
    reportpets(id, true);
  };

  const handleAddressChange = (event) => {
    setaddress(event.target.value);
  };

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  const handleClick = async () => {
    try {
      alert("Successfully Placed Order");
      addorder(getRandomInt(1, 500), phonec, productnamef, pricef, address);
    } catch (err) {
      alert("Error");
    }
  };

  useEffect(() => {
    const cookieUsertype = Cookies.get("phonenumber");
    if (cookieUsertype) {
      setCurrentphone(cookieUsertype);
    }

    const dbb = getDatabase();
    const petsRef = ref(dbb, "users/products");

    const unsubscribe = onValue(petsRef, (snapshot) => {
      const petsData = snapshot.val();
      const petsArray = petsData
        ? Object.entries(petsData).map(([id, pet]) => ({ id, ...pet }))
        : [];
      setPets(petsArray);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      {isCameraOn && (
        <div
          style={{ position: "relative", width: "100%", paddingBottom: "45%" }}
        >
          <video
            autoPlay
            playsInline
            ref={(videoRef) => videoRef && (videoRef.srcObject = stream)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          />

          <img
            src={imgsrc}
            alt="Overlay"
            style={{
              position: "absolute",
              top: position.top,
              left: position.left,
              transform: "translate(-50%, -50%)",
              height: position.height,
            }}
          />
        </div>
      )}

      {isCameraOn && (

      <div style={{zIndex:9999,position: "absolute",marginLeft:"50%"}} className="text-center mt-3 mb-3">
        <button onClick={() => handleMove("up")}>
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
        <button onClick={() => handleMove("down")}>
          <FontAwesomeIcon icon={faArrowDown} />
        </button>
        <button onClick={() => handleMove("left")}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <button onClick={() => handleMove("right")}>
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
        <button onClick={() => handleMove("in")}>
          <FontAwesomeIcon icon={faSearchPlus} />
        </button>
        <button onClick={() => handleMove("out")}>
          <FontAwesomeIcon icon={faSearchMinus} />
        </button>
      </div>
      )}

      <div className="container-fluid" style={{marginTop:"60px"}}>
        <div className="form-row align-items-center alert alert-dark">
          <div className="col-auto">
            <label htmlFor="productNameFilter" style={{ fontSize: "1.2em" }}>
              <FontAwesomeIcon
                icon={faSearch}
                style={{ marginRight: "10px" }}
              />
              Filter by Product Name
            </label>
          </div>
          <div className="col-2">
            <input
              type="text"
              className="form-control"
              id="productNameFilter"
              value={cityFilter}
              onChange={handleCityFilterChange}
            />
          </div>
        </div>

        <div  className="d-flex flex-wrap justify-content-center">
          {filteredPets.map((pet) => (
            <div
              className="card m-3 form-bg form-container"
              style={{ width: "300px"  }}
              key={pet.id}
            >
              <div class="card text-center">
                <div class="card-header">
                  {pet.report ? (
                    <span className="badge badge-danger mr-1">
                      <FontAwesomeIcon icon={faExclamationCircle} />
                    </span>
                  ) : (
                    <span className="badge badge-success mr-1">
                      <FontAwesomeIcon icon={faCheckCircle} />
                    </span>
                  )}
                  {pet.name}
                </div>
                <div class="card-body">
                  <img
                    src={pet.imageurl}
                    className="card-img-top p-1 rounded-circle"
                    alt={pet.name}
                    width="100"
                    height="250"
                  />
                  <p class="card-text" style={{height:"40px"}}>{pet.breed.substring(0, 50)}...</p>
                </div>
                <div class="card-footer text-muted">Price : ${pet.price}</div>
              </div>

              <div className="d-flex justify-content-around ">
                {isCameraOn ? (
                  <FontAwesomeIcon
                    onClick={() => {
                      if (isCameraOn) {
                        stopCamera();
                      } else {
                        startCamera();
                        console.log("pet.imageurl: ", pet.imageurl);
                        setimgsrc(pet.imageurl);
                      }
                    }}
                    title="Try it on"
                    className="mr-1 ml-3 mt-3"
                    icon={faEye}
                  />
                ) : (
                  <FontAwesomeIcon
                    onClick={() => {
                      if (isCameraOn) {
                        stopCamera();
                      } else {
                        startCamera();
                        console.log("pet.imageurl: ", pet.imageurl);
                        setimgsrc(pet.imageurl);
                      }
                    }}
                    title="Try it on"
                    className="mr-1 ml-3 mt-3"
                    icon={faEye}
                  />
                )}
                <h5 className="card-title text-center mt-1">
                  <button
                    className="btn btn-success"
                    data-toggle="modal"
                    data-target="#exampleModalb"
                    onClick={() => {
                      setpricef(pet.price);
                      setproductnamef(pet.name);
                    }}
                  >
                    {" "}
                    <FontAwesomeIcon className="mr-1" icon={faCheckCircle} />
                    Buy Now
                  </button>

                  <FontAwesomeIcon
                    title="Add to cart"
                    className=" ml-5 mr-1"
                    onClick={() => addToCart(pet)}
                    icon={faShoppingCart}
                  />
                </h5>
              </div>
            </div>
          ))}
        </div>
        {/* <FaceDetectionComponent></FaceDetectionComponent> */}
      </div>

      <div
        class="modal fade"
        id="exampleModalb"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Place Order
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form>
                <div class="alert alert-success" role="alert">
                  <h4 class="alert-heading">{productnamef}</h4>
                  <hr />
                </div>
                <div class="form-group">
                  <label for="recipient-name" class="col-form-label">
                    Phone Number:
                  </label>
                  <input
                    type="text"
                    value={phonec}
                    disabled
                    class="form-control"
                    id="recipient-name"
                  />
                </div>
                <div class="form-group">
                  <label for="price" class="col-form-label">
                    Price:
                  </label>
                  <input
                    type="text"
                    value={pricef}
                    disabled
                    class="form-control"
                  />
                </div>
                <div class="form-group">
                  <label for="message-text" class="col-form-label">
                    Address:
                  </label>
                  <textarea
                    class="form-control"
                    id="message-text"
                    value={address}
                    onChange={handleAddressChange}
                  ></textarea>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                class="btn btn-primary"
                onClick={() => handleClick()}
              >
                Confirm and Buy
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserHome;

