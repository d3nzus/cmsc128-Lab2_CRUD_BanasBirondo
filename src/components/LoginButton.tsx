import { Link } from "react-router-dom";

function LoginButton(){
    return(
    <Link to="/login"><button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Sign Out</button></Link>  
    
)
}

export default LoginButton;