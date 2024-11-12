import { useEffect, useState } from 'react';
import axios from 'axios';
import { CRow, CCol, CCard, CCardBody } from '@coreui/react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import '../assets/dashboardCss.scss';

function AlertScreen(props) {
  const location = useLocation();
  const [countData, setCountData] = useState({ COUNT25: 0, COUNT100: 0 });
  const [alertData, setAlertData] = useState([]);

  const parsed = queryString.parse(location.search);
  console.log(parsed.Line, parsed.Zone);

  const [line, setLine] = useState(parsed.Line || 'Chassis');
  const [zone, setZone] = useState(parsed.Zone || 'QG03L');

  const [tblData, setTblData] = useState([]);

  useEffect(() => {
    async function fetchAuditData() {
      try {
        const response = await axios.get(
          `http://10.119.1.127:9898/rest/api/getQGDemeritsDetails?Line_Name=${parsed.Line}&Station_Name=${parsed.Zone}`,
          {
            auth: { username: 'arun', password: '123456' },
          }
        );

        if (response.status === 200) {
          const data = response.data.HDZONE1ALERT;

          setCountData(data.COUNT.COUNTDATA);
          setAlertData(data.ALERTDEFECTDETAILS.ALERT);
          setTblData(data.ALERTDEFECTDETAILS.ALERT);
        }
      } catch (error) {
        console.error('Error fetching auditors:', error);
      }
    }

    fetchAuditData();
  }, []);

  const getCardClass = (demerit, supname) => {
    let cls = 'bg-c-blue';

    if (demerit == 25) {
      cls = 'bg-c-orange';
    } else if (demerit == 5) {
      cls = 'bg-c-blue';
    } else if (demerit == 100) {
      cls = 'bg-c-red';
    }
    return cls;
  };

  return (
    <CRow className="main-dashboard-wrap main-dashboard4-wrap">
      <CCol lg="12" className="text-center main-head">
        <h5>PRODUCT AUDIT</h5>
        <h5>Demerit Alert & Feedback</h5>
        <h5 style={{ marginRight: '10%' }}>{/* {getLineName(line)}-{zone} */}</h5>
      </CCol>
      <CCol
        lg="12"
        className="text-center"
        style={{
          color: '#fff',
          backgroundColor: 'red',
          fontSize: 18,
          fontWeight: 700,
        }}
      >
        <marquee style={{ fontSize: '30px' }}>
          Last 24 Hrs:<span style={{ color: 'transparent' }}>sp</span> 100 Demerit - <span>{countData.COUNT100}</span>
          <span style={{ color: 'transparent' }}>spc</span>25 Demerit - <span>{countData.COUNT25}</span>
        </marquee>
      </CCol>
      <CCol lg="12">
        <CRow className="main-row main-row-1">
          <CCol md="12">
            <div className="inner-box inner-box-dash2">
              <CRow>
                {alertData.map((item, index) => (
                  <div
                    // onClick={() => setModalData(item)}
                    key={index.toString()}
                    className={`col-md-4 col-xl-3 ${index === 0 ? 'blink_me' : ''}`}
                  >
                    <div
                      className={`card order-card ${getCardClass(item.Demerit, item.Auditor_Name)}`}
                      style={{
                        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.4)',
                        transition: '0.3s',
                        borderRadius: 10,
                      }}
                    >
                      <div className="card-block" style={{ height: '240px' }}>
                        <p
                          className="m-b-0"
                          style={{
                            fontSize: '14px',
                            fontWeight: 'bold',
                          }}
                        >
                          {item.Source_Station}
                          <span style={{ marginLeft: '30%' }}>{item.Shift_Name}</span>
                          <span className="f-right">{item.Audit_Date}</span>
                        </p>

                        <h2 className="text-center" style={{ fontSize: '40px', fontWeight: 'bold' }}>
                          <i className="fa fa-refresh f-left"></i>
                          <span>{item.Demerit}</span>
                        </h2>
                        <p className="m-b-0 desc-two" style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }}>
                          {item.Defct_Desc}
                        </p>
                        <p
                          className="m-b-0"
                          style={{
                            fontSize: '15px',
                            fontWeight: 'bold',
                          }}
                        >
                          {item.Serial_Number}
                          <span className="f-right">{item.Model_Name}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CRow>
            </div>
          </CCol>
        </CRow>
        {/* <Modal open={open} setOpen={setOpen} /> */}
        <CRow className="main-row main-row-2">
          <CCol md="12">
            <div className="inner-box inner-box-dash2">
              <CRow className="align-items-center">
                <CCol lg="12">
                  <CCard className="main-card-6">
                    <CCardBody className={'scroll-table'}>
                      <table className="table table-hover table-striped table-bordered table-sm blue-table2">
                        <thead>
                          <tr>
                            <th scope="col">Logged Station</th>
                            <th scope="col">Chassis Number</th>
                            <th scope="col">Model</th>
                            <th scope="col">Defect Description</th>
                            <th scope="col">Demerit</th>
                            <th scope="col">Issue Date</th>
                            <th scope="col">Ack By</th>
                            <th scope="col">Ack Date</th>
                          </tr>
                        </thead>
                        <tbody style={{ fontWeight: 'normal' }}>
                          {tblData.map((item, index) => (
                            <tr key={index.toString()}>
                              <td>{item.Source_Station}</td>
                              <td>{item.Serial_Number}</td>
                              <td>{item.Model_Name}</td>
                              <td>{item.Defct_Desc}</td>
                              <td style={{ textAlign: 'center' }}>{item.Demerit}</td>
                              <td>{item.Audit_Date}</td>
                              <td>{item.Auditor_Name}</td>
                              <td>{item.Audit_Date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </div>
          </CCol>
        </CRow>
      </CCol>
    </CRow>
  );
}

export default AlertScreen;
