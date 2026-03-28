import { userlogin, signUp } from "../controllers/auth_Controller.js" ;
import express from "express" ;

const router = express.Router() ;

router.post("/login" , userlogin) ; 

router.post("/sign" , signUp);
