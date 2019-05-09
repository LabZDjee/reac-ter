const refData = {
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
  alarms: {
    mainsEnabled: true,
    mainsRelay: 4,
    mainsMax: 300,
    mainsMin: 200,
    systemRoomTemperature: false,
    mainsDisplayLatch: true,
    mainsRelayLatch: false,
    mainsDelay: 4,
    hcvEnabled: true,
    hcvRelay: 5,
    hcvHighrate: 33,
    hcvFloating: 34,
    hcvDisplayLatch: true,
    hcvRelayLatch: false,
    hcvDelay: 60,
    spare1Enabled: true,
    spare1Relay: 9,
    spare1Text: "spare 1",
    spare1DisplayLatch: true,
    spare1RelayLatch: false,
    commonEnbled: true,
    commonRelayLatch: true,
  },
};

module.exports = { refData };
