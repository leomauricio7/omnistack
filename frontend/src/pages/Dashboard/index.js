import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import socketio from "socket.io-client";
import api from "../../services/api";
import "./styles.css";

export default function Dashboard() {
  // setando os estados das variaveis
  const [spots, setSpost] = useState([]);
  const [requests, setRequests] = useState([]);

  //memoriza a conexão e só refaz quando o usuário mudar
  const user_id = localStorage.getItem("user");
  const socket = useMemo(
    () =>
      socketio("http://localhost:3000", {
        query: { user_id }
      }),
    [user_id]
  );
  //sempre é executado quando o componente é montado
  useEffect(() => {
    socket.on("booking_request", data => {
      setRequests([...requests, data]);
    });
  }, [requests, socket]);

  //sempre é executado quando o componente é montado
  useEffect(() => {
    async function loadSpots() {
      const user_id = localStorage.getItem("user");
      const response = await api.get("/dashboard", {
        headers: { user_id }
      });
      setSpost(response.data);
    }
    loadSpots();
  }, []);

  //funções de aprovar e desaprovar as reservas
  async function handleAccept(bookingId) {
    await api.post(`/bookings/${bookingId}/approvals`);
    setRequests(requests.filter(request => request._id !== bookingId));
  }
  async function handleReject(bookingId) {
    await api.post(`/bookings/${bookingId}/rejections`);
    setRequests(requests.filter(request => request._id !== bookingId));
  }

  return (
    <>
      <ul className="notifications">
        {requests.map(request => (
          <li key={request._id}>
            <p>
              <strong>{request.user.email}</strong> está solicitando uma reserva
              em <strong>{request.spot.company}</strong> para a data:{" "}
              <strong>{request.date}</strong>.
            </p>
            <button
              className="accept"
              onClick={() => handleAccept(request._id)}
            >
              ACEITAR
            </button>
            <button
              className="reject"
              onClick={() => handleReject(request._id)}
            >
              REJEITAR
            </button>
          </li>
        ))}
      </ul>
      <ul className="spot-list">
        {spots.map(spot => (
          <li key={spot._id} title={spot.company}>
            <header
              style={{ backgroundImage: `url(${spot.thumbnail_url.web})` }}
            />
            <strong>{spot.company}</strong>
            <span>{spot.price ? `R$${spot.price}/dia` : "GRATUITO"}</span>
          </li>
        ))}
      </ul>
      <Link to="/new">
        <button className="btn">CADASTRAR NOVO SPOT</button>
      </Link>
      <Link to="/">
        <button className="btn dark">&#8629; SAIR</button>
      </Link>
    </>
  );
}
