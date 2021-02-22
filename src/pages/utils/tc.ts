import Tracie from "../../modules/tracie-admin";

// @ts-ignore
const host = window.TC_HOST || `localhost:8080`;

// @ts-ignore
const enpoint = window.TC_ENDPOINT || "/tc";

const TracieAdmin = new Tracie({
    server: `//${host}${enpoint}`
});

export default TracieAdmin;