import axios from "axios";

const api = axios.create({
	baseURL: "https://moneylife1kdata-gs76.onrender.com",
	// baseURL: "http://localhost:3000",
	// Your backend URL
});

export default api;
