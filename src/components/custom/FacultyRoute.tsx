
import { useSelector } from "react-redux";
import { Outlet,Navigate } from "react-router-dom";
import type { RootState } from "Redux/store";

export default function FacultyRoute (){
    const name = useSelector((state:RootState)=>state.faculty.name)
    return(<>
    {name!=""?<Outlet></Outlet>:<Navigate to={"/"}></Navigate>}
    </>)
}