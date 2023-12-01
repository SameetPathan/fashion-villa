import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase, ref, set,get ,update,remove } from "firebase/database";


const firebaseConfig = {
    apiKey: "AIzaSyCyQBJXsl55edeGQ0sczrorIkUoWOCC_qc",
    authDomain: "fashion-villa-3b0d8.firebaseapp.com",
    databaseURL: "https://fashion-villa-3b0d8-default-rtdb.firebaseio.com",
    projectId: "fashion-villa-3b0d8",
    storageBucket: "fashion-villa-3b0d8.appspot.com",
    messagingSenderId: "967824840041",
    appId: "1:967824840041:web:93913fcb6c9433cbf219f8"
};


export const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export function register(phonenumber, fullname, email,usertype,aadharcard,address,password){
    const dbb = getDatabase();
    set(ref(dbb, 'users/' + phonenumber), {
      username: fullname,
      email: email,
      usertype:usertype,
      aadharcard:aadharcard,
      address:address,
      password:password
    });
    alert("Registration Successfull")
}

export function addpets(id, name, breed,age,gender,shelyteraadhar,phonenumber,imageurl,price,city){
    const dbb = getDatabase();
    set(ref(dbb, 'users/products/' + id), {
        name: name,
        breed: breed,
        age:age,
        gender:gender,
        shelyteraadhar:shelyteraadhar,
        phonenumber:phonenumber,
        imageurl:imageurl,
        price:price,
        city:city
    });
    alert("Product added Successfull")
}

export function addorder(id, phonenumber , productname , price , address){
    const dbb = getDatabase();
    set(ref(dbb, 'users/orders/' + id), {
        productName: productname,
        price: price,
        address:address,
        phonenumber:phonenumber,
    });
    
}

export function reportpets(id,status) {
    const dbb = getDatabase();
    const petsRef = ref(dbb, 'users/products/' + id);

    get(petsRef).then((snapshot) => {
        if (snapshot.exists()) {
            const petData = snapshot.val();
            petData["report"] = status;
            update(petsRef, petData).then(() => {
                alert('Reported successfully!');
            }).catch((error) => {
                console.error('Error Reporting: ', error);
            });
        } else {
            console.error('Product data not found!');
        }
    }).catch((error) => {
        console.error('Error getting Product data: ', error);
    });
}

export function deletePet(id) {
    const db = getDatabase();
    const petRef = ref(db, 'users/products/' + id);
  
    remove(petRef).then(() => {
      alert('Product deleted successfully!');
    }).catch((error) => {
      console.error('Error deleting Product: ', error);
    });
  }

