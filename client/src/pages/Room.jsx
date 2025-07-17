import { useParams } from "react-router-dom";
import Question from "./Question";
import { useEffect, useState } from "react";
import { serverEndpoint } from "../config/appConfig";
import axios from "axios";
import socket from "../config/socket";

function Room() {
  const { code } = useParams();
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [room, setRoom] = useState(null);
  const [questions, setQuestions] = useState([]);

  const fetchRoom = async () => {
    try {
      const response = await axios.get(`${serverEndpoint}/room/${code}`, {
        withCredentials: true,
      });
      setRoom(response.data);
    } catch (error) {
      console.log(error);
      setErrors({ messgae: "Unable to fetch room details, please try again" });
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${serverEndpoint}/room/${code}/question`,{
          withCredentials: true,
        }
      );
      setQuestions(response.data);
    } catch (error) {
      console.log(error);
      setErrors({ messgae: "Unable to fetch room details, please try again" });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchRoom();
      await fetchQuestions();
      setLoading(false);
    };

    fetchData();

    socket.emit("join-room", code);
    socket.on("new-question",(question)=>{
      setQuestions((prev)=>[question, ...prev]);
    });

    return () =>{
      socket.off("new-question");
    }
  }, []);

  if(loading){
    return(
      <div className="container text-center py-5">
        <h3>Loading..</h3>
        <p>Fetching room details...</p>
      </div>
    );
  }

  if(errors.messgae){
    return(
      <div className="container text-center py-5">
        <h3>Error!</h3>
        <p>errors.message</p>
      </div>
    );
  }
  return (
    <div className="container py-5">
      <h2 className="mb-2">Room {code}</h2>
      <div className="row">
        <div className="col-auto">
          <ul className="list-group">
            {questions.map((ques)=>(
              <li key={ques._id} className="list-group-item">
                {ques.content}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="row">
          <Question roomCode={code} />
      </div>
    </div>
  );
}

export default Room;
