import './App.css'
import Web3 from "web3";
import Abi from "./abi/abi.json"
import { useEffect, useRef, useState } from 'react';
import {ethers} from "ethers";
const ABI=Abi.abi;



function App() {
  const[variable,setVariable]=useState({target:null,deadline:null,raiseamount:null,noOfContributers:null,balance:null});
  const valueRef=useRef(null);
  const voteRef=useRef(null);
  const nameRef=useRef(null);
  const addressRef=useRef(null);
  const amountRef=useRef(null);
  const requestRef=useRef(null);
  const[arr,setArr]=useState([]);
  
  const contractAddress="0x4cF6DAB582886495Bb6bFd72C913916Cd4e6715b";
  const web3=new Web3(window.ethereum);
  const contract= new web3.eth.Contract(ABI,contractAddress);  
  
  
  const provider = new ethers.BrowserProvider(window.ethereum);

  





  useEffect(()=>{
    const Intract=async()=>{
      const target=await contract.methods.target().call();
      const deadline1=await contract.methods.deadline().call();
      const deadline=new Date(await deadline1.toString()*1000);
      const raisedAmount=await contract.methods.raisedAmount().call();
      const noOfContributors=await contract.methods.noOfContributors().call();
      const balance=await contract.methods.getContractBalanace().call();
      setVariable({target:target.toString(),deadline:deadline.toLocaleDateString(),raiseamount:raisedAmount.toString(),noOfContributers:noOfContributors.toString(),balance:balance.toString()}); 
    }
    Intract();
  },[])
  
  useEffect(()=>{
    const intract=async()=>{
       const arr=[];
       const numRequests1=await contract.methods.numRequests().call();
       const numRequests=await numRequests1.toString();
       if(numRequests==0){
         console.log("array size is zero");
       }else{
         for(var i=1;i<=numRequests;i++){
           const a=await contract.methods.requests(i-1).call().then(function(result){return result;});
           arr.push(Object.values(a));
         }
        setArr(arr); 
       }
    }
    intract();
  },[]);
    
    
    

  const sendEther=async()=>{
    if (window.ethereum) {   
      const accounts = await web3.eth.getAccounts();
      await contract.methods.sendEth().send({
        from:accounts[0],
        value:valueRef.current.value
      });
    }
    else{
      alert("transaction not proceed. Please connect to metamask");
      console.log("please connect to metamask ");
    }
    alert('thank you for contribution');
  }

  const vote=async()=>{
    const accounts = await web3.eth.getAccounts();
    await contract.methods.voteRequest(voteRef.current.value).send({from:accounts[0]})
  }

  const createRequests=async()=>{
    const accounts = await web3.eth.getAccounts();
    await contract.methods.createRequests(nameRef.current.value,addressRef.current.value,amountRef.current.value).send({from:accounts[0]});
  } 
  const makePayment=async()=>{
    const accounts = await web3.eth.getAccounts();
    await contract.methods.makePayment(requestRef.current.value).send({from:accounts[0]})
  }   

  const refund=async()=>{
    const accounts = await web3.eth.getAccounts();
    await contract.methods.refund().send({from:accounts[0]});
  }
  
  return (
    <div className='container'>
      <header><center>
      <h1>Target to be achieved: {variable.target} Wei</h1>
      <h1>Deadline:{variable.deadline}</h1>
      <h1>Total raise amount: {variable.raiseamount} Wei</h1>
      <h1>No. of Doners: {variable.noOfContributers}</h1>
      <h1>Balance:{variable.balance} Wei</h1>
      </center>
      </header>
      <div>
      <div>
      <input type="number" required placeholder="Value in wei" ref={valueRef}/>
      <button onClick={sendEther}>Pay</button>
      </div>
      <br/>
      <div>
      <input type="number" required placeholder="request serial number" ref={voteRef}/>
      <button onClick={vote}>Vote</button>
      </div>
      </div>
      <div>
        <h3>REQUEST from ORGANISATION</h3><br/>
        {(arr.map((result)=>{
            return(
              <table>
                  <tbody>
                    <tr >
                      <td style={{width: "17%",}}>
                        <b>Topic:</b> {result[0]}
                      </td>
                      <td style={{width: "38%"}}>
                        <b>Address:</b> {result[1]}
                      </td>
                      <td style={{width: "13%"}}>
                        <b>Value:</b> {result[2].toString()}
                      </td>
                      <td style={{width: "10%"}}>
                        <b>Vote:</b> {result[4].toString()}
                      </td>
                      <td style={{width: "22%"}}>
                        <b>Payment Done:</b> {result[3].toString()}
                      </td>
                      </tr>
                  </tbody>
              </table>
            )
          }))}
      </div>

    <div>  
    <h3>GENERATE REQUEST(ONLY FOR ORGANISATION)</h3>
      <div>
      <input type="text" required placeholder="Description" ref={nameRef}/> 
      <input type="text" required placeholder="Address" ref={addressRef}/>
      <input type="number" required placeholder="Amount required" ref={amountRef}/>
      <button onClick={createRequests}>GENERATE REQUEST</button>
      </div>
      <div>
      <input type="number" required placeholder="Request Number" ref={requestRef}/>
      <button onClick={makePayment}>PAYMENT</button>
      </div>
    </div>
    <div>
      <h4>REFUND REQUEST</h4>
      <h5>Condition:</h5>
      <p>Deadline has passed.</p>
      <p>Target not achieve.</p>
      <button onClick={refund} style={{backgroundColor:"#ff0000"}}>REFUND</button>
    </div>
    </div>
  )
}

export default App
