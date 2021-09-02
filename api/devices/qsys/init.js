const initPA = async (db, channels = 16) => {
  try {
    for (let i = 0; i < channels; i++) {
      db.zone.push({
        channel: i + 1,
        active: false,
        gain: 0,
        mute: false,
        name: '0',
        priority: 0,
        source: 0,
        squelch: 0,
        squelchactive: false,
        bgmgain: 0,
        bgmchannel: 1,
        pagegain: 0,
        pagemute: false,
        messagegain: 0,
        messagemute: false
      })
    }
  } catch (err) {
    console.error('error initPa', err)
  }
}

const initStations = async (db, stations = 4) => {
  try {
    for (let i = 0; i < stations; i++) {
      db.stations.push({
        stationId: (i + 1),
        mode: 'Live',
        archive: false,
        busy: false,
        ready: false,
        speaknow: false,
        split: false,
        stateraw: 0,
        statustext: '',
        zoneselect: []
      })
    }
  } catch (err) {
    console.error('error initStations', err)
  }
}

const initTx = async (db, channels = 4) => {
  for (let i = 0; i < channels; i++) {
    db.tx.push({
      channel1gain: 0,
      channel2gain: 0,
      channel1mute: false,
      channel2mute: false,
      datarate: '',
      enable: false,
      format: '',
      host: '',
      interface: 'Auto',
      meter1: 0,
      meter2: 0,
      multicastttl: 0,
      port: 0,
      protocol: '',
      status: '',
      statusled: false,
      svsiaddress: '',
      svsistream: 0
    })
  }
}

const initRx = async (db, channels = 4) => {
  for (let i = 0; i < channels; i++) {
    db.rx.push({
      channel1gain: 0,
      channel2gain: 0,
      channel1mute: false,
      channel2mute: false,
      enable: false,
      url: '',
      interface: 'Auto',
      channel1peaklevel: 0,
      channel2peaklevel: 0,
      netcache: 0,
      status: '',
      statusled: false
    })
  }
}

module.exports = { initPA, initStations, initTx, initRx }