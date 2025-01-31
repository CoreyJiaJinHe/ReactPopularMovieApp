import { useState,useEffect} from 'react'
/*Anything with use in react is a hook*/
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const hasLiked=true;

const Card=({title})=>{
  const[hasLiked, setHasLiked] = useState(false);
  const[count,setCount]=useState(0);

  useEffect(() => {
    /*Watch out. They aren't ' but ` */
    console.log(`${title} has been liked: ${hasLiked}`);

  }, [hasLiked]);
  /*This is a dependency array, called deps.This prevents useEffect from running unless dependecy array occurs.*/

  /*On first load. To showcase how React handles dependencies.
  useEffect(()=>{
    console.log('CARD RENDERED')
  }, []);*/

  return (
    /*In complicated interfaces, you should not do count+1. You should create another function without the setter state call. 
    This: (prevState)=> prevState+1 instead of count+1.
    */
    <div className="card" onClick={()=>setCount(count+1)}>
      <h2>{title} <br/>{count || null} </h2>
      <button onClick={()=> setHasLiked(!hasLiked)}>
        {hasLiked?'Liked <3':'Like'}
        </button>
    </div>
  )
}


const App=() => {
  return (
    <div className="card-container">
    <Card title="Star Wars" rating={5} isCool={true} actors={[{name:'Actors'}]} />
    <Card title="Avatar"/>
    <Card title="Lion King"/>

      {/*<h2>Functional Arrow Component</h2>
      <Card title="Star Wars" rating={5} isCool={true} actors={[{name:'Actors'}]} />
      <Card title="Avatar"/>
      <Card title="Lion King"/> */}
    </div>
  )
}

export default App
