
 [setToastVisible] = useState(false);
 [setProcess] = useState('static');
 [setChassisNumber('') = useState('');
 [setFullChassisNumber('')] = useState('');
 [setEngineNumber('')] = useState('');
 [setModel('')] = useState('');
 [setSeries('')] = useState('');
 [setShiftOptions([])] = useState([]);
 [setAuditorOptions([])] = useState([]);
 [setOperatorOptions([])] = useState([]);
 [setPartOptions([])] = useState([]);
 [setDefectOptions([])] = useState([]);
 [setIsDisabled(true)] = useState(true);
 [setError] = useState('');
 [setMsg] = useState('');

 [setTableEntries] = useState([]);
 [serialInfo, setSerialInfo] = useState({
  Series: '',
  Engine_Number: '',
  Model: '',
  Rollout_Date: '',
  Serial_Number: '',
});
 [setSelectedDefects] = useState([]);
 [setSelectedPart] = useState(null);
 [setTotalDefects] = useState(0);
 [setTotalDemerits] = useState(0);

 [setSearchTerm('')] = useState('');
 [setAuditDate('')] = useState('');
 [setAuditorName('')] = useState('');


setTableEntries([])
setSerialInfo({
  Series: '',
  Engine_Number: '',
  Model: '',
  Rollout_Date: '',
  Serial_Number: '',
})
setSelectedPart(null)
setSearchTerm('')
setAuditDate('')
setAuditorName('')
