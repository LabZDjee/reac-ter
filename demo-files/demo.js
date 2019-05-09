const configuration = {
  projectName: "Big Business",
  projectOrigin: "turnkey EPC, Ltd",
  projectOrder: "x2xy",
  project: "incredible but true",
  projectNotes: `Nulla voluptate anim cillum ut nulla non amet veniam nulla est ad sit cillum nisi.
Adipisicing quis et irure elit laborum cillum cupidatat sit magna.
Nisi sit consectetur aliquip voluptate est minim exercitation eiusmod aliquip.`,
  systemRoomTemperature: 35,
  systemAltitude: 300,
  systemAcMeter: true,
  systemLanguage: "French",
  alarmMainsEnabled: true,
  alarmMainsRelay: 4,
  alarmMainsMax: 300,
  alarmMainsMin: 200,
  alarmSystemRoomTemperature: false,
  alarmMainsDisplayLatch: true,
  alarmMainsRelayLatch: false,
  alarmMainsDelay: 4,
  alarmHCVEnabled: true,
  alarmHCVRelay: 5,
  alarmHCVHighrate: 33,
  alarmHCVFloating: 34,
  alarmHCVDisplayLatch: true,
  alarmHCVRelayLatch: false,
  alarmHCVDelay: 60,
  alarmSpare1Enabled: true,
  alarmSpare1Relay: 9,
  alarmSpare1Text: "spare 1",
  alarmSpare1DisplayLatch: true,
  alarmSpare1RelayLatch: false,
  alarmCommonEnbled: true,
  alarmCommonRelayLatch: true,
};

const configAccessor = new ReacTer();

// makes configAccessor track configuration entirely
Object.keys(configuration).forEach((key) => {
  configAccessor.addProperty(configuration, key);
});

var app = new Vue({
  el: "#app",
  data: {
    projectName: configAccessor.projectName,
    systemRoomTemperature: configAccessor.systemRoomTemperature,
    editedProjectName: configAccessor.projectName,
  },
  methods: {
    newProjectName(e) {
      configAccessor.projectName = filter(e.target.value);
    },
    resetProjectName() {
      configAccessor.projectName = "Big Business";
    },
  },
  computed: {
    temperatureAlarm() {
      return this.systemRoomTemperature < 10 || this.systemRoomTemperature > 90;
    },
    edidtedProjectNameAlarm() {
      return filter(this.editedProjectName, true);
    },
  },
});

// filter which imposes a maximum length and every word capitalized on its first
// letter only
function filter(value, truthnessOnly = false) {
  const filteredValue = _.startCase(_.toLower(value))
    .trim()
    .substr(0, 23);
  if (truthnessOnly) {
    return filteredValue !== value.trim();
  }
  return filteredValue;
}

// informs Vue data of external changes
configAccessor.$watchers.projectName.push((v) => {
  app.projectName = v;
  app.editedProjectName = v;
});
configAccessor.$watchers.systemRoomTemperature.push((v) => {
  app.systemRoomTemperature = v;
});
configAccessor.$watchers.alarmSystemRoomTemperature.push((v) => {
  app.alarmSystemRoomTemperature = v;
});

// emulates temperature changes
setInterval(() => {
  const temperatureInTenth = Math.floor(Math.random() * 1300) - 100;
  const roomTemperature = temperatureInTenth / 10.0;
  configAccessor.systemRoomTemperature = roomTemperature;
}, 1000);
