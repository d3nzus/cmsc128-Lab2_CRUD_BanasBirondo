import { Link } from "react-router-dom";

function AddTask(){
    return(
    <Link to="/addForm"><button className='shadow-teal-600 shadow-xl/50 bg-black-forest-500 hover:bg-black-forest-700 text-white font-bold py-2 px-4 rounded-xl h-full'>Add Task</button></Link>  
    
)
}

export default AddTask;