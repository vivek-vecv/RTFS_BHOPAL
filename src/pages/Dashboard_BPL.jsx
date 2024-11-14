import { useEffect, useRef, useState } from 'react';
import { CButton } from '@coreui/react';
import { FaAngleDoubleRight, FaAngleDoubleLeft, FaPlay, FaPause } from 'react-icons/fa';

import queryString from 'query-string';
import { useLocation } from 'react-router-dom';

import KPIDashboard from './KPIDashboard.jsx';
import AlertScreen from './AlertScreen.jsx';

const Dashboard_BPL = (props) => {
  const location = useLocation();
  const parsed = queryString.parse(location.search);

  const [line, setLine] = useState(parsed.Line || 'Chassis');
  const [zone, setZone] = useState(parsed.Zone || 'QG03L');
  const [screen, setScreen] = useState('KPIDashboard');
  const timeGap = 120;
  const [nextTime, setNextTime] = useState(timeGap);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pause, setPause] = useState(true);
  const lgSTN = 'LMD_QG';

  const dashboardTimer = [
    { screen: 'KPIDashboard', time: timeGap },
    { screen: 'AlertScreen', time: timeGap },
    { screen: 'KPIAudit', time: timeGap },
    { screen: 'AlertScreenAudit', time: timeGap },
    { screen: 'KPIPDI', time: timeGap },
    { screen: 'AlertScreenPDI', time: timeGap },
  ];

  //   let timeOut;
  const timeOut = useRef(null);

  useEffect(() => {
    if (!pause) {
      clearTimeout(timeOut.current);
    }
    timeOut.current = setTimeout(() => {
      clearTimeout(timeOut.current);
      const nextIndex = currentIndex + 1 === dashboardTimer.length ? 0 : currentIndex + 1;
      const nextData = dashboardTimer[nextIndex];
      setScreen(nextData.screen);
      setCurrentIndex(nextIndex);
      setNextTime(nextData.time);
      console.log(nextTime);
    }, nextTime * 1000);

    return () => {
      clearTimeout(timeOut.current);
    };
  }, [currentIndex, pause]);

  const onPause = () => {
    setPause(false);
    setNextTime(100000);
  };

  const onResume = () => {
    setPause(true);
    setNextTime(timeGap);
  };

  const onNext = () => {
    if (currentIndex !== dashboardTimer.length - 1) {
      const nextscr = dashboardTimer[currentIndex + 1];
      setScreen(nextscr.screen);
      const nextScrIndex = currentIndex + 1 === dashboardTimer.length ? 0 : currentIndex + 1;
      setCurrentIndex(nextScrIndex);
    }
  };

  const onPrev = () => {
    if (currentIndex !== 0) {
      const prevscr = dashboardTimer[currentIndex - 1];
      setScreen(prevscr.screen);
      const prevScrIndex = currentIndex - 1 === dashboardTimer.length ? 0 : currentIndex - 1;
      setCurrentIndex(prevScrIndex);
    }
  };

  const renderComponent = () => {
    switch (screen) {
      case 'KPIAudit':
        return <KPIDashboard location={{ search: `?Line=productaudit&Zone=${zone}` }} />;
      case 'AlertScreenAudit':
        return <AlertScreen location={{ search: `?Line=productaudit&Zone=${zone}` }} />;
      case 'KPIPDI':
        return <KPIDashboard location={{ search: `?Line=pdi&Zone=${zone}` }} />;
      case 'AlertScreenPDI':
        return <AlertScreen location={{ search: `?Line=pdi&Zone=${zone}` }} />;
      case 'KPIDashboard':
        return <KPIDashboard location={{ search: `?Line=${line}&Zone=${zone}` }} />;
      case 'AlertScreen':
        return <AlertScreen location={{ search: `?Line=${line}&Zone=${zone}` }} />;

      default:
        return null;
    }
  };

  const renderButton = () => {
    if (pause) {
      return (
        <>
          <div className={'play-pause-btn'}>
            <CButton onClick={onPrev} shape="rounded-3" color="info" size="sm">
              <FaAngleDoubleLeft color="white" />
            </CButton>
            <CButton onClick={onPause} shape="rounded-3" color="info" size="sm">
              <FaPause color="white" />
            </CButton>
            <CButton onClick={onNext} shape="rounded-3" color="info" size="sm">
              <FaAngleDoubleRight color="white" />
            </CButton>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className={'play-pause-btn'}>
            <CButton onClick={onPrev} shape="rounded-3" color="info" size="sm">
              <FaAngleDoubleLeft color="white" />
            </CButton>
            <CButton onClick={onResume} shape="rounded-3" color="info" size="sm">
              <FaPlay color="white" />
            </CButton>
            <CButton onClick={onNext} shape="rounded-3" color="info" size="sm">
              <FaAngleDoubleRight color="white" />
            </CButton>
          </div>
        </>
      );
    }
  };

  return (
    <div className={'page-container'}>
      {renderButton()}
      {renderComponent()}
    </div>
  );
};

export default Dashboard_BPL;
