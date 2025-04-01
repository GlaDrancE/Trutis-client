import axios from "axios";

export const getIpData = async () => {
    const res = await axios.get("https://api.ipify.org/?format=json");
    console.log(res.data);
    return res.data.ip;
};