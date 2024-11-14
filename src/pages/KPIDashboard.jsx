import { useEffect, useState } from 'react';
import ReactSpeedometer from 'react-d3-speedometer';
import { CCard, CCardBody, CCol, CRow } from '@coreui/react';
import { CChartLine, CChart } from '@coreui/react-chartjs';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import vehicleImg from '../images/LMD_Truck.jpg';
import '../assets/dashboardCss.scss';
import axios from 'axios';
const KPIDashboard = (props) => {
  const location = useLocation();
  const parsed = queryString.parse(location.search);

  const [line, setLine] = useState(parsed.Line || 'Chassis');
  const [zone, setZone] = useState(parsed.Zone || 'QG03L');
  const [mainline, setMainline] = useState('Chassis');
  const [demeritsHD, setDemeritsHD] = useState({ data: [], labels: [] });
  const [auditDemeritTrend, setAuditDemeritTrend] = useState([]);
  const [gaugeDemeritTrend, setGaugeDemeritTrend] = useState([]);
  const [zonewiseTrendDaily, setZonewiseTrendDaily] = useState([]);
  const [fttData, setFttData] = useState([]);
  const [vehiclesAudited, setVehiclesAudited] = useState([]);

  useEffect(() => {
    const fetchAuditDetails = async () => {
      try {
        const response = await axios.get(
          `http://10.119.1.127:9898/rest/api/getDetailsForAudit?Line_Name=${parsed.Line}&Station_Name=${parsed.Zone}`,
          {
            auth: { username: 'arun', password: '123456' },
          }
        );

        if (response.status === 200) {
          const data = response.data.PRODUCTAUDITCHART;

          const CreateArray = (data) => {
            data = Array.isArray(data) ? data : data ? [data] : [];
            return data;
          };

          const demeritsData = CreateArray(response.data?.PRODUCTAUDITCHART?.AUDITDEMERITTREND?.DEMERIT);

          const labelsHD = [];
          const HDData = [];
          if (demeritsData && demeritsData.length > 0) {
            demeritsData.forEach((item) => {
              labelsHD.push(item.Time_Range === 'CURRENTDATE' ? 'TODAY' : item.Time_Range);
              HDData.push(item.Audit);
            });
          }

          setGaugeDemeritTrend(data.GAUGEDEMERITTREND?.DEMERIT ?? []);
          setAuditDemeritTrend(data.AUDITDEMERITTREND?.DEMERIT ?? []);
          setZonewiseTrendDaily(data.ZONEWISETRENDDAILY?.DEMERIT ?? []);
          setFttData(data.FTTDATA?.FTTTABLE ?? []);
          setVehiclesAudited(data.VEHICLESAUDITED?.COUNT ?? []);

          setDemeritsHD({ data: [...HDData], labels: [...labelsHD] });
        }
      } catch (error) {
        console.error('Error fetching audit details:', error);
      }
    };

    fetchAuditDetails();
  }, []);

  const drawLineLabels = (chart) => {
    const ctx = chart.ctx;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    chart?.data?.datasets.forEach((dataset) => {
      dataset?.data?.forEach((value, index) => {
        const model = chart?.getDatasetMeta(0).data[index];
        ctx.fillText(value, model.x, model.y - 5);
      });
    });
  };

  const getLineName = (line) => {
    let lineName = 'Chassis';

    if (line == 'Chassis') {
      lineName = 'Chassis';
    } else if (line == 'CABTRIM') {
      lineName = 'CABTRIM';
    } else {
      lineName = line;
    }
    return lineName;
  };

  const chassisFTTData = fttData?.find((item) => item.Header_Type === 'Audit');
  const zoneFTTData = fttData?.find((item) => item.Header_Type === 'Overall');
  const processFTTData = fttData?.find((item) => item.Header_Type === 'Process');

  console.log(chassisFTTData, zoneFTTData, processFTTData);

  const getColor = (val, type) => {
    let color = 'red-color';
    if (type === 'HD') {
      color = val == '100' ? 'green-color' : 'red-color';
    } else {
      color = val == '100' ? 'green-color' : 'red-color';
    }
    return color;
  };

  const getStyle = (variable) => {
    return getComputedStyle(document.documentElement).getPropertyValue(variable);
  };

  return (
    <>
      {
        <CRow className="main-dashboard-wrap">
          <CCol lg="12" className="text-center main-head">
            <h5>Product Audit</h5>
            <h5> Demerit Dashboard </h5>
            <h5 style={{ marginRight: '10%' }}>
              {getLineName(line)}-{zone}
            </h5>
          </CCol>

          <CCol lg="4">
            <div className="inner-box">
              <div className="row">
                <div className="col-12 align-content-center">
                  <h5 className="vehicleTitle">{mainline}</h5>
                </div>
              </div>

              <div className="row align-items-center">
                <div className="col-5 image-box">
                  <img src={vehicleImg} className="image-responsive" />
                </div>
                <div className="col-7">
                  <CRow className="inner-wrap-box">
                    <div className="col-md-12 text-center top-audit-title">Number of Vehicles Inspected</div>
                    <div className="col-md-6">
                      <div className="label-control mid-font">Today</div>
                    </div>
                    <div className="col-md-6">
                      <div className="audits-value mid-font">{vehiclesAudited[0]?.Audit_COUNT}</div>
                    </div>
                    <div className="col-md-6">
                      <div className="label-control mid-font">Month</div>
                    </div>

                    <div className="col-md-6">
                      <div className="audits-value mid-font">{vehiclesAudited[1]?.Audit_COUNT}</div>
                    </div>
                  </CRow>
                </div>
              </div>
              <hr className="hr-line" />
              <div className="row">
                <div className="col-md-12 gauge-gaurd-title text-center">
                  <h3>Demerit Per Vehicle</h3>
                </div>
                {gaugeDemeritTrend.map((gauge, index) => {
                  return (
                    <div key={index.toString()} className="col-6">
                      <CCard className="main-card-6">
                        <CCardBody>
                          <div className="mb-2">
                            <span className="blue-badge calendar">{gauge?.Time_Range == 'CURRENTDATE' ? 'Today' : gauge?.Time_Range}</span>
                          </div>
                          <div className="text-center">
                            <ReactSpeedometer
                              textColor={'black'}
                              needleHeightRatio={0.6}
                              labelFontSize={'10px'}
                              valueTextFontSize={'20px'}
                              //   value={parseInt(gauge?.Audit_Gaudge) > 200 ? 200 : parseInt(gauge?.Audit_Gaudge)}
                              value={gauge?.Audit_Gaudge}
                              //   currentValueText={toString(gauge?.Audit_Gaudge)}
                              customSegmentStops={[0, 20, 50, 100, 200]}
                              segmentColors={['#6ad72d', '#aee228', 'gold', '#ff471a']}
                              ringWidth={15}
                              minValue={0}
                              maxValue={200}
                              width={140}
                              height={100}
                            />
                          </div>
                        </CCardBody>
                      </CCard>
                    </div>
                  );
                })}
              </div>
              <hr className="hr-line" />
              <div className="row">
                <div className="col-md-12 gauge-gaurd-title  text-center">
                  <h3>Demerit Trend - {mainline}</h3>
                </div>
                {/* <div className="col-md-12 vehicle-trend-title text-center"><h3>Demerit per Vehicle Trend</h3></div> */}
                <div className="col-12">
                  <CCard className="main-card-12">
                    {/* <CCardBody>
                      <CChartLine
                        datasets={[
                          {
                            label: `${line} Demerits`,
                            borderColor: '#0d86ff',
                            data: demeritsHD?.data,
                            fill: false,
                          },
                        ]}
                        options={{
                          defaultFontColor: '#000',
                          title: {
                            display: true,
                            text: '',
                            fontSize: 12,
                            padding: 5,
                            fontColor: '#000',
                          },
                          legend: {
                            display: false,
                            position: 'bottom',
                          },
                          scales: {
                            y: [
                              {
                                ticks: {
                                  suggestedMin: 10,
                                  maxTicksLimit: 8,
                                  fontColor: '#000',
                                  //suggestedMax: 100
                                },
                                scaleLabel: {
                                  display: true,
                                  fontColor: '#000',
                                  labelString: 'Demerit Per Vehicle',
                                },
                              },
                            ],
                            x: [
                              {
                                offset: true,
                                ticks: {
                                  fontColor: '#000',
                                },
                              },
                            ],
                          },
                          tooltips: {
                            enabled: true,
                          },
                          animation: {
                            onProgress: drawLineLabels,
                            onComplete: drawLineLabels,
                          },
                          //   hover: { animationDuration: 0 },
                        }}
                        labels={demeritsHD?.labels}
                      />
                    </CCardBody> */}
                    {/* <CCardBody> */}
                    <CChart
                      type="line"
                      data={{
                        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                        datasets: [
                          {
                            label: 'Demerit Per vehicle',
                            backgroundColor: 'rgba(220, 220, 220, 0.2)',
                            borderColor: 'rgba(220, 220, 220, 1)',
                            pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                            pointBorderColor: '#fff',
                            data: [40, 20, 12, 39, 10, 40, 39, 80, 40],
                          },
                        ],
                      }}
                      options={{
                        plugins: {
                          legend: {
                            labels: {
                              color: getStyle('--cui-body-color'),
                            },
                          },
                        },
                        scales: {
                          x: {
                            grid: {
                              color: getStyle('--cui-border-color-translucent'),
                            },
                            ticks: {
                              color: getStyle('--cui-body-color'),
                            },
                          },
                          y: {
                            grid: {
                              color: getStyle('--cui-border-color-translucent'),
                            },
                            ticks: {
                              color: getStyle('--cui-body-color'),
                            },
                          },
                        },
                      }}
                    />
                    {/* </CCardBody> */}
                  </CCard>
                </div>
              </div>
              <hr className="hr-line" />
              <div className="row">
                <div className="col-4">
                  <div className="label-control mid-font">% of Veh.</div>
                </div>
                <div className="col-4">
                  <div className="label-control mid-font">Last 24 Hrs</div>
                </div>
                <div className="col-4">
                  <div className="label-control mid-font">Month</div>
                </div>
              </div>

              <div className="row">
                <div className="col-4">
                  <div className="label-control mid-font">FTT100</div>
                </div>
                <div className="col-4">
                  <div className={`audits-value mid-font ${getColor(chassisFTTData?.Current_Day_FTT100, 'HD')}`}>
                    {chassisFTTData?.Current_Day_FTT100 ? chassisFTTData?.Current_Day_FTT100 : 'NA'}
                  </div>
                </div>
                <div className="col-4">
                  <div className={`audits-value mid-font ${getColor(chassisFTTData?.Current_Month_FTT100, 'HD')}`}>
                    {chassisFTTData?.Current_Month_FTT100 ? chassisFTTData?.Current_Month_FTT100 : 'NA'}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-4">
                  <div className="label-control mid-font">FTT25</div>
                </div>
                <div className="col-4">
                  <div className={`audits-value mid-font ${getColor(chassisFTTData?.Current_Day_FTT25, 'HD')}`}>
                    {chassisFTTData?.Current_Day_FTT25 ? chassisFTTData?.Current_Day_FTT25 : 'NA'}
                  </div>
                </div>
                <div className="col-4">
                  <div className={`audits-value mid-font ${getColor(chassisFTTData?.Current_Month_FTT25, 'HD')}`}>
                    {chassisFTTData?.Current_Month_FTT25 ? chassisFTTData?.Current_Month_FTT25 : 'NA'}
                  </div>
                </div>
              </div>
            </div>
          </CCol>

          <CCol lg="4">
            <div className="inner-box">
              <div className="row">
                <div className="col-12 align-content-center">
                  <h5 className="vehicleTitle">Demerit Overall</h5>
                </div>
              </div>

              <div className="row align-items-center">
                <div className="col-5 image-box">
                  <div className="image-responsive text-center mt-2  " style={{ paddingTop: '15%', paddingBottom: '15%' }}>
                    <h3>{zone}</h3>
                  </div>
                </div>
                <div className="col-7">
                  <CRow className="inner-wrap-box">
                    <div className="col-md-12 text-center top-audit-title">Number of Vehicles Inspected</div>
                    <div className="col-md-6">
                      <div className="label-control mid-font">Today</div>
                    </div>
                    <div className="col-md-6">
                      <div className="audits-value mid-font">{vehiclesAudited[0]?.Overall_Count}</div>
                    </div>
                    <div className="col-md-6">
                      <div className="label-control mid-font">Month</div>
                    </div>

                    <div className="col-md-6">
                      <div className="audits-value mid-font">{vehiclesAudited[1]?.Overall_Count}</div>
                    </div>
                  </CRow>
                </div>
              </div>
              <hr className="hr-line" />
              <div className="row">
                <div className="col-md-12 gauge-gaurd-title text-center">
                  <h3>Demerit Per Vehicle</h3>
                </div>
                {gaugeDemeritTrend.map((gauge, index) => {
                  return (
                    <div key={index.toString()} className="col-6">
                      <CCard className="main-card-6">
                        <CCardBody>
                          <div className="mb-2">
                            <span className="blue-badge calendar">{gauge.Time_Range == 'CURRENTDATE' ? 'Today' : gauge.Time_Range}</span>
                          </div>
                          <div className="text-center">
                            <ReactSpeedometer
                              textColor={'black'}
                              needleHeightRatio={0.6}
                              labelFontSize={'10px'}
                              valueTextFontSize={'20px'}
                              //   value={parseInt(gauge.Overall_Gaudge) > 200 ? 200 : parseInt(gauge.Overall_Gaudge)}
                              value={gauge?.Overall_Gaudge}
                              //   currentValueText={gauge.Overall_Gaudge}
                              customSegmentStops={[0, 20, 50, 100, 200]}
                              segmentColors={['#6ad72d', '#aee228', 'gold', '#ff471a']}
                              ringWidth={15}
                              minValue={0}
                              maxValue={200}
                              width={140}
                              height={100}
                            />
                          </div>
                        </CCardBody>
                      </CCard>
                    </div>
                  );
                })}
              </div>
              <hr className="hr-line" />
              <div className="row">
                <div className="col-md-12 gauge-gaurd-title  text-center">
                  <h3>Demerit Trend - {mainline}</h3>
                </div>
                {/* <div className="col-md-12 vehicle-trend-title text-center"><h3>Demerit per Vehicle Trend</h3></div> */}
                <div className="col-12">
                  <CCard className="main-card-12">
                    {/* <CCardBody>
                      <CChartLine
                        datasets={[
                          {
                            label: 'HD Demerits',
                            borderColor: '#0d86ff',
                            data: demeritsHD?.data,
                            fill: false,
                          },
                        ]}
                        options={{
                          plugins: {
                            legend: {
                              display: false,
                              position: 'bottom',
                            },
                            tooltip: { enabled: true },
                          },
                          scales: {
                            y: {
                              title: { display: true, text: 'Demerit Per Vehicle', color: '#000' },
                              ticks: { color: '#000', suggestedMin: 10, maxTicksLimit: 8 },
                            },
                            x: { ticks: { color: '#000' } },
                          },
                          animation: {
                            onProgress: drawLineLabels,
                            onComplete: drawLineLabels,
                          },
                        }}
                        labels={demeritsHD?.labels}
                      />
                    </CCardBody> */}
                  </CCard>
                </div>
              </div>
              <hr className="hr-line" />
              <div className="row">
                <div className="col-4">
                  <div className="label-control mid-font">% of Veh.</div>
                </div>
                <div className="col-4">
                  <div className="label-control mid-font">Last 24 Hrs</div>
                </div>
                <div className="col-4">
                  <div className="label-control mid-font">Month</div>
                </div>
              </div>

              <div className="row">
                <div className="col-4">
                  <div className="label-control mid-font">FTT100</div>
                </div>
                <div className="col-4">
                  <div className={`audits-value mid-font ${getColor(zoneFTTData?.Current_Day_FTT100, 'HD')}`}>
                    {zoneFTTData?.Current_Day_FTT100 ? zoneFTTData?.Current_Day_FTT100 : 'NA'}
                  </div>
                </div>
                <div className="col-4">
                  <div className={`audits-value mid-font ${getColor(zoneFTTData?.Current_Month_FTT100, 'HD')}`}>
                    {zoneFTTData?.Current_Month_FTT100 ? zoneFTTData?.Current_Month_FTT100 : 'NA'}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-4">
                  <div className="label-control mid-font">FTT25</div>
                </div>
                <div className="col-4">
                  <div className={`audits-value mid-font ${getColor(zoneFTTData?.Current_Day_FTT25, 'HD')}`}>
                    {zoneFTTData?.Current_Day_FTT25 ? zoneFTTData?.Current_Day_FTT25 : 'NA'}
                  </div>
                </div>
                <div className="col-4">
                  <div className={`audits-value mid-font ${getColor(zoneFTTData?.Current_Month_FTT25, 'HD')}`}>
                    {zoneFTTData?.Current_Month_FTT25 ? zoneFTTData?.Current_Month_FTT25 : 'NA'}
                  </div>
                </div>
              </div>
            </div>
          </CCol>

          <CCol lg="4">
            <div className="inner-box">
              <div className="row">
                <div className="col-12 align-content-center">
                  <h5 className="vehicleTitle">Demerit - Process</h5>
                </div>
              </div>

              <div className="row align-items-center">
                <div className="col-5 image-box">
                  <div className="image-responsive text-center mt-2  " style={{ paddingTop: '15%', paddingBottom: '15%' }}>
                    <h3>{zone}</h3>
                  </div>
                </div>
                <div className="col-7">
                  <CRow className="inner-wrap-box">
                    <div className="col-md-12 text-center top-audit-title">Number of Vehicles Inspected</div>
                    <div className="col-md-6">
                      <div className="label-control mid-font">Today</div>
                    </div>
                    <div className="col-md-6">
                      <div className="audits-value mid-font">{vehiclesAudited[0]?.Process_Count}</div>
                    </div>
                    <div className="col-md-6">
                      <div className="label-control mid-font">Month</div>
                    </div>

                    <div className="col-md-6">
                      <div className="audits-value mid-font">{vehiclesAudited[1]?.Process_Count}</div>
                    </div>
                  </CRow>
                </div>
              </div>
              <hr className="hr-line" />
              <div className="row">
                <div className="col-md-12 gauge-gaurd-title text-center">
                  <h3>Demerit Per Vehicle</h3>
                </div>
                {gaugeDemeritTrend.map((gauge, index) => {
                  return (
                    <div key={index.toString()} className="col-6">
                      <CCard className="main-card-6">
                        <CCardBody>
                          <div className="mb-2">
                            <span className="blue-badge calendar">{gauge.Time_Range == 'CURRENTDATE' ? 'Today' : gauge.Time_Range}</span>
                          </div>
                          <div className="text-center">
                            <ReactSpeedometer
                              textColor={'black'}
                              needleHeightRatio={0.6}
                              labelFontSize={'10px'}
                              valueTextFontSize={'20px'}
                              //   value={parseInt(gauge.Process_Gaudge) > 200 ? 200 : parseInt(gauge.Process_Gaudge)}
                              value={gauge?.Process_Gaudge}
                              //   currentValueText={gauge.Process_Gaudge}
                              customSegmentStops={[0, 20, 50, 100, 200]}
                              segmentColors={['#6ad72d', '#aee228', 'gold', '#ff471a']}
                              ringWidth={15}
                              minValue={0}
                              maxValue={200}
                              width={140}
                              height={100}
                            />
                          </div>
                        </CCardBody>
                      </CCard>
                    </div>
                  );
                })}
              </div>
              <hr className="hr-line" />
              <div className="row">
                <div className="col-md-12 gauge-gaurd-title  text-center">
                  <h3>Demerit Trend - Process</h3>
                </div>
                {/* <div className="col-md-12 vehicle-trend-title text-center"><h3>Demerit per Vehicle Trend</h3></div> */}
                <div className="col-12">
                  <CCard className="main-card-12">
                    {/* <CCardBody>
                      <CChartLine
                        datasets={[
                          {
                            label: 'HD Demerits',
                            borderColor: '#0d86ff',
                            data: demeritsHD?.data,
                            fill: false,
                          },
                        ]}
                        options={{
                          plugins: {
                            legend: {
                              display: false,
                              position: 'bottom',
                            },
                            tooltip: { enabled: true },
                          },
                          scales: {
                            y: {
                              title: { display: true, text: 'Demerit Per Vehicle', color: '#000' },
                              ticks: { color: '#000', suggestedMin: 10, maxTicksLimit: 8 },
                            },
                            x: { ticks: { color: '#000' } },
                          },
                          animation: {
                            onProgress: drawLineLabels,
                            onComplete: drawLineLabels,
                          },
                        }}
                        labels={demeritsHD?.labels}
                      />
                    </CCardBody> */}
                  </CCard>
                </div>
              </div>
              <hr className="hr-line" />
              <div className="row">
                <div className="col-4">
                  <div className="label-control mid-font">% of Veh.</div>
                </div>
                <div className="col-4">
                  <div className="label-control mid-font">Last 24 Hrs</div>
                </div>
                <div className="col-4">
                  <div className="label-control mid-font">Month</div>
                </div>
              </div>

              <div className="row">
                <div className="col-4">
                  <div className="label-control mid-font">FTT100</div>
                </div>
                <div className="col-4">
                  <div className={`audits-value mid-font ${getColor(processFTTData?.Current_Day_FTT100, 'HD')}`}>
                    {processFTTData?.Current_Day_FTT100 ? processFTTData?.Current_Day_FTT100 : 'NA'}
                  </div>
                </div>
                <div className="col-4">
                  <div className={`audits-value mid-font ${getColor(processFTTData?.Current_Month_FTT100, 'HD')}`}>
                    {processFTTData?.Current_Month_FTT100 ? processFTTData?.Current_Month_FTT25 : 'NA'}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-4">
                  <div className="label-control mid-font">FTT25</div>
                </div>
                <div className="col-4">
                  <div className={`audits-value mid-font ${getColor(processFTTData?.Current_Day_FTT25, 'HD')}`}>
                    {processFTTData?.Current_Day_FTT25 ? processFTTData?.Current_Day_FTT25 : 'NA'}
                  </div>
                </div>
                <div className="col-4">
                  <div className={`audits-value mid-font ${getColor(processFTTData?.Current_Month_FTT25, 'HD')}`}>
                    {processFTTData?.Current_Month_FTT25 ? processFTTData?.Current_Month_FTT25 : 'NA'}
                  </div>
                </div>
              </div>
            </div>
          </CCol>
        </CRow>
      }
    </>
  );
};

export default KPIDashboard;
