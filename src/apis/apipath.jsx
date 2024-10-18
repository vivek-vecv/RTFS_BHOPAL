import { BASE_URL, SERVER_URL } from '../config.jsx';

export const API_URL = 'http://10.119.1.130/apis';

const apiUrl = import.meta.env.VITE_API_URL;

export const Route_Selection = `${apiUrl}/rest/api/getAllRouteNames`;
export const step_selection = `${apiUrl}/rest/api/getStepsByRouteName`;
export const serial_number_search = `${apiUrl}/FTPCApps/rest/api/getQualityGateSerialNumberByLineName`;
export const Geneaolgy_button_click = `${apiUrl}/FTPCApps/rest/api/getGeneaologyByStationSerial`;
export const Torque_button_click = `${apiUrl}/FTPCApps/rest/api/getTorqueByStationSerial`;
export const Process_data_button_click = `${apiUrl}/FTPCApps/rest/api/getProcessDataByStationSerial`;
export const delete_operator = `${apiUrl}/FTPCApps/rest/api/deleteOperatorDataByStation`;
export const Operator_login = `${apiUrl}/FTPCApps/rest/api/getOperatorDataByStation`;
export const login_api = `${apiUrl}/rest/api/login`;

export const testAPi = 'https://jsonplaceholder.typicode.com/todos/1';

export const etbApi =
  'http://mexd.vecv.net:50011/XMII/Runner?Transaction=Default/Vivek/BLS_GetHDZoneAlertDetailsWithCount&InLine=HD&InZone=Zone-4&OutputParameter=jsonOutput&Content-Type=text/json&j_user=vmishra3&j_password=vecv@1234&session=false';
//===========================================with Proxy========================================
// export const Route_Selection = "rest/api/getAllRouteNames";
// export const step_selection = "rest/api/getStepsByRouteName";
// export const serial_number_search =
//   "FTPCApps/rest/api/getQualityGateSerialNumberByLineName";
// export const Geneaolgy_button_click =
//   "FTPCApps/rest/api/getGeneaologyByStationSerial";
// export const Torque_button_click = "FTPCApps/rest/api/getTorqueByStationSerial";
// export const Process_data_button_click =
//   "FTPCApps/rest/api/getProcessDataByStationSerial";
// export const delete_operator = "FTPCApps/rest/api/deleteOperatorDataByStation";
// export const Operator_login = "FTPCApps/rest/api/getOperatorDataByStation";
// export const login_api = "rest/api/login";

// export const getBasicAuthHeader = (username, password) => {
//   const credentials = `${username}:${password}`;
//   const encodedCredentials = btoa(credentials); // Encode credentials in Base64
//  return `Basic ${encodedCredentials}`;
// };
export const headers = {
  headers: {
    'Access-Control-Allow-Headers': 'accept, authorization, content-type, x-requested-with, *, Origin, Content-Type, Accept, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, *, GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Content-Type': 'application/json',
  },
  auth: {
    username: 'Arun',
    password: '123456',
  },
};
