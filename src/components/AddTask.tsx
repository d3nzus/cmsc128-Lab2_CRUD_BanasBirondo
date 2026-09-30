import { Link } from "react-router-dom";

function AddTask(){
    return(
    <Link to="/addForm"><button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Add Task</button></Link>  
    
)
}

export default AddTask;